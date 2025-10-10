const { createClient } = require('@supabase/supabase-js');

// Use local Supabase instance
const supabaseUrl = 'http://localhost:54321';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCommunityAPI() {
  console.log('Testing Community API...');
  
  // Sign in as test user
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'test@example.com',
    password: 'testpassword'
  });
  
  if (authError) {
    console.error('Auth error:', authError);
    return;
  }
  
  console.log('Authenticated as:', authData.user.email);
  
  // Test creating a post
  const postData = {
    content: 'This is a test post from the API test script',
    type: 'general',
    tags: ['test', 'api']
  };
  
  try {
    const response = await fetch('http://localhost:3002/api/community/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData)
    });
    
    const result = await response.json();
    console.log('Post creation result:', result);
    
    if (response.ok) {
      console.log('✅ Post created successfully!');
    } else {
      console.error('❌ Post creation failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error creating post:', error);
  }
}

testCommunityAPI().catch(console.error);