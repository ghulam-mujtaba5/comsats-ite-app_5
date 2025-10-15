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

async function checkAuthUsers() {
  console.log('Checking available data sources...');
  
  try {
    // Check community_posts columns
    console.log('Checking community_posts columns...');
    const { data: posts, error: postsError } = await supabase
      .from('community_posts')
      .select('*')
      .limit(1);
    
    if (postsError) {
      console.error('Error fetching posts:', postsError);
    } else {
      console.log(`Found ${posts?.length || 0} posts:`);
      if (posts && posts.length > 0) {
        console.log('Available columns:');
        Object.keys(posts[0]).forEach((column) => {
          console.log(`  - ${column}`);
        });
      }
    }
    
    // Check admin_users data
    console.log('\nChecking admin_users data...');
    const { data: admins, error: adminsError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(3);
    
    if (adminsError) {
      console.error('Error fetching admin users:', adminsError);
    } else {
      console.log(`Found ${admins?.length || 0} admin users:`);
      admins?.forEach((admin: any) => {
        console.log(`  - User ID: ${admin.user_id} (Role: ${admin.role})`);
      });
    }
    
    // Check community_replies data
    console.log('\nChecking community_replies data...');
    const { data: replies, error: repliesError } = await supabase
      .from('community_replies')
      .select('*')
      .limit(3);
    
    if (repliesError) {
      console.error('Error fetching replies:', repliesError);
    } else {
      console.log(`Found ${replies?.length || 0} replies:`);
      replies?.forEach((reply: any) => {
        console.log(`  - Author: ${reply.author_name} (${reply.author_email || 'No email'})`);
      });
    }
    
  } catch (error) {
    console.error('Error checking data sources:', error);
  }
}

checkAuthUsers();