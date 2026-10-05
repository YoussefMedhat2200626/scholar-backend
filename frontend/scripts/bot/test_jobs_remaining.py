from db import connect
try:
    with connect() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, title, first_seen_at FROM jobs WHERE title ILIKE '%Deloitte Innovation Hub%'")
            jobs = cur.fetchall()
            print("Deloitte jobs:", len(jobs))
except Exception as e:
    pass
