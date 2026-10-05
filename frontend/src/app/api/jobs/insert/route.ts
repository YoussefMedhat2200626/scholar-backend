import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const { jobs } = await request.json();
    if (!jobs || !Array.isArray(jobs)) {
      return NextResponse.json({ error: 'Array of jobs is required' }, { status: 400 });
    }

    let count = 0;
    for (const job of jobs) {
      await sql`
        INSERT INTO jobs (title, company, location, job_type, url, tags_json, first_seen_at)
        VALUES (${job.title}, ${job.company}, ${job.location}, ${job.job_type}, ${job.url}, ${job.tags_json}, ${job.first_seen_at})
      `;
      count++;
    }

    return NextResponse.json({ success: true, inserted: count });
  } catch (error: unknown) {
    console.error('Error inserting jobs:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: (error as Error).message },
      { status: 500 }
    );
  }
}
