const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function applyMigrationPG() {
  console.log('🚀 Applying migration using PostgreSQL direct connection...\n');

  // Connection string - try pooler first
  const connectionString = 'postgres://postgres.ctixprrqbnfivhepifsa:4DaV%pM&BZ.nxKQ@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';
  
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Connect to database
    console.log('📡 Connecting to database...');
    await client.connect();
    console.log('✅ Connected!\n');

    // Read migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20251012_fix_community_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📝 Executing migration SQL...\n');

    // Execute the entire migration
    await client.query(migrationSQL);

    console.log('✅ Migration executed successfully!\n');

    // Verify tables exist
    console.log('🔍 Verifying tables...\n');

    const tables = ['post_reactions', 'post_comments', 'community_posts'];
    
    for (const table of tables) {
      const result = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = '${table}'
        );
      `);
      
      if (result.rows[0].exists) {
        // Get row count
        const countResult = await client.query(`SELECT COUNT(*) FROM ${table};`);
        const count = countResult.rows[0].count;
        console.log(`  ✅ Table '${table}' exists (${count} rows)`);
      } else {
        console.log(`  ❌ Table '${table}' NOT FOUND`);
      }
    }

    console.log('\n🎉 Migration completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

applyMigrationPG();
