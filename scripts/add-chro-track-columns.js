const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function addCHROTrackColumns() {
  try {
    console.log('Adding CHRO Track columns to registrations table...');
    
    await sql`
      ALTER TABLE registrations
      ADD COLUMN IF NOT EXISTS chro_track_company_size_detail TEXT,
      ADD COLUMN IF NOT EXISTS chro_track_company_presence TEXT,
      ADD COLUMN IF NOT EXISTS chro_track_company_type TEXT,
      ADD COLUMN IF NOT EXISTS chro_track_biggest_challenge TEXT,
      ADD COLUMN IF NOT EXISTS chro_track_win_to_share TEXT,
      ADD COLUMN IF NOT EXISTS chro_track_session_goals TEXT[]
    `;
    
    console.log('✅ Successfully added CHRO Track columns!');
    
    const columns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'registrations'
      AND column_name LIKE 'chro_track%'
      ORDER BY column_name
    `;
    
    console.log('\nNew CHRO Track columns:');
    console.log(columns);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addCHROTrackColumns();

