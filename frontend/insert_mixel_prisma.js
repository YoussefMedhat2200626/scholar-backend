const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
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

  const result = await prisma.job.createMany({
    data: jobs
  });
  console.log("Successfully inserted Mixel jobs:", result.count);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
