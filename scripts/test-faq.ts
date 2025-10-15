import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFAQ() {
  console.log('Testing FAQ items in database...');
  
  // Check if there are any FAQ items
  const { data, error } = await supabase
    .from('faq_items')
    .select('*')
    .eq('is_published', true)
    .limit(5);

  if (error) {
    console.error('Error fetching FAQ items:', error);
    return;
  }

  console.log('FAQ items found:', data.length);
  console.log('FAQ items:', JSON.stringify(data, null, 2));
  
  // If no FAQ items, let's create some test data
  if (data.length === 0) {
    console.log('No FAQ items found, creating test data...');
    
    const testFAQs = [
      {
        question: 'What is CampusAxis?',
        answer: 'CampusAxis is a comprehensive student portal for COMSATS University that provides access to academic resources, faculty information, and campus services.',
        category: 'general',
        tags: ['introduction', 'overview'],
        is_published: true
      },
      {
        question: 'How do I access my academic records?',
        answer: 'You can access your academic records by logging into the student portal and navigating to the "Academic Records" section. You will need your university credentials to log in.',
        category: 'academic',
        tags: ['records', 'grades', 'transcript'],
        is_published: true
      },
      {
        question: 'What should I do if I forget my password?',
        answer: 'If you forget your password, click on the "Forgot Password" link on the login page and follow the instructions to reset your password. You will receive an email with reset instructions.',
        category: 'technical',
        tags: ['password', 'login', 'reset'],
        is_published: true
      }
    ];

    const { data: inserted, error: insertError } = await supabase
      .from('faq_items')
      .insert(testFAQs)
      .select();

    if (insertError) {
      console.error('Error inserting test FAQ items:', insertError);
    } else {
      console.log('Successfully inserted test FAQ items:', inserted.length);
    }
  }
}

testFAQ();