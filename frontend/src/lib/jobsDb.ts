import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

export interface JobItem {
  id: number | string;
  source?: string;
  source_job_id?: string;
  title: string;
  company?: string;
  location?: string;
  url: string;
  canonical_url?: string;
  salary?: string;
  job_type?: string;
  tags_json?: string;
  is_remote?: number | boolean;
  original_source?: string;
  content_hash?: string;
  send_status?: string;
  first_seen_at?: string;
  last_seen_at?: string;
  last_checked_at?: string;
  is_taken?: boolean;
  number_visited?: number;
}

const getJsonDbPath = () => path.join(process.cwd(), 'jobs_export.json');

const globalForPg = global as unknown as { pgPool?: Pool };

function getPool(): Pool {
  if (!globalForPg.pgPool) {
    let connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!connectionString) throw new Error("Missing DATABASE_URL. Available env vars: " + Object.keys(process.env).filter(k => k.includes("URL") || k.includes("POSTGRES") || k.includes("DATA")).join(", "));
    if (connectionString && connectionString.includes('sslmode=require')) {
      connectionString = connectionString.replace('sslmode=require', 'sslmode=verify-full');
    }
    globalForPg.pgPool = new Pool({
      connectionString,
      ssl: connectionString?.includes('sslmode=') || connectionString?.includes('prisma')
        ? { rejectUnauthorized: false }
        : undefined,
    });
  }
  return globalForPg.pgPool;
}

