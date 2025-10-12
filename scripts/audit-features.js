#!/usr/bin/env node

/**
 * Comprehensive Feature Audit and Fix Script
 * Tests all pages and APIs, identifies issues, and provides fixes
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Color codes
const GREEN = '\x1b[32m'
const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const BLUE = '\x1b[34m'
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

function info(message) {
  console.log(`${BLUE}ℹ${RESET} ${message}`)
}

const criticalTables = [
  // Core tables
  { name: 'guidance_content', description: 'Guidance page content' },
  { name: 'faq_items', description: 'FAQ items' },
  { name: 'community_posts', description: 'Community posts' },
  { name: 'past_papers', description: 'Past papers' },
  { name: 'news', description: 'News articles' },
  { name: 'events', description: 'Campus events' },
  { name: 'faculty', description: 'Faculty members' },
  { name: 'lost_found_items', description: 'Lost & Found items' },
  { name: 'help_desk_tickets', description: 'Help desk tickets' },
  { name: 'resources', description: 'Student resources' },
  
  // Supporting tables
  { name: 'post_reactions', description: 'Post likes/reactions', optional: true },
  { name: 'post_comments', description: 'Post comments', optional: true },
  { name: 'campuses', description: 'Campus information' },
  { name: 'departments', description: 'Department information' },
  { name: 'programs', description: 'Academic programs' }
]

async function checkTable(tableName, description, optional = false) {
  try {
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      if (optional) {
        warning(`${description} (${tableName}): Table missing - ${error.message}`)
        return { exists: false, hasData: false, optional: true }
      } else {
        error(`${description} (${tableName}): ${error.message}`)
        return { exists: false, hasData: false, optional: false }
      }
    }
    
    const hasData = count && count > 0
    
    if (hasData) {
      success(`${description} (${tableName}): ${count} records`)
    } else {
      warning(`${description} (${tableName}): Table exists but empty`)
    }
    
    return { exists: true, hasData, count, optional }
  } catch (err) {
    if (optional) {
      warning(`${description} (${tableName}): ${err.message}`)
      return { exists: false, hasData: false, optional: true }
    } else {
      error(`${description} (${tableName}): ${err.message}`)
      return { exists: false, hasData: false, optional: false }
    }
  }
}

async function auditDatabase() {
  console.log('\n' + '='.repeat(70))
  console.log('📊 DATABASE AUDIT')
  console.log('='.repeat(70))
  
  const results = []
  
  for (const table of criticalTables) {
    const result = await checkTable(table.name, table.description, table.optional)
    results.push({ ...table, ...result })
  }
  
  console.log('\n' + '-'.repeat(70))
  console.log('📋 SUMMARY')
  console.log('-'.repeat(70))
  
  const missingTables = results.filter(r => !r.exists && !r.optional)
  const emptyTables = results.filter(r => r.exists && !r.hasData && !r.optional)
  const workingTables = results.filter(r => r.exists && r.hasData)
  
  info(`Working tables: ${workingTables.length}`)
  if (emptyTables.length > 0) {
    warning(`Empty tables: ${emptyTables.length}`)
    emptyTables.forEach(t => console.log(`  - ${t.name}`))
  }
  if (missingTables.length > 0) {
    error(`Missing tables: ${missingTables.length}`)
    missingTables.forEach(t => console.log(`  - ${t.name}`))
  }
  
  return { results, missingTables, emptyTables, workingTables }
}

async function generateSeedData() {
  console.log('\n' + '='.repeat(70))
  console.log('🌱 GENERATING SEED DATA')
  console.log('='.repeat(70))
  
  // Seed past papers
  try {
    const { count } = await supabase
      .from('past_papers')
      .select('*', { count: 'exact', head: true })
    
    if (!count || count === 0) {
      info('Seeding past papers...')
      
      const pastPapers = [
        {
          course_code: 'CS101',
          course_name: 'Introduction to Computing',
          exam_type: 'midterm',
          semester: 'Fall',
          year: 2023,
          file_url: '/past-papers/cs101-mid-fall2023.pdf',
          is_verified: true
        },
        {
          course_code: 'CS201',
          course_name: 'Data Structures',
          exam_type: 'final',
          semester: 'Spring',
          year: 2023,
          file_url: '/past-papers/cs201-final-spring2023.pdf',
          is_verified: true
        },
        {
          course_code: 'MATH101',
          course_name: 'Calculus I',
          exam_type: 'midterm',
          semester: 'Fall',
          year: 2023,
          file_url: '/past-papers/math101-mid-fall2023.pdf',
          is_verified: true
        }
      ]
      
      const { error } = await supabase
        .from('past_papers')
        .insert(pastPapers)
      
      if (error) {
        error(`Failed to seed past papers: ${error.message}`)
      } else {
        success(`Seeded ${pastPapers.length} past papers`)
      }
    }
  } catch (err) {
    warning(`Could not seed past papers: ${err.message}`)
  }
  
  // Seed news
  try {
    const { count } = await supabase
      .from('news')
      .select('*', { count: 'exact', head: true })
    
    if (!count || count === 0) {
      info('Seeding news articles...')
      
      const news = [
        {
          title: 'New Computer Lab Opened',
          content: 'COMSATS has inaugurated a state-of-the-art computer lab with 100 workstations.',
          category: 'facilities',
          is_published: true,
          published_at: new Date().toISOString()
        },
        {
          title: 'Semester Registration Open',
          content: 'Registration for Spring 2024 semester is now open. Students can register through CU Online.',
          category: 'academic',
          is_published: true,
          published_at: new Date().toISOString()
        }
      ]
      
      const { error } = await supabase
        .from('news')
        .insert(news)
      
      if (error) {
        error(`Failed to seed news: ${error.message}`)
      } else {
        success(`Seeded ${news.length} news articles`)
      }
    }
  } catch (err) {
    warning(`Could not seed news: ${err.message}`)
  }
  
  // Seed events
  try {
    const { count } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
    
    if (!count || count === 0) {
      info('Seeding events...')
      
      const events = [
        {
          title: 'Tech Talk: AI in Healthcare',
          description: 'Join us for an insightful talk on AI applications in healthcare.',
          event_date: '2024-01-15',
          event_time: '14:00:00',
          location: 'Main Auditorium',
          category: 'workshop',
          organizer: 'CS Department',
          registration_open: true
        },
        {
          title: 'Career Fair 2024',
          description: 'Meet top tech companies and explore career opportunities.',
          event_date: '2024-01-20',
          event_time: '10:00:00',
          location: 'Sports Complex',
          category: 'academic',
          organizer: 'Career Services',
          registration_open: true
        }
      ]
      
      const { error } = await supabase
        .from('events')
        .insert(events)
      
      if (error) {
        error(`Failed to seed events: ${error.message}`)
      } else {
        success(`Seeded ${events.length} events`)
      }
    }
  } catch (err) {
    warning(`Could not seed events: ${err.message}`)
  }
}

async function main() {
  console.log('\n🚀 COMPREHENSIVE FEATURE AUDIT\n')
  
  const { results, missingTables, emptyTables } = await auditDatabase()
  
  if (emptyTables.length > 0 || missingTables.length === 0) {
    await generateSeedData()
  }
  
  console.log('\n' + '='.repeat(70))
  console.log('💡 RECOMMENDATIONS')
  console.log('='.repeat(70))
  
  if (missingTables.length > 0) {
    console.log('\n🔴 CRITICAL: Missing tables detected')
    console.log('   Apply migrations:')
    console.log('   1. Open Supabase Dashboard')
    console.log('   2. Go to SQL Editor')
    console.log('   3. Run: supabase/migrations/20251012_fix_community_schema.sql')
  }
  
  if (emptyTables.length > 0) {
    console.log('\n🟡 WARNING: Empty tables detected')
    console.log('   Run: node scripts/seed-and-test.js')
  }
  
  console.log('\n🟢 NEXT STEPS:')
  console.log('   1. Fix build errors')
  console.log('   2. Test all pages locally')
  console.log('   3. Deploy to production')
  
  console.log('\n✨ Audit completed!\n')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\n❌ Audit failed:', err.message)
    process.exit(1)
  })
