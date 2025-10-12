const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🌱 Seeding with NULL user_id (Foreign Key Fix)...\n');

async function seedCommunityPosts() {
  try {
    console.log('📝 Seeding Community Posts...');
    
    const { data: existingPosts } = await supabase
      .from('community_posts')
      .select('id')
      .limit(1);

    if (!existingPosts || existingPosts.length === 0) {
      // First, check if there are any real users we can use
      const { data: users } = await supabase.auth.admin.listUsers();
      const userId = users && users.users && users.users.length > 0 ? users.users[0].id : null;

      if (userId) {
        console.log(`  ℹ️  Found real user: ${userId}, using it for posts`);
      } else {
        console.log('  ℹ️  No real users found, checking if we can use NULL...');
      }

      const posts = [
        {
          user_id: userId || '00000000-0000-0000-0000-000000000000', // Try a known UUID or null
          title: 'Welcome to COMSATS Community! 🎉',
          content: 'Hey everyone! This is the official COMSATS ITE community platform. Feel free to share your thoughts, ask questions, and connect with fellow students!',
          type: 'general',
          tags: ['welcome', 'community', 'introduction'],
          likes: 15,
          comments: 5,
          shares: 2
        },
        {
          user_id: userId || '00000000-0000-0000-0000-000000000000',
          title: 'Tips for Final Exams Preparation 📚',
          content: 'Final exams are approaching! Here are some tips that helped me:\n\n1. Start early\n2. Make summary notes\n3. Practice past papers\n4. Study in groups\n5. Take regular breaks',
          type: 'question',
          tags: ['exams', 'study-tips', 'finals'],
          likes: 42,
          comments: 12,
          shares: 8
        },
        {
          user_id: userId || '00000000-0000-0000-0000-000000000000',
          title: 'Looking for Study Partner - Data Structures',
          content: 'Is anyone interested in forming a study group for Data Structures? We can meet at the library or study online.',
          type: 'question',
          tags: ['data-structures', 'study-group'],
          likes: 8,
          comments: 6,
          shares: 1
        },
        {
          user_id: userId || '00000000-0000-0000-0000-000000000000',
          title: 'Campus Food Recommendations? 🍕',
          content: 'What are the best places to eat around campus? I\'m new here and looking for good food spots.',
          type: 'general',
          tags: ['food', 'campus-life'],
          likes: 23,
          comments: 18,
          shares: 4
        },
        {
          user_id: userId || '00000000-0000-0000-0000-000000000000',
          title: 'Internship Opportunities Discussion',
          content: 'Let\'s share information about internship opportunities! Tips for the application process welcome.',
          type: 'general',
          tags: ['internship', 'career'],
          likes: 56,
          comments: 24,
          shares: 15
        }
      ];

      const { data, error } = await supabase
        .from('community_posts')
        .insert(posts)
        .select();

      if (error) {
        console.log('  ⚠️  Error:', error.message);
        console.log('  ℹ️  Trying without user_id constraint...');
        return [];
      } else {
        console.log(`  ✅ Created ${data.length} community posts`);
        return data;
      }
    } else {
      console.log('  ℹ️  Posts already exist');
      const { data } = await supabase.from('community_posts').select('id');
      return data || [];
    }
  } catch (error) {
    console.log('  ⚠️  Error:', error.message);
    return [];
  }
}

async function seedReactionsAndComments(posts) {
  if (!posts || posts.length === 0) {
    console.log('\n❤️  Skipping reactions - no posts available');
    console.log('💬 Skipping comments - no posts available');
    return;
  }

  try {
    // Get a valid user_id
    const { data: users } = await supabase.auth.admin.listUsers();
    const userId = users && users.users && users.users.length > 0 ? users.users[0].id : '00000000-0000-0000-0000-000000000000';

    console.log('\n❤️  Seeding Post Reactions...');
    
    const { data: existingReactions } = await supabase
      .from('post_reactions')
      .select('id')
      .limit(1);

    if (!existingReactions || existingReactions.length === 0) {
      const reactions = [];
      const reactionTypes = ['like', 'love', 'insightful'];
      
      posts.forEach((post, postIndex) => {
        const reactionCount = Math.min(2 + postIndex, 5);
        for (let i = 0; i < reactionCount; i++) {
          reactions.push({
            post_id: post.id,
            user_id: userId,
            reaction_type: reactionTypes[i % reactionTypes.length]
          });
        }
      });

      if (reactions.length > 0) {
        const { error } = await supabase
          .from('post_reactions')
          .insert(reactions);

        if (error) {
          console.log('  ⚠️  Error:', error.message);
        } else {
          console.log(`  ✅ Created ${reactions.length} reactions`);
        }
      }
    } else {
      console.log('  ℹ️  Reactions already exist');
    }

    console.log('\n💬 Seeding Post Comments...');
    
    const { data: existingComments } = await supabase
      .from('post_comments')
      .select('id')
      .limit(1);

    if (!existingComments || existingComments.length === 0) {
      const comments = [];
      const commentTexts = [
        'Great post! Thanks for sharing.',
        'This is really helpful!',
        'I completely agree.',
        'Thanks for the information!',
        'Very useful, bookmarked.'
      ];

      posts.forEach((post, postIndex) => {
        const commentCount = Math.min(1 + postIndex, 4);
        for (let i = 0; i < commentCount; i++) {
          comments.push({
            post_id: post.id,
            user_id: userId,
            content: commentTexts[i % commentTexts.length]
          });
        }
      });

      if (comments.length > 0) {
        const { error } = await supabase
          .from('post_comments')
          .insert(comments);

        if (error) {
          console.log('  ⚠️  Error:', error.message);
        } else {
          console.log(`  ✅ Created ${comments.length} comments`);
        }
      }
    } else {
      console.log('  ℹ️  Comments already exist');
    }
  } catch (error) {
    console.log('  ⚠️  Error:', error.message);
  }
}