export async function getJobs(): Promise<JobItem[]> {
  const isLocalJsonMode = process.env.USE_LOCAL_JSON_DB === 'true';
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  if (isLocalJsonMode) {
    try {
      const dbPath = getJsonDbPath();
      if (!fs.existsSync(dbPath)) {
        return [];
      }
      const rawData = await fs.promises.readFile(dbPath, 'utf-8');
      const jobs: JobItem[] = JSON.parse(rawData);

      const availableJobs = jobs.filter((job) => {
        if (job.is_taken) return false;
        const seenDate = job.last_seen_at || job.first_seen_at;
        if (seenDate && seenDate < thirtyDaysAgo) return false;
        return true;
      });

      availableJobs.sort((a, b) => {
        const timeA = a.first_seen_at ? new Date(a.first_seen_at).getTime() : 0;
        const timeB = b.first_seen_at ? new Date(b.first_seen_at).getTime() : 0;
        return timeB - timeA;
      });

      return availableJobs;
    } catch (err) {
      console.error('Error reading local JSON database:', err);
      throw err;
    }
  }

  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT 
       j.id,
       j.source,
       j.title,
       c.name AS company,
       CONCAT_WS(', ', NULLIF(b.city, ''), NULLIF(b.country, '')) AS location,
       j."applyLink" AS url,
       j."isTaken" AS is_taken,
       j."postedAt"::text AS first_seen_at,
       j."updatedAt"::text AS last_seen_at
     FROM jobs j
     LEFT JOIN companies c ON j."companyId" = c.id
     LEFT JOIN "companyBranches" b ON j."branchId" = b.id
     WHERE (j."isTaken" = false OR j."isTaken" IS NULL)
       AND j."updatedAt" >= $1::timestamptz
     ORDER BY j."postedAt" DESC`,
    [thirtyDaysAgo]
  );
  return rows as JobItem[];
}

export async function markJobAsTaken(id: number | string): Promise<{ success: boolean; message: string }> {
  const isLocalJsonMode = process.env.USE_LOCAL_JSON_DB === 'true';
  const now = new Date().toISOString();

  if (isLocalJsonMode) {
    const dbPath = getJsonDbPath();
    if (!fs.existsSync(dbPath)) {
      throw new Error('Local JSON database file not found');
    }

    const rawData = await fs.promises.readFile(dbPath, 'utf-8');
    const jobs: JobItem[] = JSON.parse(rawData);

    const targetJob = jobs.find((job) => String(job.id) === String(id));
    if (targetJob) {
      targetJob.is_taken = true;
      targetJob.last_checked_at = now;
      await fs.promises.writeFile(dbPath, JSON.stringify(jobs, null, 4), 'utf-8');
    }

    return { success: true, message: 'Job marked as taken locally' };
  }

  const pool = getPool();
  await pool.query(
    `UPDATE jobs SET "isTaken" = true, "lastCheckedAt" = $1::timestamptz WHERE id = $2`,
    [now, id]
  );
  return { success: true, message: 'Job marked as taken in database' };
}

export async function incrementJobVisits(id: number | string): Promise<{ success: boolean; number_visited: number; notFound?: boolean }> {
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    throw new Error('Invalid Job ID: must be an integer');
  }

  const isLocalJsonMode = process.env.USE_LOCAL_JSON_DB === 'true';

  if (isLocalJsonMode) {
    const dbPath = getJsonDbPath();
    if (!fs.existsSync(dbPath)) {
      throw new Error('Local JSON database file not found');
    }

    const rawData = await fs.promises.readFile(dbPath, 'utf-8');
    const jobs: JobItem[] = JSON.parse(rawData);

    const targetJob = jobs.find((job) => String(job.id) === String(numericId));
    if (!targetJob) {
      return { success: false, number_visited: 0, notFound: true };
    }

    targetJob.number_visited = (targetJob.number_visited || 0) + 1;
    await fs.promises.writeFile(dbPath, JSON.stringify(jobs, null, 4), 'utf-8');

    return { success: true, number_visited: targetJob.number_visited };
  }

  const pool = getPool();
  const { rows } = await pool.query(
    `UPDATE jobs
     SET number_visited = COALESCE(number_visited, 0) + 1
     WHERE id = $1::integer
     RETURNING number_visited`,
    [numericId]
  );

  if (rows.length === 0) {
    return { success: false, number_visited: 0, notFound: true };
  }

  return { success: true, number_visited: rows[0].number_visited };
}

export interface CompanyMonthlyStat {
  company_id: string;
  year_month: string;
  job_count: number;
}

const getStatsJsonDbPath = () => path.join(process.cwd(), 'company_monthly_stats.json');

export async function isSyncDue(): Promise<boolean> {
  const isLocalJsonMode = process.env.USE_LOCAL_JSON_DB === 'true';
  const now = new Date();
  const currentDay = now.getDate();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), currentDay + 1);
  const isLastDayOfMonth = tomorrow.getDate() === 1;
  const isFirstDayOfMonth = currentDay === 1;
  const isFiveDayMark = currentDay % 5 === 0;

  if (isLastDayOfMonth || isFirstDayOfMonth || isFiveDayMark) {
    return true;
  }

  const currentYm = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;

  if (isLocalJsonMode) {
    const statsPath = getStatsJsonDbPath();
    if (!fs.existsSync(statsPath)) return true;
    try {
      const statsRaw = await fs.promises.readFile(statsPath, 'utf-8');
      const stats: (CompanyMonthlyStat & { updated_at?: string })[] = JSON.parse(statsRaw);
      const currentStats = stats.filter(s => s.year_month === currentYm);
      if (currentStats.length === 0) return true;
      const latestUpdate = Math.max(...currentStats.map(s => s.updated_at ? new Date(s.updated_at).getTime() : 0));
      return (Date.now() - latestUpdate) > 5 * 24 * 60 * 60 * 1000;
    } catch {
      return true;
    }
  }

  const pool = getPool();
  try {
    const { rows } = await pool.query(
      `SELECT MAX(updated_at) AS last_updated 
       FROM company_monthly_stats 
       WHERE year_month = $1`,
      [currentYm]
    );
    if (!rows[0]?.last_updated) return true;
    const lastUpdated = new Date(rows[0].last_updated).getTime();
    return (Date.now() - lastUpdated) > 5 * 24 * 60 * 60 * 1000;
  } catch (err: any) {
    // If table does not exist yet, sync is due
    return true;
  }
}

export async function syncCompanyMonthlyStats(targetMonths?: string[]): Promise<{ success: boolean; syncedMonths: string[] }> {
  const isLocalJsonMode = process.env.USE_LOCAL_JSON_DB === 'true';
  const now = new Date();
  
  if (!targetMonths || targetMonths.length === 0) {
    const currentYm = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
    const prevDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
    const prevYm = `${prevDate.getUTCFullYear()}-${String(prevDate.getUTCMonth() + 1).padStart(2, '0')}`;
    targetMonths = [prevYm, currentYm];
  }

  if (isLocalJsonMode) {
    const { matchCompanyId } = await import('@/src/data/companyMatcher');
    const dbPath = getJsonDbPath();
    const statsPath = getStatsJsonDbPath();

    if (!fs.existsSync(dbPath)) {
      return { success: true, syncedMonths: targetMonths };
    }

    const rawJobs = await fs.promises.readFile(dbPath, 'utf-8');
    const jobs: JobItem[] = JSON.parse(rawJobs);

    let existingStats: (CompanyMonthlyStat & { updated_at?: string })[] = [];
    if (fs.existsSync(statsPath)) {
      try {
        existingStats = JSON.parse(await fs.promises.readFile(statsPath, 'utf-8'));
      } catch {
        existingStats = [];
      }
    }

    // Count distinct jobs per company_id & target year_month
    const counts: Record<string, number> = {};
    for (const job of jobs) {
      if (!job.first_seen_at) continue;
      const d = new Date(job.first_seen_at);
      const ym = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
      if (!targetMonths.includes(ym)) continue;

      const compId = matchCompanyId(job.company);
      if (!compId) continue;

      const key = `${compId}__${ym}`;
      counts[key] = (counts[key] || 0) + 1;
    }

    const nowIso = now.toISOString();
    for (const [key, count] of Object.entries(counts)) {
      const [company_id, year_month] = key.split('__');
      const idx = existingStats.findIndex(s => s.company_id === company_id && s.year_month === year_month);
      if (idx >= 0) {
        existingStats[idx].job_count = Math.max(existingStats[idx].job_count, count);
        existingStats[idx].updated_at = nowIso;
      } else {
        existingStats.push({ company_id, year_month, job_count: count, updated_at: nowIso });
      }
    }

    await fs.promises.writeFile(statsPath, JSON.stringify(existingStats, null, 4), 'utf-8');
    return { success: true, syncedMonths: targetMonths };
  }

  const pool = getPool();

  // Ensure table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS company_monthly_stats (
        company_id VARCHAR(64) NOT NULL,
        year_month VARCHAR(7) NOT NULL,
        job_count INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (company_id, year_month)
    );
    CREATE INDEX IF NOT EXISTS idx_company_monthly_stats_ym ON company_monthly_stats(year_month);
  `);

  await pool.query(
    `INSERT INTO company_monthly_stats (company_id, year_month, job_count, updated_at)
     SELECT 
       matched.company_id,
       to_char((j."postedAt" AT TIME ZONE 'UTC'), 'YYYY-MM') AS year_month,
       COUNT(DISTINCT j.id)::int AS job_count,
       NOW() AS updated_at
     FROM jobs j
     LEFT JOIN companies c ON j."companyId" = c.id
     CROSS JOIN LATERAL (
       SELECT CASE
         WHEN c.name ILIKE '%siemens energy%' THEN 'siemens-energy'
         WHEN c.name ILIKE '%siemens gamesa%' THEN 'siemens-gamesa'
         WHEN c.name ILIKE '%siemens digital industries%' 
           OR c.name ILIKE '%siemens dis%' 
           OR c.name ILIKE '%siemens eda%' 
           OR c.name ILIKE '%mentor graphics%' THEN 'siemens-dis'
         WHEN c.name ILIKE '%siemens%' THEN 'siemens'
         WHEN c.name ILIKE '%stmicroelectronics%' 
           OR c.name ILIKE '%stmicro%' 
           OR c.name ILIKE '%st micro%' THEN 'stmicroelectronics'
         WHEN c.name ILIKE '%mediatek%' THEN 'mediatek'
         WHEN c.name ILIKE '%analog devices%' THEN 'analog-devices'
         WHEN c.name ILIKE '%intel%' 
           AND c.name NOT ILIKE '%intelligent%' 
           AND c.name NOT ILIKE '%infineon%' THEN 'intel'
         WHEN c.name ILIKE '%texas instruments%' THEN 'texas-instruments'
         WHEN c.name ILIKE '%infineon%' THEN 'infineon'
         WHEN c.name ILIKE '%capgemini%' THEN 'capgemini'
         WHEN c.name ILIKE '%cisco%' 
           AND c.name NOT ILIKE '%san francisco%' THEN 'cisco'
         WHEN c.name ILIKE '%infinilink%' THEN 'infinilink'
         WHEN c.name ILIKE '%valeo%' THEN 'valeo'
         WHEN c.name ILIKE '%dell %' 
           OR c.name ILIKE '%dell technologies%' 
           OR c.name ILIKE '%dell inc%' THEN 'dell'
         WHEN c.name ILIKE '%vodafone%' 
           OR c.name ILIKE '%vois%' THEN 'vodafone'
         WHEN c.name ILIKE '%iss international%' THEN 'iss-international'
         WHEN c.name ILIKE '%mixel%' THEN 'mixel'
         ELSE NULL
       END AS company_id
     ) matched
     WHERE matched.company_id IS NOT NULL
       AND j."postedAt" IS NOT NULL
       AND to_char((j."postedAt" AT TIME ZONE 'UTC'), 'YYYY-MM') = ANY($1::text[])
     GROUP BY matched.company_id, to_char((j."postedAt" AT TIME ZONE 'UTC'), 'YYYY-MM')
     ON CONFLICT (company_id, year_month)
     DO UPDATE SET 
       job_count = GREATEST(company_monthly_stats.job_count, EXCLUDED.job_count),
       updated_at = NOW();`,
    [targetMonths]
  );

  return { success: true, syncedMonths: targetMonths };
}

