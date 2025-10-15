import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Use the service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Service Key exists:', !!supabaseServiceKey);

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testServiceKey() {
  console.log('Testing with service role key...');
  
  // Check if we can access FAQ items (should work with service role key)
  const { data, error } = await supabase
    .from('faq_items')
    .select('*')
    .eq('is_published', true)
    .limit(5);

  if (error) {
    console.error('Error fetching FAQ items with service key:', error);
    return;
  }

  console.log('FAQ items with service key:', data.length);
  console.log('FAQ items with service key:', JSON.stringify(data, null, 2));
}

testServiceKey();