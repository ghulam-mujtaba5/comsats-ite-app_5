import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Use service role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkFAQ() {
  console.log('Checking FAQ items in database using service role key...');
  
  // Check if there are any FAQ items (bypass RLS)
  const { data, error, count } = await supabase
    .from('faq_items')
    .select('*', { count: 'exact' });

  if (error) {
    console.error('Error fetching FAQ items:', error);
    return;
  }

  console.log('Total FAQ items in database:', count);
  console.log('FAQ items:', JSON.stringify(data, null, 2));
  
  // Check published FAQ items
  const { data: published, error: publishedError } = await supabase
    .from('faq_items')
    .select('*')
    .eq('is_published', true);

  if (publishedError) {
    console.error('Error fetching published FAQ items:', publishedError);
    return;
  }

  console.log('Published FAQ items:', published.length);
  console.log('Published FAQ items:', JSON.stringify(published, null, 2));
}

checkFAQ();