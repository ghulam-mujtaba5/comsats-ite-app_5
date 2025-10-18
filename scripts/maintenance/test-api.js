const { createClient } = require('@supabase/supabase-js');

// Use local Supabase instance
const supabaseUrl = 'http://localhost:54321';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAPI() {
  console.log('Testing Community API...');
  
  try {
    // Sign in as test user
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'testpassword'
    });
    
    if (error) {
      console.error('Auth error:', error);
      return;
    }
    
    console.log('Authenticated as:', data.user.email);
    
    // Test creating a post
    const { data: postData, error: postError } = await supabase
      .from('community_posts_enhanced')
      .insert({
        user_id: data.user.id,
        content: 'This is a test post from the API test script',
        type: 'general'
      })
      .select();
    
    if (postError) {
      console.error('Post creation error:', postError);
      return;
    }
    
    console.log('Post created successfully:', postData);
    
    // Test fetching posts
    const { data: postsData, error: postsError } = await supabase
      .from('community_posts_enhanced')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (postsError) {
      console.error('Posts fetch error:', postsError);
      return;
    }
    
    console.log('Fetched posts:', postsData);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testAPI().catch(console.error);