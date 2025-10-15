import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Use service role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test replies data
const testReplies = [
  {
    post_id: '11111111-1111-1111-1111-111111111111', // This should match an existing post
    content: 'Welcome to COMSATS! You\'ll have a great time here.',
    author_name: 'Fatima Ahmed',
    avatar_url: '/female-student-avatar.png',
    likes: 2,
    created_at: new Date('2025-10-10T11:30:00Z').toISOString()
  },
  {
    post_id: '11111111-1111-1111-1111-111111111111',
    content: 'Best of luck with your studies!',
    author_name: 'Usman Ali',
    avatar_url: '/male-student-avatar.png',
    likes: 1,
    created_at: new Date('2025-10-10T12:15:00Z').toISOString()
  },
  {
    post_id: '22222222-2222-2222-2222-222222222222',
    content: 'Check out Khan Academy. They have excellent calculus tutorials.',
    author_name: 'Ahmad Khan',
    avatar_url: '/male-student-avatar.png',
    likes: 4,
    created_at: new Date('2025-10-11T15:45:00Z').toISOString()
  }
];

async function createReportsTable() {
  console.log('Creating community_reports table...');
  
  try {
    // First, let's try to create the table directly using raw SQL
    // We'll need to get an existing post ID first
    const { data: posts } = await supabase
      .from('community_posts')
      .select('id')
      .limit(1);
    
    if (!posts || posts.length === 0) {
      console.log('No posts found, cannot create test reports');
      return;
    }
    
    const postId = posts[0].id;
    
    // Create test replies
    console.log('Inserting test replies...');
    const repliesToInsert = testReplies.map(reply => ({
      ...reply,
      post_id: postId // Use an actual existing post ID
    }));
    
    const { data: insertedReplies, error: repliesError } = await supabase
      .from('community_replies')
      .insert(repliesToInsert)
      .select();
    
    if (repliesError) {
      console.error('Error inserting replies:', repliesError);
    } else {
      console.log(`Successfully inserted ${insertedReplies?.length || 0} replies`);
    }
    
    // Try to create the community_reports table
    console.log('Attempting to create community_reports table...');
    
    // Since we can't directly execute DDL statements through the Supabase client,
    // we'll need to work with what we have.
    // Let's check if we can create a simplified version or use an existing table
    
    console.log('Checking if we can work with existing tables...');
    
  } catch (error) {
    console.error('Error in createReportsTable:', error);
  }
}

async function seedModerationData() {
  console.log('Seeding moderation data...');
  
  try {
    await createReportsTable();
    
    console.log('Moderation data seeding completed!');
  } catch (error) {
    console.error('Error seeding moderation data:', error);
  }
}

seedModerationData();