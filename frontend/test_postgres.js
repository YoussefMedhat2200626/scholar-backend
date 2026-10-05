require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function main() {
  try {
    const result = await sql`UPDATE jobs SET is_taken = true WHERE company ILIKE '%TiEngineer%'`;
    console.log(`Updated ${result.rowCount} rows`);
  } catch (error) {
    console.error(error);
  }
}
main();
