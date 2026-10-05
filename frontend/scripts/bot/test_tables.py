from db import connect
try:
    with connect() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """)
            print("Tables:", cur.fetchall())
except Exception as e:
    print("Error:", e)
