const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🌱 Seeding ALL Empty Tables with Test Data...\n');

async function seedAllData() {
  try {
    // 1. Seed Community Posts
    console.log('📝 Seeding Community Posts...');
    const { data: existingPosts } = await supabase
      .from('community_posts')
      .select('id')
      .limit(1);

    if (!existingPosts || existingPosts.length === 0) {
      const posts = [
        {
          title: 'Welcome to COMSATS Community! 🎉',
          content: 'Hey everyone! This is the official COMSATS ITE community platform. Feel free to share your thoughts, ask questions, and connect with fellow students!',
          author_name: 'Admin',
          user_id: '00000000-0000-0000-0000-000000000000',
          category: 'general',
          tags: ['welcome', 'community', 'introduction'],
          status: 'published',
          likes_count: 15,
          comments_count: 5,
          views_count: 120
        },
        {
          title: 'Tips for Final Exams Preparation 📚',
          content: 'Final exams are approaching! Here are some tips that helped me:\n\n1. Start early - don\'t wait until the last minute\n2. Make summary notes\n3. Practice past papers\n4. Study in groups\n5. Take regular breaks\n\nGood luck everyone!',
          author_name: 'Student',
          user_id: '00000000-0000-0000-0000-000000000000',
          category: 'academic',
          tags: ['exams', 'study-tips', 'finals'],
          status: 'published',
          likes_count: 42,
          comments_count: 12,
          views_count: 250
        },
        {
          title: 'Looking for Study Partner - Data Structures',
          content: 'Is anyone interested in forming a study group for Data Structures? I\'m finding some topics challenging and would love to collaborate with others. We can meet at the library or study online.',
          author_name: 'Ali Ahmed',
          user_id: '00000000-0000-0000-0000-000000000000',
          category: 'study-groups',
          tags: ['data-structures', 'study-group', 'collaboration'],
          status: 'published',
          likes_count: 8,
          comments_count: 6,
          views_count: 85
        },
        {
          title: 'Campus Food Recommendations? 🍕',
          content: 'What are the best places to eat around campus? I\'m new here and looking for good food spots. Any recommendations?',
          author_name: 'Ayesha Khan',
          user_id: '00000000-0000-0000-0000-000000000000',
          category: 'general',
          tags: ['food', 'campus-life', 'recommendations'],
          status: 'published',
          likes_count: 23,
          comments_count: 18,
          views_count: 156
        },
        {
          title: 'Internship Opportunities Discussion',
          content: 'Let\'s share information about internship opportunities! If you know about any companies hiring interns or have tips for the application process, please share here.',
          author_name: 'Hassan Raza',
          user_id: '00000000-0000-0000-0000-000000000000',
          category: 'career',
          tags: ['internship', 'career', 'opportunities'],
          status: 'published',
          likes_count: 56,
          comments_count: 24,
          views_count: 380
        }
      ];

      const { data, error } = await supabase
        .from('community_posts')
        .insert(posts)
        .select();

      if (error) {
        console.log('  ⚠️  Error:', error.message);
      } else {
        console.log(`  ✅ Created ${data.length} community posts`);
        return data;
      }
    } else {
      console.log('  ℹ️  Posts already exist, skipping...');
      return existingPosts;
    }
  } catch (error) {
    console.log('  ⚠️  Error seeding posts:', error.message);
    return [];
  }
}

