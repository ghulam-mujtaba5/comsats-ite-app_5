const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🎯 FINAL COMPREHENSIVE VERIFICATION\n');
console.log('='.repeat(70) + '\n');

async function verifyAll() {
  const tables = {
    'guidance_content': 'Guidance Content',
    'faq_items': 'FAQ Items',
    'community_posts': 'Community Posts',
    'post_reactions': 'Post Reactions',
    'post_comments': 'Post Comments',
    'news_items': 'News Articles',
    'events': 'Events',
    'faculty': 'Faculty',
    'help_desk_tickets': 'Help Desk Tickets',
    'past_papers': 'Past Papers',
    'lost_found_items': 'Lost & Found',
    'resources': 'Resources',
    'campuses': 'Campuses',
    'departments': 'Departments',
    'programs': 'Programs'
  };

  const results = {};
  let totalRecords = 0;

  for (const [table, name] of Object.entries(tables)) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        results[name] = { status: 'error', count: 0, message: error.message };
        console.log(`❌ ${name}: ERROR - ${error.message.substring(0, 50)}...`);
      } else if (count === 0) {
        results[name] = { status: 'empty', count: 0 };
        console.log(`⚠️  ${name}: EMPTY (0 records)`);
      } else {
        results[name] = { status: 'ok', count };
        totalRecords += count;
        console.log(`✅ ${name}: ${count} records`);
      }
    } catch (e) {
      results[name] = { status: 'error', count: 0, message: e.message };
      console.log(`❌ ${name}: ${e.message.substring(0, 50)}...`);
    }
  }

  // Summary
  const okTables = Object.values(results).filter(r => r.status === 'ok').length;
  const emptyTables = Object.values(results).filter(r => r.status === 'empty').length;
  const errorTables = Object.values(results).filter(r => r.status === 'error').length;

  console.log('\n' + '='.repeat(70));
  console.log('📊 SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Working Tables: ${okTables}/15`);
  console.log(`⚠️  Empty Tables: ${emptyTables}/15`);
  console.log(`❌ Error Tables: ${errorTables}/15`);
  console.log(`📦 Total Records: ${totalRecords}`);
  console.log('='.repeat(70) + '\n');

  // Feature status
  console.log('🎯 FEATURE STATUS\n');
  
  const features = [
    { name: 'Guidance Page', tables: ['guidance_content', 'faq_items'] },
    { name: 'Community Hub', tables: ['community_posts', 'post_reactions', 'post_comments'] },
    { name: 'News & Updates', tables: ['news_items'] },
    { name: 'Events Calendar', tables: ['events'] },
    { name: 'Faculty Directory', tables: ['faculty'] },
    { name: 'Help Desk', tables: ['help_desk_tickets'] },
    { name: 'Past Papers', tables: ['past_papers'] },
    { name: 'Lost & Found', tables: ['lost_found_items'] },
    { name: 'Resources', tables: ['resources'] },
    { name: 'Multi-Campus', tables: ['campuses', 'departments', 'programs'] }
  ];

  for (const feature of features) {
    const tableResults = feature.tables.map(t => {
      const tableName = Object.entries(tables).find(([key]) => key === t)?.[1];
      return results[tableName];
    });

    const allOk = tableResults.every(r => r && r.status === 'ok');
    const someOk = tableResults.some(r => r && r.status === 'ok');
    
    if (allOk) {
      console.log(`✅ ${feature.name}: FULLY FUNCTIONAL`);
    } else if (someOk) {
      console.log(`⚠️  ${feature.name}: PARTIALLY FUNCTIONAL`);
    } else {
      console.log(`❌ ${feature.name}: NOT FUNCTIONAL`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('🚀 NEXT STEPS\n');
  console.log('1. Visit http://localhost:3001/community (5 posts + reactions + comments)');
  console.log('2. Visit http://localhost:3001/news (3 news articles)');
  console.log('3. Visit http://localhost:3001/help-desk (5 tickets)');
  console.log('4. Visit http://localhost:3001/guidance (5 guidance items + 20 FAQs)');
  console.log('5. Visit http://localhost:3001/faculty (67 faculty members)');
  console.log('6. Visit http://localhost:3001/events (2 events)');
  console.log('7. Visit http://localhost:3001/past-papers (1 paper)');
  console.log('8. Visit http://localhost:3001/lost-found (1 item)');
  console.log('9. Visit http://localhost:3001/resources (1 resource)');
  console.log('10. Test all features thoroughly!');
  console.log('='.repeat(70) + '\n');
}

verifyAll();
