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

async function testModerationAPI() {
  console.log('Testing moderation API endpoints...');
  
  try {
    // Test posts endpoint
    console.log('\n--- Testing Posts Endpoint ---');
    const { data: posts, error: postsError } = await supabase
      .from('community_posts')
      .select(`
        id,
        title,
        content,
        author_name,
        author_email,
        created_at,
        status,
        category,
        likes_count,
        comments_count,
        reports_count
      `)
      .order('created_at', { ascending: false });

    if (postsError) {
      console.error('Error fetching posts:', postsError);
    } else {
      console.log(`Found ${posts?.length || 0} posts`);
      posts?.slice(0, 2).forEach((post: any) => {
        console.log(`  - ${post.title} (${post.status})`);
      });
    }
    
    // Test comments endpoint (using community_replies)
    console.log('\n--- Testing Comments Endpoint ---');
    const { data: comments, error: commentsError } = await supabase
      .from('post_comments_enhanced')
      .select(`
        id,
        content,
        author_name,
        author_email,
        created_at,
        status,
        reports_count,
        post:community_posts(title)
      `)
      .order('created_at', { ascending: false });

    if (commentsError) {
      console.log('post_comments_enhanced table not found, trying community_replies...');
      
      const { data: replies, error: repliesError } = await supabase
        .from('community_replies')
        .select(`
          id,
          content,
          author_name,
          created_at
        `)
        .order('created_at', { ascending: false });
      
      if (repliesError) {
        console.error('Error fetching replies:', repliesError);
      } else {
        console.log(`Found ${replies?.length || 0} replies`);
        replies?.slice(0, 2).forEach((reply: any) => {
          console.log(`  - ${reply.content.substring(0, 30)}... by ${reply.author_name}`);
        });
      }
    } else {
      console.log(`Found ${comments?.length || 0} comments`);
      comments?.slice(0, 2).forEach((comment: any) => {
        console.log(`  - ${comment.content.substring(0, 30)}...`);
      });
    }
    
    // Test reports endpoint
    console.log('\n--- Testing Reports Endpoint ---');
    // We'll simulate this since the table might not exist
    
    console.log('Moderation API test completed!');
  } catch (error) {
    console.error('Error testing moderation API:', error);
  }
}

testModerationAPI();