#!/usr/bin/env node

/**
 * Database Seed and Test Script
 * Run with: node scripts/seed-and-test.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedGuidanceContent() {
  console.log('\n📦 Seeding Guidance Content...')
  
  const content = [
    {
      title: 'Course Registration Process',
      description: 'Step-by-step guide for registering courses each semester',
      content: `**Course Registration Steps:**

1. **Pre-Registration Phase**
   - Check your academic standing
   - Meet with your academic advisor
   - Plan your course schedule

2. **Registration Period**
   - Log into the student portal
   - Select courses based on your degree plan
   - Ensure prerequisites are met
   - Submit your registration

3. **Post-Registration**
   - Pay semester fees
   - Verify your schedule
   - Make any necessary changes during add/drop period`,
      category: 'academic',
      is_important: true,
      is_published: true
    },
    {
      title: 'Campus Facilities Guide',
      description: 'Information about campus facilities and services',
      content: `**Campus Locations:**

**Student Services:**
- Library: Main building, extended hours during exams
- Cafeteria: Multiple dining options
- Sports Complex: Gym, courts, and fields
- Medical Center: First aid and health services`,
      category: 'campus',
      is_important: false,
      is_published: true
    },
    {
      title: 'Financial Aid Information',
      description: 'Scholarships, grants, and financial assistance programs',
      content: `**Financial Aid Programs:**

**Merit-Based Scholarships:**
- Academic Excellence: 50% fee waiver
- Dean's List: 25% fee waiver

**Need-Based Financial Aid:**
- Financial Assistance Program: Up to 75% fee waiver`,
      category: 'financial',
      is_important: true,
      is_published: true
    },
    {
      title: 'Academic Policies',
      description: 'Important academic policies every student should know',
      content: `**Academic Policies:**

**Attendance Policy:**
- Minimum 75% attendance required

**Grading System:**
- A: 85-100 (4.0 GPA)
- B: 70-84 (3.0 GPA)
- C: 60-69 (2.0 GPA)`,
      category: 'policies',
      is_important: true,
      is_published: true
    }
  ]
  
  try {
    const { data, error } = await supabase
      .from('guidance_content')
      .insert(content)
      .select()
    
    if (error) throw error
    console.log(`✅ Successfully seeded ${data.length} guidance content items`)
    return true
  } catch (error) {
    console.error('❌ Failed to seed guidance content:', error.message)
    return false
  }
}

async function seedFAQItems() {
  console.log('\n📦 Seeding FAQ Items...')
  
  const faqs = [
    {
      question: 'How do I register for courses?',
      answer: 'Course registration is done through the student portal during designated registration periods. Make sure to meet with your advisor first.',
      category: 'academic',
      tags: ['registration', 'courses', 'portal'],
      is_published: true
    },
    {
      question: 'What are the library hours?',
      answer: 'The library is open 24/7 during regular semester periods. During breaks and holidays, hours may be reduced.',
      category: 'campus',
      tags: ['library', 'hours', 'facilities'],
      is_published: true
    },
    {
      question: 'How can I apply for financial aid?',
      answer: 'Financial aid applications are available through the student portal. Submit your application along with required documents before the deadline.',
      category: 'financial',
      tags: ['financial aid', 'scholarships', 'application'],
      is_published: true
    },
    {
      question: 'What is the minimum CGPA requirement?',
      answer: 'Students must maintain a minimum CGPA of 2.0 to remain in good academic standing. Below this may result in academic probation.',
      category: 'academic',
      tags: ['cgpa', 'grades', 'requirements'],
      is_published: true
    },
    {
      question: 'How do I join student clubs?',
      answer: 'Contact the Student Affairs office or visit club booths during orientation week. Most clubs have open membership.',
      category: 'campus',
      tags: ['clubs', 'activities', 'student life'],
      is_published: true
    }
  ]
  
  try {
    const { data, error } = await supabase
      .from('faq_items')
      .insert(faqs)
      .select()
    
    if (error) throw error
    console.log(`✅ Successfully seeded ${data.length} FAQ items`)
    return true
  } catch (error) {
    console.error('❌ Failed to seed FAQ items:', error.message)
    return false
  }
}

async function testAPIs() {
  console.log('\n🧪 Testing APIs...')
  
  const tests = [
    { name: 'Guidance Content', table: 'guidance_content' },
    { name: 'FAQ Items', table: 'faq_items' },
    { name: 'Community Posts', table: 'community_posts' },
    { name: 'Post Comments', table: 'post_comments' },
    { name: 'Post Reactions', table: 'post_reactions' }
  ]
  
  const results = []
  
  for (const test of tests) {
    try {
      const { data, error } = await supabase
        .from(test.table)
        .select('id')
        .limit(1)
      
      if (error) throw error
      
      const count = data ? data.length : 0
      results.push({ name: test.name, success: true, count })
      console.log(`✅ ${test.name}: Found ${count} records`)
    } catch (error) {
      results.push({ name: test.name, success: false, error: error.message })
      console.error(`❌ ${test.name}: ${error.message}`)
    }
  }
  
  return results
}

async function main() {
  console.log('🚀 Database Seed and Test Script')
  console.log('='.repeat(50))
  
  // Check existing data
  console.log('\n🔍 Checking existing data...')
  
  const { data: existingContent } = await supabase
    .from('guidance_content')
    .select('id')
    .limit(1)
  
  const { data: existingFAQs } = await supabase
    .from('faq_items')
    .select('id')
    .limit(1)
  
  // Seed if needed
  if (!existingContent || existingContent.length === 0) {
    await seedGuidanceContent()
  } else {
    console.log('\n⚠️  Guidance content already exists, skipping seed')
  }
  
  if (!existingFAQs || existingFAQs.length === 0) {
    await seedFAQItems()
  } else {
    console.log('\n⚠️  FAQ items already exist, skipping seed')
  }
  
  // Test all APIs
  await testAPIs()
  
  console.log('\n✨ Script completed!')
  console.log('='.repeat(50))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
