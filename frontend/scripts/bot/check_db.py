import os
from db import connect
import json

try:
    with connect() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, title, first_seen_at, last_seen_at, is_taken FROM jobs WHERE title ILIKE '%Deloitte Innovation Hub%'")
            jobs = cur.fetchall()
            print("Postgres jobs:")
            for j in jobs:
                print(j)
                
            cur.execute("SELECT count(*) FROM jobs")
            print("Total Postgres jobs:", cur.fetchone()[0])
            
            cur.execute("SELECT (NOW() - INTERVAL '14 days')::text")
            print("Cutoff SQL test:", cur.fetchone()[0])
except Exception as e:
    print("Postgres error:", e)

# Also check JSON file
try:
    with open("../../jobs_export.json", "r", encoding="utf-8") as f:
        data = json.load(f)
        found = [j for j in data if "Deloitte Innovation Hub" in j.get("title", "")]
        print("JSON jobs count total:", len(data))
        if found:
            print("Found in JSON:", found[0]["title"], found[0].get("first_seen_at"), found[0].get("is_taken"))
        else:
            print("Not found in JSON.")
except Exception as e:
    print("JSON error:", e)
