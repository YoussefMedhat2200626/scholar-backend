import { getJobs, getCompanyMonthlyStats, JobItem, CompanyMonthlyStat } from '@/src/lib/jobsDb';
import JobsClient from './JobsClient';

export const revalidate = 0; // Disable static caching so it always fetches fresh data

export default async function JobsPage() {
  let initialJobs: JobItem[] = [];
  let companyStats: CompanyMonthlyStat[] = [];
  let errorMsg: string | undefined = undefined;

  try {
    const [jobsRes, statsRes] = await Promise.allSettled([
      getJobs(),
      getCompanyMonthlyStats(),
    ]);

    if (jobsRes.status === 'fulfilled') {
      initialJobs = jobsRes.value;
    } else {
      console.error("Jobs Fetch Error:", jobsRes.reason);
      errorMsg = (jobsRes.reason as Error)?.message || "Failed to fetch jobs";
    }

    if (statsRes.status === 'fulfilled') {
      companyStats = statsRes.value;
    } else {
      console.error("Company Stats Fetch Error:", statsRes.reason);
    }
  } catch (error: unknown) {
    console.error("Jobs Page Error:", error);
    errorMsg = (error as Error).message || "Failed to fetch jobs data";
  }

  return <JobsClient initialJobs={initialJobs} companyStats={companyStats} serverError={errorMsg} />;
}

