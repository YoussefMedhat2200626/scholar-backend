import os
import re
import psycopg2

def get_postgres_url() -> str:
    # First try environment variable
    url = os.environ.get("POSTGRES_URL")
    if url:
        return url
        
    # If not in env, try to read from .env.local
    try:
        env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".env.local")
        with open(env_path, "r") as f:
            for line in f:
                if line.startswith("POSTGRES_URL="):
                    return line.strip().split("=", 1)[1].strip('"\'')
    except Exception:
        pass
        
    raise ValueError("POSTGRES_URL not found!")

JUNK_KEYWORDS = [
    '%marketing%', '%seo%', '%sales%', '%human resources%',
    '%recruit%', '%talent%', '%accountant%', '%accounting%', '%finance%',
    '%financial%', '%tax%', '%business development%',
    '%content%', '%copywriter%', '%writer%', '%editor%', '%social media%',
    '%annotator%', '%kitchen%', '%chef%', '%assistant%', '%office%',
    '%legal%', '%lawyer%', '%attorney%', '%coach%', '%instructor%',
    '%teacher%', '%translator%', '%translation%', '%procurement%',
    '%supply chain%', '%logistics%', '%cargo%', '%inventory%',
    '%merchandiser%', '%quality inspector%', '%pharmac%', '%clinic%',
    '%doctor%', '%nurse%', '%medical%', '%healthcare%', '%civil%',
    '%mechanical%', '%strategy%', '%strategist%',
    '%art director%', '%buyer%', '%customer service%',
    '%customer success%', '%event%',
    '%brand%', '%community manager%',
    '%partnership%', '%public relations%', '%communications%',
    '%journalis%', '%videograph%', '%video editor%', '%photograph%',
    '%graphic design%', '%interior design%', '%fashion%'
]

TECH_PROTECT_KEYWORDS = [
    '%developer%', '%software%', '%programmer%',
    '%architect%', '%tech lead%', '%lead developer%', '%devops%',
    '%ui/ux%', '%ux/ui%', '%product design%', '%ui design%', '%ux design%',
    '%frontend%', '%front-end%', '%backend%', '%back-end%',
    '%fullstack%', '%full-stack%', '%data scientist%', '%data analyst%', '%data engineer%',
    '%quality assurance%', '%sre%', '%web developer%',
    '%qa%', '%qa engineer%', '%qa analyst%', '%qa tester%', '%qa lead%', '%qa specialist%',
    '%sdet%', '%test engineer%', '%automation engineer%',
    '%cloud engineer%', '%systems engineer%', '%platform engineer%', '%infrastructure engineer%',
    '%mobile engineer%', '%ios engineer%', '%android engineer%', '%network engineer%',
    '%security engineer%', '%machine learning%', '%ml engineer%', '%ai engineer%',
    '%principal engineer%', '%staff engineer%', '%lead engineer%'
]


def is_junk_title(title: str) -> bool:
    """Evaluate whether a job title is considered junk (non-engineering)."""
    title_lower = title.lower()
    for prot in TECH_PROTECT_KEYWORDS:
        clean_prot = prot.strip("%").lower()
        if clean_prot in title_lower:
            return False

    for junk in JUNK_KEYWORDS:
        clean_junk = junk.strip("%").lower()
        if clean_junk in title_lower:
            return True

    return False


def build_cleanup_clauses(placeholder: str = "%s") -> tuple[str, list[str]]:
    """Build SQL WHERE clause protecting tech roles while filtering junk titles."""
    junk_clause = " OR ".join([f"title ILIKE {placeholder}" for _ in JUNK_KEYWORDS])
    protect_clause = " AND ".join([f"title NOT ILIKE {placeholder}" for _ in TECH_PROTECT_KEYWORDS])
    where_clause = f"({junk_clause}) AND ({protect_clause})"
    params = list(JUNK_KEYWORDS) + list(TECH_PROTECT_KEYWORDS)
    return where_clause, params


def run_cleanup(should_delete=False):
    url = get_postgres_url()
    conn = psycopg2.connect(url)
    
    where_clause, params = build_cleanup_clauses("%s")
    
    try:
        with conn.cursor() as cur:
            # 1. First, let's just COUNT how many total jobs we have
            cur.execute("SELECT count(*) FROM jobs")
            total_jobs = cur.fetchone()[0]
            print(f"Total jobs currently in database: {total_jobs}")
            
            # 2. Count how many match our 'junk' keywords while excluding tech roles
            query = f"SELECT count(*) FROM jobs WHERE {where_clause}"
            cur.execute(query, params)
            junk_count = cur.fetchone()[0]
            
            print(f"Jobs matching non-engineering keywords (Marketing, SEO, Sales, etc.): {junk_count}")
            
            # 3. Actually select a few to show as examples
            if junk_count > 0:
                example_query = f"SELECT title, company FROM jobs WHERE {where_clause} LIMIT 5"
                cur.execute(example_query, params)
                print("\nExamples of jobs that would be deleted:")
                for row in cur.fetchall():
                    print(f" - {row[0]} at {row[1]}")
            
            # 4. Delete if requested
            if should_delete and junk_count > 0:
                print("\nDeleting non-engineering jobs...")
                delete_query = f"DELETE FROM jobs WHERE {where_clause}"
                cur.execute(delete_query, params)
                conn.commit()
                print(f"Successfully deleted {cur.rowcount} jobs!")
                    
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    import sys
    should_delete = "--delete" in sys.argv
    run_cleanup(should_delete)
