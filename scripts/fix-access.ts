import { Client } from 'pg'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function fixAdminAccess() {
  const dbUrl = process.env.DATABASE_URL
  
  if (!dbUrl) {
    console.error('❌ DATABASE_URL not found in .env.local')
    process.exit(1)
  }

  console.log('🔧 Connecting to database...')
  
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  })

  try {
    await client.connect()
    console.log('✅ Connected to database')

    const sql = fs.readFileSync(
      path.resolve(__dirname, 'fix-access-policy.sql'),
      'utf-8'
    )

    console.log('📝 Applying RLS policy fix...')
    await client.query(sql)
    
    console.log('✅ RLS policies updated successfully!')
    console.log('\n🎉 Fix applied! Now you can:')
    console.log('   1. Refresh your browser')
    console.log('   2. Click "Continue as Admin"')
    console.log('   3. Access the admin panel')
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

fixAdminAccess()
