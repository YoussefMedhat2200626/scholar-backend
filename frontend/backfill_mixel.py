import os
import sys

# Setup environment to run the bot modules
sys.path.append(os.path.join(os.getcwd(), 'scripts/bot'))
from sources.linkedin import fetch_linkedin, _fresh_params
from db import connect, upsert_jobs

def main():
    print("Fetching Mixel jobs from the last month...")
    # 2592000 seconds = 30 days
    searches = [
        _fresh_params(keywords="Mixel", location="Egypt", f_TPR="r2592000"),
        _fresh_params(keywords="Mixel-Egypt", location="Egypt", f_TPR="r2592000")
    ]
    
    # fetch_linkedin has max_pages_per_search
    jobs = fetch_linkedin(searches=searches, max_pages_per_search=3, request_delay=2.0)
    
    print(f"Found {len(jobs)} potential jobs.")
    
    if jobs:
        try:
            with connect() as conn:
                new, updated = upsert_jobs(conn, jobs)
                print(f"Successfully saved {new} new Mixel jobs, updated {updated} jobs.")
        except Exception as e:
            print("Failed to save:", e)
    else:
        print("No Mixel jobs found.")

if __name__ == "__main__":
    main()
