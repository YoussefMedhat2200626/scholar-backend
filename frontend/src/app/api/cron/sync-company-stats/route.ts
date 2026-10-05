import { NextResponse } from 'next/server';
import { syncCompanyMonthlyStats, purgeExpiredCompanyStats } from '@/src/lib/jobsDb';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const syncResult = await syncCompanyMonthlyStats();
    const purgeResult = await purgeExpiredCompanyStats();

    return NextResponse.json({
      success: true,
      message: 'Company monthly stats synced and expired records purged successfully.',
      syncedMonths: syncResult.syncedMonths,
      deletedExpiredRecords: purgeResult.deletedCount,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error in sync-company-stats cron:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