export async function purgeExpiredCompanyStats(): Promise<{ success: boolean; deletedCount: number }> {
  const isLocalJsonMode = process.env.USE_LOCAL_JSON_DB === 'true';
  const cutoffDate = new Date();
  cutoffDate.setUTCMonth(cutoffDate.getUTCMonth() - 12);
  const cutoffYm = `${cutoffDate.getUTCFullYear()}-${String(cutoffDate.getUTCMonth() + 1).padStart(2, '0')}`;

  if (isLocalJsonMode) {
    const statsPath = getStatsJsonDbPath();
    if (!fs.existsSync(statsPath)) return { success: true, deletedCount: 0 };
    try {
      const statsRaw = await fs.promises.readFile(statsPath, 'utf-8');
      const stats: CompanyMonthlyStat[] = JSON.parse(statsRaw);
      const filtered = stats.filter(s => s.year_month >= cutoffYm);
      const deletedCount = stats.length - filtered.length;
      if (deletedCount > 0) {
        await fs.promises.writeFile(statsPath, JSON.stringify(filtered, null, 4), 'utf-8');
      }
      return { success: true, deletedCount };
    } catch {
      return { success: false, deletedCount: 0 };
    }
  }

  const pool = getPool();
  try {
    const { rowCount } = await pool.query(
      `DELETE FROM company_monthly_stats WHERE year_month < $1`,
      [cutoffYm]
    );
    return { success: true, deletedCount: rowCount || 0 };
  } catch (err) {
    return { success: false, deletedCount: 0 };
  }
}

