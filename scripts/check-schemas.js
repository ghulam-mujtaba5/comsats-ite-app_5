const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchemas() {
  console.log('🔍 Checking Table Schemas...\n');

  // Check community_posts
  console.log('📊 community_posts table:');
  const { data: posts, error: postsError } = await supabase
    .from('community_posts')
    .select('*')
    .limit(1);
  
  if (posts && posts.length > 0) {
    console.log('Columns:', Object.keys(posts[0]));
  } else {
    console.log('No data yet, checking with insert test...');
    // Try to get error message which will show available columns
    const { error } = await supabase
      .from('community_posts')
      .insert({ test: 'test' });
    console.log('Available columns hint:', error?.message);
  }

  // Check help_desk_tickets
  console.log('\n📊 help_desk_tickets table:');
  const { data: tickets, error: ticketsError } = await supabase
    .from('help_desk_tickets')
    .select('*')
    .limit(1);
  
  if (tickets && tickets.length > 0) {
    console.log('Columns:', Object.keys(tickets[0]));
  } else {
    const { error } = await supabase
      .from('help_desk_tickets')
      .insert({ test: 'test' });
    console.log('Available columns hint:', error?.message);
  }

  // Check news table
  console.log('\n📊 news table:');
  const { data: news, error: newsError } = await supabase
    .from('news')
    .select('*')
    .limit(1);
  
  if (newsError) {
    console.log('Error:', newsError.message);
  } else if (news && news.length > 0) {
    console.log('Columns:', Object.keys(news[0]));
  } else {
    console.log('Table exists but is empty');
  }
}

checkSchemas();
