import os
from db import connect
try:
    with connect() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, title, company, is_taken FROM jobs WHERE company ILIKE '%TiEngineer%'")
            print("DB Jobs:")
            for row in cur.fetchall():
                print(row)
except Exception as e:
    print(e)