export async function getCompanyMonthlyStats(): Promise<CompanyMonthlyStat[]> {
  const isLocalJsonMode = process.env.USE_LOCAL_JSON_DB === 'true';
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setUTCMonth(twelveMonthsAgo.getUTCMonth() - 11);
  const cutoffYm = `${twelveMonthsAgo.getUTCFullYear()}-${String(twelveMonthsAgo.getUTCMonth() + 1).padStart(2, '0')}`;

  // Removed inline sync check because it blocks page load and causes Vercel 500 timeout.
  // We rely on the /api/cron/sync-company-stats cron job instead.

  if (isLocalJsonMode) {
    const statsPath = getStatsJsonDbPath();
    if (!fs.existsSync(statsPath)) return [];
    try {
      const statsRaw = await fs.promises.readFile(statsPath, 'utf-8');
      const stats: CompanyMonthlyStat[] = JSON.parse(statsRaw);
      return stats.filter(s => s.year_month >= cutoffYm).sort((a, b) => a.year_month.localeCompare(b.year_month));
    } catch {
      return [];
    }
  }

  const pool = getPool();
  try {
    const { rows } = await pool.query(
      `SELECT company_id, year_month, job_count
       FROM company_monthly_stats
       WHERE year_month >= $1
       ORDER BY year_month ASC`,
      [cutoffYm]
    );
    return rows as CompanyMonthlyStat[];
  } catch (err: any) {
    console.warn('Failed to query company_monthly_stats, returning empty:', err.message);
    return [];
  }
}
