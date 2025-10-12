/**
 * Comprehensive API Test and Fix Script
 * 
 * This script tests all community and guidance APIs and provides fixes
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testGuidanceContent() {
  console.log('\n🧪 Testing Guidance Content...')
  
  try {
    const { data, error } = await supabase
      .from('guidance_content')
      .select('*')
      .eq('is_published', true)
      .limit(5)
    
    if (error) throw error
    
    console.log(`✅ Found ${data?.length || 0} guidance content items`)
    
    if (!data || data.length === 0) {
      console.log('⚠️  No guidance content found. Run seed script to add data.')
      return false
    }
    
    return true
  } catch (error: any) {
    console.error('❌ Guidance content test failed:', error.message)
    return false
  }
}

async function testFAQItems() {
  console.log('\n🧪 Testing FAQ Items...')
  
  try {
    const { data, error } = await supabase
      .from('faq_items')
      .select('*')
      .eq('is_published', true)
      .limit(5)
    
    if (error) throw error
    
    console.log(`✅ Found ${data?.length || 0} FAQ items`)
    
    if (!data || data.length === 0) {
      console.log('⚠️  No FAQ items found. Run seed script to add data.')
      return false
    }
    
    return true
  } catch (error: any) {
    console.error('❌ FAQ test failed:', error.message)
    return false
  }
}

async function testCommunityPosts() {
  console.log('\n🧪 Testing Community Posts...')
  
  try {
    const { data, error } = await supabase
      .from('community_posts_enhanced')
      .select(`
        id,
        content,
        type,
        likes_count,
        comments_count,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (error) throw error
    
    console.log(`✅ Found ${data?.length || 0} community posts`)
    
    if (!data || data.length === 0) {
      console.log('⚠️  No community posts found.')
      return false
    }
    
    return true
  } catch (error: any) {
    console.error('❌ Community posts test failed:', error.message)
    return false
  }
}

async function testComments() {
  console.log('\n🧪 Testing Comments System...')
  
  try {
    const { data, error } = await supabase
      .from('post_comments')
      .select('*')
      .limit(5)
    
    if (error) throw error
    
    console.log(`✅ Found ${data?.length || 0} comments`)
    return true
  } catch (error: any) {
    console.error('❌ Comments test failed:', error.message)
    return false
  }
}

async function testReactions() {
  console.log('\n🧪 Testing Reactions System...')
  
  try {
    const { data, error } = await supabase
      .from('post_reactions')
      .select('*')
      .limit(5)
    
    if (error) throw error
    
    console.log(`✅ Found ${data?.length || 0} reactions`)
    return true
  } catch (error: any) {
    console.error('❌ Reactions test failed:', error.message)
    return false
  }
}

async function seedGuidanceData() {
  console.log('\n📦 Seeding Guidance Data...')
  
  try {
    // Check if data already exists
    const { data: existingContent } = await supabase
      .from('guidance_content')
      .select('id')
      .limit(1)
    
    if (existingContent && existingContent.length > 0) {
      console.log('⚠️  Guidance content already exists. Skipping seed.')
      return true
    }
    
    const guidanceContent = [
      {
        title: 'Course Registration Process',
        description: 'Step-by-step guide for registering courses each semester',
        content: '**Course Registration Steps:**\n\n1. Log into student portal\n2. Select courses\n3. Verify schedule\n4. Pay fees',
        category: 'academic',
        is_important: true,
        is_published: true
      },
      {
        title: 'Campus Facilities',
        description: 'Guide to campus facilities and services',
        content: '**Available Facilities:**\n\n- Library\n- Sports Complex\n- Cafeteria\n- Medical Center',
        category: 'campus',
        is_important: false,
        is_published: true
      }
    ]
    
    const { error } = await supabase
      .from('guidance_content')
      .insert(guidanceContent)
    
    if (error) throw error
    
    console.log('✅ Guidance data seeded successfully')
    return true
  } catch (error: any) {
    console.error('❌ Failed to seed guidance data:', error.message)
    return false
  }
}

async function seedFAQData() {
  console.log('\n📦 Seeding FAQ Data...')
  
  try {
    // Check if data already exists
    const { data: existingFAQs } = await supabase
      .from('faq_items')
      .select('id')
      .limit(1)
    
    if (existingFAQs && existingFAQs.length > 0) {
      console.log('⚠️  FAQ items already exist. Skipping seed.')
      return true
    }
    
    const faqItems = [
      {
        question: 'How do I register for courses?',
        answer: 'Course registration is done through the student portal during designated periods.',
        category: 'academic',
        tags: ['registration', 'courses'],
        is_published: true
      },
      {
        question: 'What are the library hours?',
        answer: 'The library is open 24/7 during regular semester periods.',
        category: 'campus',
        tags: ['library', 'hours'],
        is_published: true
      }
    ]
    
    const { error } = await supabase
      .from('faq_items')
      .insert(faqItems)
    
    if (error) throw error
    
    console.log('✅ FAQ data seeded successfully')
    return true
  } catch (error: any) {
    console.error('❌ Failed to seed FAQ data:', error.message)
    return false
  }
}

async function main() {
  console.log('🚀 Starting API Tests and Fixes\n')
  console.log('=' .repeat(50))
  
  // Test all APIs
  const guidanceOk = await testGuidanceContent()
  const faqOk = await testFAQItems()
  const postsOk = await testCommunityPosts()
  const commentsOk = await testComments()
  const reactionsOk = await testReactions()
  
  console.log('\n' + '='.repeat(50))
  console.log('\n📊 Test Results:')
  console.log(`Guidance Content: ${guidanceOk ? '✅' : '❌'}`)
  console.log(`FAQ Items: ${faqOk ? '✅' : '❌'}`)
  console.log(`Community Posts: ${postsOk ? '✅' : '❌'}`)
  console.log(`Comments: ${commentsOk ? '✅' : '❌'}`)
  console.log(`Reactions: ${reactionsOk ? '✅' : '❌'}`)
  
  // Seed data if needed
  if (!guidanceOk) {
    await seedGuidanceData()
  }
  
  if (!faqOk) {
    await seedFAQData()
  }
  
  console.log('\n✨ Tests and fixes completed!')
}

main().catch(console.error)
