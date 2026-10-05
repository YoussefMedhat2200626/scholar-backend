require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function main() {
  try {
    const { rows } = await sql`SELECT tags_json FROM jobs WHERE is_taken = false OR is_taken IS NULL`;
    const tagCounts = {};
    rows.forEach(r => {
      let tags = [];
      try {
        tags = JSON.parse(r.tags_json || '[]');
      } catch (e) {}
      tags.forEach(t => {
        if (!t.toLowerCase().includes('senior') && !t.toLowerCase().includes('junior') && !t.toLowerCase().includes('mid') && !t.toLowerCase().includes('remote') && !t.toLowerCase().includes('hybrid') && !t.toLowerCase().includes('on-site') && !t.toLowerCase().includes('full-time') && !t.toLowerCase().includes('part-time')) {
          tagCounts[t] = (tagCounts[t] || 0) + 1;
        }
      });
    });
    const sorted = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
    console.log(sorted.slice(0, 20));
  } catch (error) {
    console.error(error);
  }
}
main();
