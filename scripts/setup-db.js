require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('✓ Connected to database');

    const schemaPath = path.join(__dirname, '..', 'database-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Running database schema...');
    await client.query(schema);
    console.log('✓ Database schema created successfully!');

    // Test the table
    const result = await client.query('SELECT COUNT(*) FROM registrations');
    console.log(`✓ Table verified. Current registrations: ${result.rows[0].count}`);

  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('✓ Database connection closed');
  }
}

setupDatabase();

