"""
LinkedIn Expiry Checker
=======================
Checks stored LinkedIn jobs to see if they are still accepting applications.

For each candidate job the script:
  1. GETs https://www.linkedin.com/jobs/view/<job_id>
  2. Considers the job EXPIRED when:
     - The final URL after redirects resolves to /jobs/search (deleted listing), OR
     - The response HTML contains a known "no longer accepting applications" marker.
  3. HTTP errors (429, 5xx, connection failures) are treated as UNKNOWN and leave
     is_taken = false to avoid false-positive removals.

Jobs older than max_age_days are auto-expired without an HTTP check (too stale).
Brand-new jobs (younger than min_age_hours) are skipped — they are unlikely to be
closed already.

Usage:
    python linkedin_expiry_checker.py
    python linkedin_expiry_checker.py --dry-run
    python linkedin_expiry_checker.py --batch-size 30 --min-age-hours 12 --max-age-days 30
"""

from __future__ import annotations

import argparse
import html
import logging
import os
import re
import time

import requests

from db import (
    connect,
    get_jobs_due_for_weekly_check,
    mark_job_checked,
    mark_job_taken,
    purge_jobs_older_than_two_weeks,
)

# --- Logging -----------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("expiry")

# --- Constants ----------------------------------------------------------------

LINKEDIN_JOB_URL = "https://www.linkedin.com/jobs/view/{job_id}"

CLOSED_MARKERS: tuple[str, ...] = (
    "no longer accepting applications",
    "this job is no longer accepting applications",
    "job is no longer available",
    "no longer available",
    "application deadline has passed",
    "this job is closed",
)

EXPIRED_REDIRECT_PATHS: tuple[str, ...] = (
    "/jobs/search",
)

AUTHWALL_REDIRECT_PATHS: tuple[str, ...] = (
    "/authwall",
    "/uas/login",
    "/login",
    "/checkpoint",
)

_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/125.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

RESULT_ACTIVE = "active"
RESULT_EXPIRED = "expired"
RESULT_UNKNOWN = "unknown"


def check_linkedin_job(
    job_id: str,
    *,
    timeout: int = 15,
    session: requests.Session | None = None,
) -> str:
    """Return RESULT_ACTIVE, RESULT_EXPIRED, or RESULT_UNKNOWN."""
    if not job_id:
        log.warning("check_linkedin_job called with empty job_id -- skipping.")
        return RESULT_UNKNOWN

    url = LINKEDIN_JOB_URL.format(job_id=job_id)
    sess = session or requests.Session()

    try:
        resp = sess.get(
            url,
            headers=_HEADERS,
            timeout=timeout,
            allow_redirects=True,
        )
    except requests.RequestException as exc:
        log.warning("  Network error checking %s: %s", url, exc)
        return RESULT_UNKNOWN

    final_path = resp.url.split("?")[0].lower()
    if any(p in final_path for p in EXPIRED_REDIRECT_PATHS):
        log.debug("  redirected to search %s -> EXPIRED", resp.url)
        return RESULT_EXPIRED

    if any(p in final_path for p in AUTHWALL_REDIRECT_PATHS):
        log.warning("  redirected to authwall/login %s -> UNKNOWN", resp.url)
        return RESULT_UNKNOWN

    if resp.status_code == 429:
        log.warning("  429 Too Many Requests for job %s -- treating as UNKNOWN", job_id)
        return RESULT_UNKNOWN

    if resp.status_code >= 500:
        log.warning("  Server error %s for job %s -- treating as UNKNOWN", resp.status_code, job_id)
        return RESULT_UNKNOWN

    if resp.status_code == 404:
        log.debug("  404 for job %s -> EXPIRED", job_id)
        return RESULT_EXPIRED

    if resp.status_code != 200:
        log.warning(
            "  Unexpected status %s for job %s -- treating as UNKNOWN", resp.status_code, job_id
        )
        return RESULT_UNKNOWN

    body = _clean_html(resp.text).lower()
    if any(marker in body for marker in CLOSED_MARKERS):
        log.debug("  closed marker found for job %s -> EXPIRED", job_id)
        return RESULT_EXPIRED

    return RESULT_ACTIVE


def _clean_html(raw: str) -> str:
    """Strip HTML tags, unescape entities, collapse whitespace."""
    text = html.unescape(raw)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def run_expiry_check(
    *,
    batch_size: int = 50,
    min_age_hours: int = 6,
    max_age_days: int = 30,
    request_delay: float = 5.0,
    dry_run: bool = False,
    purge_stale: bool = False,
) -> dict[str, int]:
    """Run a full expiry-check cycle and return a summary dict."""

    summary: dict[str, int] = {
        "stale_auto_expired": 0,
        "checked": 0,
        RESULT_ACTIVE: 0,
        RESULT_EXPIRED: 0,
        RESULT_UNKNOWN: 0,
    }

    with connect() as conn:
        if purge_stale:
            if dry_run:
                log.info("DRY RUN -- skipping stale auto-expiry DB writes")
            else:
                stale = purge_jobs_older_than_two_weeks(conn, max_age_days=max_age_days)
                summary["stale_auto_expired"] = stale
                if stale:
                    log.info(
                        "Auto-expired %d stale LinkedIn jobs (>%d days old)", stale, max_age_days
                    )

        candidates = get_jobs_due_for_weekly_check(
            conn,
            min_age_days=7,
            max_age_days=max_age_days,
            limit=batch_size,
        )
        log.info("Checking %d LinkedIn jobs for availability...", len(candidates))

        sess = requests.Session()

        for job in candidates:
            if job.source != "linkedin":
                continue
            job_id = job.source_job_id or _extract_job_id_from_url(job.url)
            display = "[%d] %s @ %s" % (job.id, job.title, job.company)

            if not job_id:
                log.warning("  No job ID for %s -- skipping", display)
                continue

            result = check_linkedin_job(job_id, session=sess)
            summary["checked"] += 1
            summary[result] += 1

            if result == RESULT_EXPIRED:
                log.info("  EXPIRED  -- %s", display)
                if not dry_run:
                    mark_job_taken(conn, job.id)
            elif result == RESULT_ACTIVE:
                log.info("  active   -- %s", display)
                if not dry_run:
                    mark_job_checked(conn, job.id)
            else:
                log.info("  unknown  -- %s (leaving state unchanged)", display)

            if request_delay > 0:
                time.sleep(request_delay)

    return summary


def _extract_job_id_from_url(url: str) -> str:
    """Fallback: extract numeric LinkedIn job ID from a URL string."""
    match = re.search(
        r"/jobs/view/(?:[^/?#]*-)?(\d+)(?:[/?#]|$)", url or "", re.IGNORECASE
    )
    return match.group(1) if match else ""


def main() -> None:
    parser = argparse.ArgumentParser(description="LinkedIn job availability checker.")
    parser.add_argument("--dry-run", action="store_true", help="Report status without updating DB.")
    parser.add_argument("--batch-size", type=int, default=50, help="Max jobs to check.")
    parser.add_argument("--delay", type=float, default=5.0, help="Delay between requests in seconds.")
    parser.add_argument("--purge-stale", action="store_true", help="Purge stale jobs older than 30 days.")
    args = parser.parse_args()

    run_expiry_check(
        batch_size=args.batch_size,
        request_delay=args.delay,
        dry_run=args.dry_run,
        purge_stale=args.purge_stale,
    )


if __name__ == "__main__":
    main()
