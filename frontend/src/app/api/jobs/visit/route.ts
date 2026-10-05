import { NextResponse } from 'next/server';
import { incrementJobVisits } from '@/lib/jobsDb';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const id = body?.id;

    if (id === undefined || id === null || id === '') {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const numericId = Number(id);
    if (!Number.isInteger(numericId) || !Number.isSafeInteger(numericId)) {
      return NextResponse.json({ error: 'Invalid Job ID: must be an integer' }, { status: 400 });
    }

    const result = await incrementJobVisits(numericId);

    if (result.notFound) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Error recording visit for job:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: (error as Error).message },
      { status: 500 }
    );
  }
}
