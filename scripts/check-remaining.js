const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const tables = ['resources', 'campuses', 'departments', 'programs'];
  
  for (const t of tables) {
    try {
      const { count } = await supabase
        .from(t)
        .select('*', { count: 'exact', head: true });
      console.log(`✅ ${t}: ${count} records`);
    } catch (e) {
      console.log(`❌ ${t}: ${e.message}`);
    }
  }
}

check();
