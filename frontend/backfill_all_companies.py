import os
import sys

sys.path.append(os.path.join(os.getcwd(), 'scripts/bot'))
from sources.linkedin import fetch_linkedin, _fresh_params, TARGET_COMPANIES
from db import connect, upsert_jobs

def main():
    print("Fetching LinkedIn jobs for all target companies for the last month...")
    searches = []
    for company in TARGET_COMPANIES:
        searches.append(_fresh_params(keywords=company, location="Egypt", f_TPR="r2592000"))
        # Also worldwide for remote or generic if we wanted, but sticking to Egypt is safer.

    jobs = fetch_linkedin(
        searches=searches,
        max_pages_per_search=3,
        request_delay=1.5
    )
    
    print(f"Total potential jobs found across all companies: {len(jobs)}")
    
    if jobs:
        try:
            with connect() as conn:
                new, updated = upsert_jobs(conn, jobs)
                print(f"Successfully saved {new} new jobs, updated {updated} jobs across all target companies.")
        except Exception as e:
            print("Failed to save:", e)
    else:
        print("No jobs found.")

if __name__ == "__main__":
    main()
