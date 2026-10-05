import os
import sys
import json

sys.path.append(os.path.join(os.getcwd(), 'scripts/bot'))
from sources.linkedin import fetch_linkedin, _fresh_params, TARGET_COMPANIES
from db import connect, upsert_jobs

STATE_FILE = 'backfill_state.json'

def main():
    # Load state
    state = {'index': 0}
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, 'r') as f:
            state = json.load(f)
            
    start_idx = state.get('index', 0)
    
    # If we reached the end, reset to 0 so it continuously checks in a slow loop
    if start_idx >= len(TARGET_COMPANIES):
        print("Finished a full cycle of all target companies. Resetting to beginning.")
        start_idx = 0
        
    # Process 2 companies per run to stay well below LinkedIn's rate limits
    chunk_size = 2 
    end_idx = min(start_idx + chunk_size, len(TARGET_COMPANIES))
    
    companies_to_process = TARGET_COMPANIES[start_idx:end_idx]
    print(f"Processing companies {start_idx} to {end_idx-1} out of {len(TARGET_COMPANIES)}: {companies_to_process}")
    
    searches = []
    for company in companies_to_process:
        searches.append(_fresh_params(keywords=company, location="Egypt", f_TPR="r2592000"))
        
    jobs = fetch_linkedin(
        searches=searches,
        max_pages_per_search=3,
        request_delay=3.0
    )
    
    print(f"Total potential jobs found: {len(jobs)}")
    
    if jobs:
        try:
            with connect() as conn:
                new, updated = upsert_jobs(conn, jobs)
                print(f"Successfully saved {new} new jobs, updated {updated} jobs.")
        except Exception as e:
            print("Failed to save:", e)
            
    # Update state for the next run
    state['index'] = end_idx
    with open(STATE_FILE, 'w') as f:
        json.dump(state, f)
        
    print(f"State updated. Next run will start at index {end_idx}.")

if __name__ == "__main__":
    main()
