import sqlite3
import psycopg2
import os
import sys

# Ensure we can import from the current directory
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from db import upsert_jobs
from models import Job
import json

def get_postgres_url() -> str:
    # Read from .env.local
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".env.local")
    try:
        with open(env_path, "r") as f:
            for line in f:
                if line.startswith("POSTGRES_URL="):
                    return line.strip().split("=", 1)[1].strip('"\'')
    except Exception:
        pass
    raise ValueError("POSTGRES_URL not found!")

def migrate():
    sqlite_db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "jobs.db")
    
    if not os.path.exists(sqlite_db_path):
        print(f"SQLite DB not found at {sqlite_db_path}")
        return

    # Connect to SQLite
    print("Connecting to SQLite...")
    sl_conn = sqlite3.connect(sqlite_db_path)
    sl_conn.row_factory = sqlite3.Row
    sl_cur = sl_conn.cursor()
    
    # Connect to Postgres
    print("Connecting to Postgres...")
    pg_url = get_postgres_url()
    pg_conn = psycopg2.connect(pg_url)
    
    try:
        # Fetch all jobs from SQLite
        sl_cur.execute("SELECT * FROM jobs")
        rows = sl_cur.fetchall()
        print(f"Found {len(rows)} jobs in SQLite.")
        
        jobs_to_migrate = []
        for row in rows:
            # Parse tags_json
            tags = []
            try:
                if row["tags_json"]:
                    tags = json.loads(row["tags_json"])
            except:
                pass
                
            job = Job(
                title=row["title"],
                company=row["company"],
                location=row["location"],
                url=row["url"],
                source=row["source"],
                salary=row["salary"] if "salary" in row.keys() else "",
                job_type=row["job_type"] if "job_type" in row.keys() else "",
                tags=tags,
                is_remote=bool(row["is_remote"]) if "is_remote" in row.keys() else False,
                original_source=row["original_source"] if "original_source" in row.keys() else ""
            )
            jobs_to_migrate.append(job)
            
        print(f"Mapped {len(jobs_to_migrate)} jobs. Upserting to Postgres...")
        
        inserted, refreshed = upsert_jobs(pg_conn, jobs_to_migrate)
        pg_conn.commit()
        
        print(f"Migration complete! Inserted: {inserted}, Refreshed: {refreshed}")
        
    except Exception as e:
        print(f"Migration failed: {e}")
        pg_conn.rollback()
    finally:
        sl_conn.close()
        pg_conn.close()

if __name__ == "__main__":
    migrate()
