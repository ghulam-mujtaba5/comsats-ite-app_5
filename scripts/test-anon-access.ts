import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Use anon key (should respect RLS)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAnonAccess() {
  console.log('Testing anon access to FAQ items...');
  
  // Check if anon key can access published FAQ items (should work with RLS)
  const { data, error } = await supabase
    .from('faq_items')
    .select('*')
    .eq('is_published', true)
    .limit(5);

  if (error) {
    console.error('Error fetching FAQ items with anon key:', error);
    return;
  }

  console.log('FAQ items accessible with anon key:', data.length);
  console.log('FAQ items:', JSON.stringify(data, null, 2));
}

testAnonAccess();