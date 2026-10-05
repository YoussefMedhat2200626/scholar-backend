from db import connect
try:
    with connect() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT count(*) FROM jobs")
            print("Total jobs:", cur.fetchone()[0])
            cur.execute("SELECT id, title, first_seen_at FROM jobs ORDER BY first_seen_at ASC LIMIT 10")
            print("Oldest 10 jobs:")
            for j in cur.fetchall():
                print(j)
except Exception as e:
    print("Error:", e)
