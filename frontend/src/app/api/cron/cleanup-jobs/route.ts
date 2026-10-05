import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // 1. Fetch active jobs (we limit to 50 per run to avoid Vercel Function timeout)
    const { rows: jobs } = await sql`
      SELECT id, url, source FROM jobs 
      WHERE (is_taken = false OR is_taken IS NULL)
        AND (source = 'LinkedIn' OR source = 'Wuzzuf')
      ORDER BY last_checked_at ASC NULLS FIRST
      LIMIT 50
    `;

    if (jobs.length === 0) {
      return NextResponse.json({ message: 'No active jobs to check.' });
    }

    let closedCount = 0;
    const now = new Date().toISOString();

    // 2. Check each job
    for (const job of jobs) {
      if (!job.url) continue;

      try {
        const response = await fetch(job.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
          },
          // Short timeout so we don't hang the serverless function
          signal: AbortSignal.timeout(5000),
          // Don't follow redirects for Wuzzuf because closed jobs often 302 redirect
          redirect: job.source === 'Wuzzuf' ? 'manual' : 'follow'
        });

        let isClosed = false;

        if (job.source === 'Wuzzuf') {
          // Wuzzuf usually 302 redirects invalid/closed jobs to another page
          if (response.status === 302 || response.status === 404) {
            isClosed = true;
          } else if (response.ok) {
            const html = await response.text();
            if (html.includes('This job is no longer available') || html.includes('Applications are closed')) {
              isClosed = true;
            }
          }
        } else if (job.source === 'LinkedIn') {
          if (response.ok) {
            const html = await response.text();
            if (
              html.includes('No longer accepting applications') || 
              html.includes('Not currently accepting applications')
            ) {
              isClosed = true;
            }
          }
        }

        if (isClosed) {
          // Mark as taken
          await sql`UPDATE jobs SET is_taken = true, last_checked_at = ${now} WHERE id = ${job.id}`;
          closedCount++;
          continue;
        }

      } catch (err) {
        console.error(`Failed to fetch job ${job.id}:`, err);
      }

      // If it wasn't closed or fetch failed, just update last_checked_at so it goes to back of queue
      await sql`UPDATE jobs SET last_checked_at = ${now} WHERE id = ${job.id}`;
    }

    return NextResponse.json({ 
      success: true, 
      checked: jobs.length, 
      closed: closedCount,
      message: `Checked ${jobs.length} jobs, found ${closedCount} closed.`
    });

  } catch (error: any) {
    console.error('Error in cleanup cron:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
