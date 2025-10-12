#!/usr/bin/env node

/**
 * Quick Verification Script
 * Checks if all APIs and database tables are working correctly
 */

const { createClient } = require('@supabase/supabase-js')
const https = require('https')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 Starting Verification...\n')
console.log('='.repeat(60))

// Color codes
const GREEN = '\x1b[32m'
const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const RESET = '\x1b[0m'

function success(message) {
  console.log(`${GREEN}✓${RESET} ${message}`)
}

function error(message) {
  console.log(`${RED}✗${RESET} ${message}`)
}

function warning(message) {
  console.log(`${YELLOW}⚠${RESET} ${message}`)
}

async function checkEnvironment() {
  console.log('\n📋 Environment Variables:')
  
  if (!supabaseUrl) {
    error('NEXT_PUBLIC_SUPABASE_URL is not set')
    return false
  }
  success(`NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl}`)
  
  if (!supabaseKey) {
    error('SUPABASE_SERVICE_ROLE_KEY is not set')
    return false
  }
  success('SUPABASE_SERVICE_ROLE_KEY: ***configured***')
  
  if (supabaseUrl.includes('localhost')) {
    warning('Using local Supabase instance')
  } else {
    success('Using production Supabase instance')
  }
  
  return true
}

async function checkDatabaseTables() {
  console.log('\n📊 Database Tables:')
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  const tables = [
    { name: 'guidance_content', required: true },
    { name: 'faq_items', required: true },
    { name: 'community_posts', required: true },
    { name: 'post_reactions', required: true },
    { name: 'post_comments', required: true }
  ]
  
  let allGood = true
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table.name)
        .select('id')
        .limit(1)
      
      if (error) {
        if (table.required) {
          error(`Table '${table.name}' - ${error.message}`)
          allGood = false
        } else {
          warning(`Table '${table.name}' - ${error.message}`)
        }
      } else {
        const count = data ? data.length : 0
        if (count > 0) {
          success(`Table '${table.name}' - OK (has data)`)
        } else {
          warning(`Table '${table.name}' - OK (no data yet)`)
        }
      }
    } catch (err) {
      if (table.required) {
        error(`Table '${table.name}' - ${err.message}`)
        allGood = false
      } else {
        warning(`Table '${table.name}' - ${err.message}`)
      }
    }
  }
  
  return allGood
}

async function checkDataContent() {
  console.log('\n📦 Data Content:')
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // Check guidance content
  try {
    const { data: guidanceData } = await supabase
      .from('guidance_content')
      .select('id')
      .eq('is_published', true)
    
    if (guidanceData && guidanceData.length > 0) {
      success(`Guidance Content: ${guidanceData.length} published items`)
    } else {
      warning('Guidance Content: No published items (run seed script)')
    }
  } catch (err) {
    error(`Guidance Content: ${err.message}`)
  }
  
  // Check FAQ items
  try {
    const { data: faqData } = await supabase
      .from('faq_items')
      .select('id')
      .eq('is_published', true)
    
    if (faqData && faqData.length > 0) {
      success(`FAQ Items: ${faqData.length} published items`)
    } else {
      warning('FAQ Items: No published items (run seed script)')
    }
  } catch (err) {
    error(`FAQ Items: ${err.message}`)
  }
  
  // Check community posts
  try {
    const { data: postsData } = await supabase
      .from('community_posts')
      .select('id')
    
    if (postsData && postsData.length > 0) {
      success(`Community Posts: ${postsData.length} posts`)
    } else {
      warning('Community Posts: No posts yet')
    }
  } catch (err) {
    error(`Community Posts: ${err.message}`)
  }
}

async function checkAPIEndpoints() {
  console.log('\n🌐 API Endpoints:')
  
  const endpoints = [
    { path: '/api/guidance/content', name: 'Guidance Content API' },
    { path: '/api/guidance/faq', name: 'FAQ API' },
    { path: '/api/community/posts', name: 'Community Posts API' }
  ]
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:3000${endpoint.path}`)
      if (response.ok) {
        const data = await response.json()
        const count = Array.isArray(data) ? data.length : (data.data ? data.data.length : 0)
        success(`${endpoint.name}: ${response.status} (${count} items)`)
      } else {
        warning(`${endpoint.name}: ${response.status} ${response.statusText}`)
      }
    } catch (err) {
      warning(`${endpoint.name}: Cannot connect (server not running?)`)
    }
  }
}

async function main() {
  const envOk = await checkEnvironment()
  
  if (!envOk) {
    console.log('\n❌ Environment check failed. Please fix environment variables.\n')
    process.exit(1)
  }
  
  await checkDatabaseTables()
  await checkDataContent()
  
  console.log('\n' + '='.repeat(60))
  console.log('\n💡 Next Steps:')
  console.log('   1. Start dev server: pnpm dev')
  console.log('   2. Visit http://localhost:3000/guidance')
  console.log('   3. Visit http://localhost:3000/community')
  console.log('\n   If data is missing:')
  console.log('   - Run: node scripts/seed-and-test.js')
  console.log('\n   If tables are missing:')
  console.log('   - Apply migration: supabase/migrations/20251012_fix_community_schema.sql')
  console.log('\n')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\n❌ Verification failed:', err.message)
    process.exit(1)
  })
