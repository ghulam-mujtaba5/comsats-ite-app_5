import pg from 'pg'
const { Client } = pg

const client = new Client({
  connectionString: 'postgres://postgres:4DaV%25pM%26BZ.nxKQ@db.ctixprrqbnfivhepifsa.supabase.co:5432/postgres?sslmode=require',
})

async function checkTables() {
  try {
    await client.connect()
    console.log('✅ Connected to database\n')

    // Check if achievements table exists
    const achievementsCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'achievements'
      );
    `)
    console.log('Achievements table exists:', achievementsCheck.rows[0].exists)

    // Check if user_stats exists
    const statsCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_stats'
      );
    `)
    console.log('User stats table exists:', statsCheck.rows[0].exists)

    // Check if email tables exist
    const emailPrefsCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_email_preferences'
      );
    `)
    console.log('Email preferences table exists:', emailPrefsCheck.rows[0].exists)

    const emailLogsCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'email_logs'
      );
    `)
    console.log('Email logs table exists:', emailLogsCheck.rows[0].exists)

    // If achievements table exists, count rows
    if (achievementsCheck.rows[0].exists) {
      const count = await client.query('SELECT COUNT(*) FROM achievements;')
      console.log(`\n✅ Achievements count: ${count.rows[0].count}`)
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.end()
  }
}

checkTables()
