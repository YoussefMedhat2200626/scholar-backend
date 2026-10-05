import os
from db import connect, purge_jobs_older_than_30_days

try:
    with connect() as conn:
        with conn.cursor() as cur:
            # Insert a fake job
            cur.execute("""
                INSERT INTO jobs (source, source_job_id, title, company, location, url, canonical_url, is_taken, first_seen_at, last_seen_at)
                VALUES ('linkedin', 'test_123', 'Senior Java Backend Developer', 'Deloitte', 'Cairo', 'http://test', 'http://test', false, '2026-07-30T12:00:00Z', '2026-09-01T12:00:00Z')
                RETURNING id
            """)
            job_id = cur.fetchone()[0]
            print(f"Inserted fake job {job_id} with first_seen_at='2026-07-30T12:00:00Z' and last_seen_at='2026-09-01T12:00:00Z'")
            
            # Check count
            cur.execute("SELECT count(*) FROM jobs")
            print("Jobs count before purge:", cur.fetchone()[0])
            
        # Run purge
        purged = purge_jobs_older_than_30_days(conn, 30)
        print("Purged count:", purged)
        
        with conn.cursor() as cur:
            cur.execute("SELECT count(*) FROM jobs")
            print("Jobs count after purge:", cur.fetchone()[0])
            
        # rollback
        conn.rollback()
except Exception as e:
    print("Error:", e)