async function seedHelpDeskTickets() {
  try {
    console.log('\n🎫 Seeding Help Desk Tickets...');
    
    const { data: existingTickets } = await supabase
      .from('help_desk_tickets')
      .select('id')
      .limit(1);

    if (!existingTickets || existingTickets.length === 0) {
      // Get a valid user_id or use null
      const { data: users } = await supabase.auth.admin.listUsers();
      const userId = users && users.users && users.users.length > 0 ? users.users[0].id : null;

      const tickets = [
        {
          title: 'Unable to Access Student Portal',
          description: 'I am having trouble logging into the student portal. It shows "Invalid credentials" even though I\'m using the correct password.',
          category: 'Technical',
          priority: 'high',
          status: 'open',
          student_name: 'Ahmad Khan',
          student_id: 'FA21-BSE-001',
          user_id: userId
        },
        {
          title: 'Fee Challan Not Generated',
          description: 'My fee challan for this semester is not generating. I need it urgently to pay before the deadline.',
          category: 'Financial',
          priority: 'high',
          status: 'in-progress',
          student_name: 'Sara Ahmed',
          student_id: 'FA21-BSE-015',
          user_id: userId
        },
        {
          title: 'Course Registration Issue',
          description: 'I cannot register for "Database Systems" course. It shows "Prerequisites not met" but I have completed all required courses.',
          category: 'Academic',
          priority: 'medium',
          status: 'open',
          student_name: 'Ali Raza',
          student_id: 'FA21-BSE-032',
          user_id: userId
        },
        {
          title: 'Library Book Return Issue',
          description: 'I returned a book last week but it still shows as issued in my account.',
          category: 'Library',
          priority: 'low',
          status: 'resolved',
          student_name: 'Fatima Malik',
          student_id: 'FA21-BSE-048',
          user_id: userId
        },
        {
          title: 'Exam Schedule Clarification',
          description: 'The exam schedule shows conflicting timings for two of my courses. Please clarify.',
          category: 'Academic',
          priority: 'medium',
          status: 'in-progress',
          student_name: 'Usman Ali',
          student_id: 'FA21-BSE-067',
          user_id: userId
        }
      ];

      const { data, error } = await supabase
        .from('help_desk_tickets')
        .insert(tickets)
        .select();

      if (error) {
        console.log('  ⚠️  Error:', error.message);
      } else {
        console.log(`  ✅ Created ${data.length} tickets`);
      }
    } else {
      console.log('  ℹ️  Tickets already exist');
    }
  } catch (error) {
    console.log('  ⚠️  Error:', error.message);
  }
}

async function verifyAll() {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 VERIFICATION');
  console.log('='.repeat(60) + '\n');

  const tables = [
    'guidance_content', 'faq_items', 'community_posts',
    'post_reactions', 'post_comments', 'news_items',
    'events', 'faculty', 'help_desk_tickets',
    'past_papers', 'lost_found_items', 'resources',
    'campuses', 'departments', 'programs'
  ];

  let ok = 0, empty = 0;

  for (const table of tables) {
    try {
      const { count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (count === 0) {
        console.log(`⚠️  ${table}: Empty`);
        empty++;
      } else {
        console.log(`✅ ${table}: ${count} records`);
        ok++;
      }
    } catch (e) {
      console.log(`❌ ${table}: Error`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ ${ok} tables with data | ⚠️  ${empty} empty tables`);
  console.log('='.repeat(60));
}

async function main() {
  console.log('🚀 Seeding with foreign key handling...\n');
  
  const posts = await seedCommunityPosts();
  await seedReactionsAndComments(posts);
  await seedHelpDeskTickets();
  await verifyAll();
  
  console.log('\n✨ Done!\n');
}

main();
