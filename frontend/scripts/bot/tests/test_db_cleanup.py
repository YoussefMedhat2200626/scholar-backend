import os
import sys
import sqlite3
import unittest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from db_cleanup import (
    JUNK_KEYWORDS,
    TECH_PROTECT_KEYWORDS,
    is_junk_title,
    build_cleanup_clauses,
)


class TestDbCleanup(unittest.TestCase):
    def test_design_media_pr_abbreviations_are_not_in_junk_keywords(self):
        """Ensure '%design%', '%media%', '%pr %', '%hr %', '%bd %' are not present in junk keywords."""
        self.assertNotIn("%design%", JUNK_KEYWORDS)
        self.assertNotIn("%media%", JUNK_KEYWORDS)
        self.assertNotIn("%pr %", JUNK_KEYWORDS)
        self.assertNotIn("%hr %", JUNK_KEYWORDS)
        self.assertNotIn("%bd %", JUNK_KEYWORDS)
        self.assertNotIn("%market%", JUNK_KEYWORDS)  # replaced by %marketing%

    def test_tech_protect_keywords_have_no_unintended_spaces(self):
        """Ensure '%qa%' is present without trailing space, and no protect keyword has unintended boundary spaces."""
        self.assertIn("%qa%", TECH_PROTECT_KEYWORDS)
        self.assertNotIn("%qa %", TECH_PROTECT_KEYWORDS)
        for kw in TECH_PROTECT_KEYWORDS:
            stripped = kw.strip("%")
            self.assertEqual(
                stripped,
                stripped.strip(),
                f"Keyword '{kw}' has unintended leading or trailing space inside the % wildcards.",
            )

    def test_ui_ux_roles_are_protected(self):
        protected_titles = [
            "UI/UX Designer",
            "Senior UI/UX Designer",
            "Product Designer",
            "Lead Product Designer",
            "UX/UI Specialist",
            "UI Designer",
            "UX Designer",
        ]
        for title in protected_titles:
            self.assertFalse(
                is_junk_title(title),
                f"Title '{title}' should NOT be classified as junk.",
            )

    def test_intermediate_and_lead_developer_roles_are_protected(self):
        protected_titles = [
            "Intermediate Developer",
            "Intermediate Backend Engineer",
            "Senior Principal Engineer",
            "Tech Lead",
            "Lead Developer",
            "Product Owner",
            "Lead Project Manager",
            "DevOps Engineer",
            "Marketplace Backend Developer",
            "E-commerce Fullstack Engineer",
            "Video Streaming Engineer",
        ]
        for title in protected_titles:
            self.assertFalse(
                is_junk_title(title),
                f"Title '{title}' should NOT be classified as junk.",
            )

    def test_actual_junk_roles_are_detected(self):
        junk_titles = [
            "Digital Marketing Specialist",
            "SEO Specialist",
            "Sales Representative",
            "Human Resources Manager",
            "Talent Acquisition Recruiter",
            "Senior Accountant",
            "Tax Consultant",
            "Social Media Specialist",
            "Head Chef",
            "Legal Advisor",
            "Graphic Designer",
            "Interior Designer",
            "Civil Engineer",
            "Medical Doctor",
            "Public Relations Manager",
        ]
        for title in junk_titles:
            self.assertTrue(
                is_junk_title(title),
                f"Title '{title}' should be classified as junk.",
            )

    def test_qa_roles_are_protected_in_python(self):
        qa_titles = [
            "Senior QA",
            "QA/Automation Engineer",
            "QA-Engineer",
            "QA",
            "Content QA",
            "Event QA",
            "Marketing QA",
            "Lead QA Tester",
            "QA Analyst",
            "SDET",
            "Quality Assurance Specialist",
        ]
        for title in qa_titles:
            self.assertFalse(
                is_junk_title(title),
                f"QA title '{title}' should NOT be classified as junk.",
            )

    def test_cleanup_sql_in_sqlite(self):
        """Verify the generated SQL query deletes junk while preserving all tech and QA roles."""
        conn = sqlite3.connect(":memory:")
        conn.execute("CREATE TABLE jobs (id INTEGER PRIMARY KEY, title TEXT)")

        test_jobs = [
            (1, "UI/UX Designer"),
            (2, "Product Designer"),
            (3, "Intermediate Developer"),
            (4, "Senior Principal Engineer"),
            (5, "Tech Lead"),
            (6, "Marketplace Backend Developer"),
            (7, "Senior QA"),
            (8, "QA/Automation Engineer"),
            (9, "QA-Engineer"),
            (10, "QA"),
            (11, "Content QA"),
            (12, "Event QA"),
            (13, "Marketing QA"),
            (14, "Digital Marketing Specialist"),
            (15, "Sales Executive"),
            (16, "Human Resources Assistant"),
            (17, "Graphic Designer"),
            (18, "Content Writer"),
            (19, "Airport Event Coordinator"),
        ]
        conn.executemany("INSERT INTO jobs (id, title) VALUES (?, ?)", test_jobs)
        conn.commit()

        where_clause, params = build_cleanup_clauses("?")
        # SQLite LIKE is case-insensitive for ASCII characters, same as ILIKE in Postgres
        sqlite_where = where_clause.replace("ILIKE", "LIKE")
        delete_query = f"DELETE FROM jobs WHERE {sqlite_where}"

        conn.execute(delete_query, params)
        conn.commit()

        remaining_ids = [row[0] for row in conn.execute("SELECT id FROM jobs ORDER BY id").fetchall()]
        # IDs 1 to 13 should be retained, IDs 14 to 19 should be deleted
        self.assertEqual(remaining_ids, list(range(1, 14)))


if __name__ == "__main__":
    unittest.main()
