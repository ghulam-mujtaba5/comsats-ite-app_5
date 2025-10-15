import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Use the exact same environment variables as the API
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key exists:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSameEnv() {
  console.log('Testing with same environment variables as API...');
  
  // Check if we can access published FAQ items
  const { data, error } = await supabase
    .from('faq_items')
    .select('*')
    .eq('is_published', true)
    .limit(5);

  if (error) {
    console.error('Error fetching FAQ items:', error);
    return;
  }

  console.log('FAQ items:', data.length);
  console.log('FAQ items:', JSON.stringify(data, null, 2));
}

testSameEnv();