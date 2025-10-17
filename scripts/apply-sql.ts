import fs from 'fs'
import { Client } from 'pg'
import dotenv from 'dotenv'

async function main() {
  const file = process.argv[2]
  if (!file) {
    console.error('Usage: tsx scripts/apply-sql.ts <path-to-sql>')
    process.exit(1)
  }
  if (!fs.existsSync(file)) {
    console.error(`SQL file not found: ${file}`)
    process.exit(1)
  }

  // Load .env.local if present
  if (fs.existsSync('.env.local')) {
    dotenv.config({ path: '.env.local' })
  }

  const dbUrl = process.env.SUPABASE_DB_URL
  const dbPassword = process.env.SUPABASE_DB_PASSWORD

  if (!dbUrl) {
    console.error('Missing SUPABASE_DB_URL in environment (.env.local)')
    process.exit(1)
  }

  // The SUPABASE_DB_URL already contains the password (percent-encoded). Ensure PGPASSWORD available too for drivers that need it.
  if (dbPassword) {
    process.env.PGPASSWORD = dbPassword
  }

  const sql = fs.readFileSync(file, 'utf8')
  // Ensure SSL is required (Supabase requires SSL)
  // Append sslmode=require if missing
  let conn = dbUrl
  if (!/sslmode=/.test(conn)) {
    conn += (conn.includes('?') ? '&' : '?') + 'sslmode=require'
  }
  
  // For Supabase, we need to accept their certificate
  const client = new Client({ 
    connectionString: conn, 
    ssl: { rejectUnauthorized: false }
  })

  console.log(`\n📦 Connecting to Supabase Postgres...`)
  await client.connect()

  try {
    console.log(`⚡ Applying migration: ${file}`)
    await client.query('BEGIN')
    await client.query(sql)
    await client.query('COMMIT')
    console.log('✅ Migration applied successfully')
  } catch (err: any) {
    await client.query('ROLLBACK')
    console.error('❌ Migration failed:')
    console.error(err?.message || err)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
