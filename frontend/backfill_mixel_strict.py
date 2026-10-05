import os
import sys

sys.path.append(os.path.join(os.getcwd(), 'scripts/bot'))
from sources.wuzzuf import fetch_wuzzuf
from sources.linkedin import fetch_linkedin, _fresh_params
from db import connect, upsert_jobs

def main():
    print("Fetching Wuzzuf jobs for Mixel...")
    # Wuzzuf search for "Mixel"
    wuzzuf_jobs = fetch_wuzzuf(search_keywords=["Mixel", "Mixel Egypt"])
    
    # Filter only Mixel
    valid_jobs = []
    for j in wuzzuf_jobs:
        if j.company and 'mixel' in j.company.lower():
            valid_jobs.append(j)

    print(f"Found {len(valid_jobs)} Mixel jobs on Wuzzuf.")

    print("Fetching LinkedIn jobs for Mixel...")
    linkedin_jobs = fetch_linkedin(
        searches=[
            _fresh_params(keywords="Mixel", location="Egypt", f_TPR="r2592000"),
            _fresh_params(keywords="Mixel-Egypt", location="Egypt", f_TPR="r2592000")
        ],
        max_pages_per_search=5, request_delay=1.5
    )
    
    for j in linkedin_jobs:
        if j.company and 'mixel' in j.company.lower():
            valid_jobs.append(j)

    print(f"Total valid Mixel jobs found: {len(valid_jobs)}")
    
    if valid_jobs:
        try:
            with connect() as conn:
                new, updated = upsert_jobs(conn, valid_jobs)
                print(f"Successfully saved {new} new Mixel jobs, updated {updated} jobs.")
        except Exception as e:
            print("Failed to save:", e)
    else:
        print("No Mixel jobs found.")

if __name__ == "__main__":
    main()
