require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function addMixelJobs() {
  const jobs = [
    {
      title: "AMS Engineer",
      company: "Mixel-Egypt",
      location: "Cairo, Egypt",
      job_type: "Full-time",
      url: "https://www.linkedin.com/jobs/view/ams-engineer-at-mixel-egypt",
      tags_json: JSON.stringify(["Engineering", "Hardware", "AMS"]),
      first_seen_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week ago
    },
    {
      title: "Accountant – Accounts Payable (Junior)",
      company: "Mixel-Egypt",
      location: "Cairo, Egypt",
      job_type: "Full-time",
      url: "https://www.linkedin.com/jobs/view/accountant",
      tags_json: JSON.stringify(["Junior", "Accounting", "Finance"]),
      first_seen_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() // 2 weeks ago
    },
    {
      title: "Senior HR Operations Specialist",
      company: "Mixel-Egypt",
      location: "Cairo, Egypt",
      job_type: "Full-time",
      url: "https://www.linkedin.com/jobs/view/senior-hr",
      tags_json: JSON.stringify(["Senior", "HR", "Operations"]),
      first_seen_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 1 month ago
    },
    {
      title: "GLOBAL SENIOR TECHNICAL TALENT ACQUISITION LEAD",
      company: "Mixel-Egypt",
      location: "Cairo, Egypt",
      job_type: "Full-time",
      url: "https://www.linkedin.com/jobs/view/talent-acquisition",
      tags_json: JSON.stringify(["Senior", "HR", "Talent Acquisition"]),
      first_seen_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 1 month ago
    }
  ];

  const { data, error } = await supabase
    .from('jobs') // Assuming the table is named 'jobs'
    .insert(jobs)
    .select();

  if (error) {
    console.error("Error inserting jobs:", error);
  } else {
    console.log("Successfully inserted Mixel jobs:", data.length);
  }
}

addMixelJobs();
