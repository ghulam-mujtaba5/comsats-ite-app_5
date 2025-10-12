const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function introspectSchema() {
  console.log('🔍 Introspecting Database Schema...\n');

  // Query information_schema to get table columns
  const tables = ['community_posts', 'help_desk_tickets', 'news', 'news_articles'];
  
  for (const tableName of tables) {
    console.log(`\n📊 ${tableName}:`);
    
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = '${tableName}'
            ORDER BY ordinal_position;`
    });

    if (error) {
      // Try alternative method - direct query
      const { data: tableCheck } = await supabase
        .from(tableName)
        .select('*')
        .limit(0);
      
      if (tableCheck !== null) {
        console.log('  ✅ Table exists (empty)');
      } else {
        console.log('  ❌ Table does not exist');
      }
    } else if (data && data.length > 0) {
      console.log('  Columns:');
      data.forEach(col => {
        console.log(`    - ${col.column_name} (${col.data_type})`);
      });
    }
  }

  // Alternative: Check what tables exist
  console.log('\n\n📋 Checking all available tables...');
  const { data: allTables, error: tablesError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public');

  if (!tablesError && allTables) {
    console.log('Available tables:', allTables.map(t => t.table_name).join(', '));
  }
}

introspectSchema();
