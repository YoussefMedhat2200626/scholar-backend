import os
import json
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

# Helper to serialize datetime objects for JSON
def datetime_handler(x):
    if isinstance(x, datetime):
        return x.isoformat()
    raise TypeError("Unknown type")

def get_postgres_url() -> str:
    url = os.environ.get("POSTGRES_URL")
    if url:
        return url
        
    try:
        env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env.local")
        with open(env_path, "r") as f:
            for line in f:
                if line.startswith("POSTGRES_URL="):
                    return line.strip().split("=", 1)[1].strip('"\'')
    except Exception:
        pass
        
    raise ValueError("POSTGRES_URL not found in environment or .env.local!")

def export_to_json():
    print("Connecting to database...")
    url = get_postgres_url()
    conn = psycopg2.connect(url)
    
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT * FROM jobs ORDER BY first_seen_at DESC")
            rows = cur.fetchall()
            
            output_file = "jobs_export.json"
            print(f"Exporting {len(rows)} jobs to {output_file}...")
            
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(rows, f, default=datetime_handler, indent=4, ensure_ascii=False)
                
            print(f"Successfully exported data to {output_file}")
            
    except Exception as e:
        print(f"Error during export: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    export_to_json()
