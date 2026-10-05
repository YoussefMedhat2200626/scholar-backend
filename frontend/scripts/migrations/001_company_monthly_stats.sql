-- Migration: 001_company_monthly_stats.sql
-- Description: Create table for tracking 12-month rolling job scraping counters for 18 tracked companies.

CREATE TABLE IF NOT EXISTS company_monthly_stats (
    company_id VARCHAR(64) NOT NULL,
    year_month VARCHAR(7) NOT NULL, -- Format: 'YYYY-MM'
    job_count INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (company_id, year_month)
);

CREATE INDEX IF NOT EXISTS idx_company_monthly_stats_ym 
    ON company_monthly_stats(year_month);
