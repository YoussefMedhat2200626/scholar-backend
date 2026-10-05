const { Client } = require('pg');
const crypto = require('crypto');

async function main() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL
  });
  await client.connect();

  const jobs = [
    {
      title: "AMS Engineer",
      company: "Mixel-Egypt",
      location: "Cairo, Egypt",
      job_type: "Full-time",
      url: "https://www.linkedin.com/jobs/view/ams-engineer-at-mixel-egypt",
      tags_json: JSON.stringify(["Engineering", "Hardware", "AMS"]),
      first_seen_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      title: "Accountant – Accounts Payable (Junior)",
      company: "Mixel-Egypt",
      location: "Cairo, Egypt",
      job_type: "Full-time",
      url: "https://www.linkedin.com/jobs/view/accountant",
      tags_json: JSON.stringify(["Junior", "Accounting", "Finance"]),
      first_seen_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    },
    {
      title: "Senior HR Operations Specialist",
      company: "Mixel-Egypt",
      location: "Cairo, Egypt",
      job_type: "Full-time",
      url: "https://www.linkedin.com/jobs/view/senior-hr",
      tags_json: JSON.stringify(["Senior", "HR", "Operations"]),
      first_seen_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      title: "GLOBAL SENIOR TECHNICAL TALENT ACQUISITION LEAD",
      company: "Mixel-Egypt",
      location: "Cairo, Egypt",
      job_type: "Full-time",
      url: "https://www.linkedin.com/jobs/view/talent-acquisition",
      tags_json: JSON.stringify(["Senior", "HR", "Talent Acquisition"]),
      first_seen_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }
  ];

  let count = 0;
  for (const job of jobs) {
    const contentHash = crypto.createHash('md5').update(job.url).digest('hex');
    await client.query(`
      INSERT INTO jobs (source, source_job_id, title, company, location, url, canonical_url, job_type, tags_json, first_seen_at, last_seen_at, content_hash)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `, [
      'LinkedIn', 
      contentHash.substring(0, 10), 
      job.title, 
      job.company, 
      job.location, 
      job.url, 
      job.url, 
      job.job_type, 
      job.tags_json, 
      job.first_seen_at.toISOString(),
      job.first_seen_at.toISOString(),
      contentHash
    ]);
    count++;
  }
  console.log("Successfully inserted Mixel jobs:", count);
  await client.end();
}

main().catch(console.error);