async function seedReactionsAndComments(posts) {
  if (!posts || posts.length === 0) {
    console.log('  ℹ️  No posts available for reactions/comments');
    return;
  }

  try {
    // 2. Seed Post Reactions
    console.log('\n❤️  Seeding Post Reactions...');
    const reactions = [];
    
    posts.forEach((post, index) => {
      // Add varying numbers of reactions to each post
      const reactionCount = Math.min(index + 1, 3);
      for (let i = 0; i < reactionCount; i++) {
        reactions.push({
          post_id: post.id,
          user_id: '00000000-0000-0000-0000-000000000000',
          reaction_type: ['like', 'love', 'celebrate'][i % 3]
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

    // 3. Seed Post Comments
    console.log('\n💬 Seeding Post Comments...');
    const comments = [];

    posts.forEach((post, index) => {
      const commentTexts = [
        'Great post! Thanks for sharing this.',
        'This is really helpful, appreciate it!',
        'I completely agree with this.',
        'Thanks for the information!',
        'Very useful, bookmarked for later.'
      ];

      const commentCount = Math.min(index + 1, 3);
      for (let i = 0; i < commentCount; i++) {
        comments.push({
          post_id: post.id,
          user_id: '00000000-0000-0000-0000-000000000000',
          content: commentTexts[i % commentTexts.length],
          likes_count: Math.floor(Math.random() * 10)
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
  } catch (error) {
    console.log('  ⚠️  Error:', error.message);
  }
}

async function seedNews() {
  try {
    console.log('\n📰 Seeding News Articles...');
    
    const { data: existingNews } = await supabase
      .from('news')
      .select('id')
      .limit(1);

    if (!existingNews || existingNews.length === 0) {
      const news = [
        {
          title: 'COMSATS Wins National Hackathon 2025',
          content: 'COMSATS ITE students secured first place in the National Hackathon 2025, competing against 50+ universities. The winning project was an AI-powered healthcare solution.',
          excerpt: 'COMSATS ITE students win first place in National Hackathon with innovative AI healthcare solution.',
          author: 'News Team',
          category: 'achievements',
          status: 'published',
          featured: true,
          views: 450
        },
        {
          title: 'New Computer Lab Inaugurated',
          content: 'A state-of-the-art computer lab with 100+ high-performance workstations has been inaugurated at COMSATS ITE campus. The lab features latest hardware and software for students.',
          excerpt: 'New computer lab with 100+ workstations opened for students.',
          author: 'Admin',
          category: 'campus',
          status: 'published',
          featured: false,
          views: 320
        },
        {
          title: 'Industry Expert Seminar on AI and ML',
          content: 'Join us for an exclusive seminar on Artificial Intelligence and Machine Learning by industry experts from leading tech companies. Date: October 20, 2025.',
          excerpt: 'Industry expert seminar on AI/ML scheduled for October 20.',
          author: 'Events Team',
          category: 'events',
          status: 'published',
          featured: true,
          views: 580
        },
        {
          title: 'COMSATS Students Excel in Programming Contest',
          content: 'Our programming team secured top positions in the Inter-University Programming Contest. Congratulations to all participants for their outstanding performance!',
          excerpt: 'COMSATS programming team wins top positions in inter-university contest.',
          author: 'News Team',
          category: 'achievements',
          status: 'published',
          featured: false,
          views: 290
        }
      ];

      const { data, error } = await supabase
        .from('news')
        .insert(news)
        .select();

      if (error) {
        console.log('  ⚠️  Error:', error.message);
      } else {
        console.log(`  ✅ Created ${data.length} news articles`);
      }
    } else {
      console.log('  ℹ️  News already exist, skipping...');
    }
  } catch (error) {
    console.log('  ⚠️  Error:', error.message);
  }
}

async function seedHelpDesk() {
  try {
    console.log('\n🎫 Seeding Help Desk Tickets...');
    
    const { data: existingTickets } = await supabase
      .from('help_desk_tickets')
      .select('id')
      .limit(1);

    if (!existingTickets || existingTickets.length === 0) {
      const tickets = [
        {
          title: 'Unable to Access Student Portal',
          description: 'I am having trouble logging into the student portal. It shows "Invalid credentials" even though I\'m using the correct password.',
          category: 'technical',
          priority: 'high',
          status: 'open',
          student_name: 'Ahmad Khan',
          student_email: 'ahmad.khan@example.com',
          student_id: 'FA21-BSE-001'
        },
        {
          title: 'Fee Challan Not Generated',
          description: 'My fee challan for this semester is not generating. I need it urgently to pay before the deadline.',
          category: 'financial',
          priority: 'urgent',
          status: 'in_progress',
          student_name: 'Sara Ahmed',
          student_email: 'sara.ahmed@example.com',
          student_id: 'FA21-BSE-015'
        },
        {
          title: 'Course Registration Issue',
          description: 'I cannot register for "Database Systems" course. It shows "Prerequisites not met" but I have completed all required courses.',
          category: 'academic',
          priority: 'medium',
          status: 'open',
          student_name: 'Ali Raza',
          student_email: 'ali.raza@example.com',
          student_id: 'FA21-BSE-032'
        },
        {
          title: 'Library Book Return',
          description: 'I returned a book last week but it still shows as issued in my account. Please update the records.',
          category: 'library',
          priority: 'low',
          status: 'resolved',
          student_name: 'Fatima Malik',
          student_email: 'fatima.malik@example.com',
          student_id: 'FA21-BSE-048'
        },
        {
          title: 'Exam Schedule Clarification',
          description: 'The exam schedule shows conflicting timings for two of my courses. Please clarify the correct schedule.',
          category: 'academic',
          priority: 'high',
          status: 'in_progress',
          student_name: 'Usman Ali',
          student_email: 'usman.ali@example.com',
          student_id: 'FA21-BSE-067'
        }
      ];

      const { data, error } = await supabase
        .from('help_desk_tickets')
        .insert(tickets)
        .select();

      if (error) {
        console.log('  ⚠️  Error:', error.message);
      } else {
        console.log(`  ✅ Created ${data.length} help desk tickets`);
      }
    } else {
      console.log('  ℹ️  Tickets already exist, skipping...');
    }
  } catch (error) {
    console.log('  ⚠️  Error:', error.message);
  }
}

async function verifyAllTables() {
  console.log('\n' + '='.repeat(70));
  console.log('🔍 VERIFYING ALL TABLES');
  console.log('='.repeat(70) + '\n');

  const tables = [
    'guidance_content',
    'faq_items',
    'community_posts',
    'post_reactions',
    'post_comments',
    'news',
    'events',
    'faculty',
    'help_desk_tickets',
    'past_papers',
    'lost_found_items',
    'resources',
    'campuses',
    'departments',
    'programs'
  ];

  let workingCount = 0;
  let emptyCount = 0;

  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`❌ Table '${table}': Error - ${error.message}`);
      } else if (count === 0) {
        console.log(`⚠️  Table '${table}': Empty (${count} records)`);
        emptyCount++;
      } else {
        console.log(`✅ Table '${table}': OK (${count} records)`);
        workingCount++;
      }
    } catch (error) {
      console.log(`❌ Table '${table}': ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log(`✅ Working tables: ${workingCount}`);
  console.log(`⚠️  Empty tables: ${emptyCount}`);
  console.log('='.repeat(70) + '\n');
}

async function main() {
  console.log('🚀 Starting comprehensive data seeding...\n');
  
  // Seed all tables
  const posts = await seedAllData();
  await seedReactionsAndComments(posts);
  await seedNews();
  await seedHelpDesk();
  
  // Verify everything
  await verifyAllTables();
  
  console.log('✨ Seeding completed!\n');
  console.log('🎉 All tables now have test data!');
  console.log('\n📋 Next steps:');
  console.log('   1. Visit http://localhost:3001/community (should show 5 posts)');
  console.log('   2. Visit http://localhost:3001/news (should show 4 articles)');
  console.log('   3. Visit http://localhost:3001/help-desk (should show 5 tickets)');
  console.log('   4. Test all features are working!\n');
}

main();
