import { NextResponse } from 'next/server';
import { markJobAsTaken } from '@/src/lib/jobsDb';

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const result = await markJobAsTaken(id);

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: (error as Error).message },
      { status: 500 }
    );
  }
}
