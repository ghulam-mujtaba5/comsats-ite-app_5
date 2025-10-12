const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🌱 Seeding ALL Empty Tables with Test Data (FIXED)...\n');

async function seedCommunityPosts() {
  try {
    console.log('📝 Seeding Community Posts...');
    
    const { data: existingPosts } = await supabase
      .from('community_posts')
      .select('id')
      .limit(1);

    if (!existingPosts || existingPosts.length === 0) {
      // Schema: user_id, title, content, tags, type, likes, comments, shares
      const posts = [
        {
          user_id: '00000000-0000-0000-0000-000000000001',
          title: 'Welcome to COMSATS Community! 🎉',
          content: 'Hey everyone! This is the official COMSATS ITE community platform. Feel free to share your thoughts, ask questions, and connect with fellow students!',
          type: 'general',
          tags: ['welcome', 'community', 'introduction'],
          likes: 15,
          comments: 5,
          shares: 2
        },
        {
          user_id: '00000000-0000-0000-0000-000000000002',
          title: 'Tips for Final Exams Preparation 📚',
          content: 'Final exams are approaching! Here are some tips that helped me:\n\n1. Start early - don\'t wait until the last minute\n2. Make summary notes\n3. Practice past papers\n4. Study in groups\n5. Take regular breaks\n\nGood luck everyone!',
          type: 'question',
          tags: ['exams', 'study-tips', 'finals'],
          likes: 42,
          comments: 12,
          shares: 8
        },
        {
          user_id: '00000000-0000-0000-0000-000000000003',
          title: 'Looking for Study Partner - Data Structures',
          content: 'Is anyone interested in forming a study group for Data Structures? I\'m finding some topics challenging and would love to collaborate with others. We can meet at the library or study online.',
          type: 'question',
          tags: ['data-structures', 'study-group', 'collaboration'],
          likes: 8,
          comments: 6,
          shares: 1
        },
        {
          user_id: '00000000-0000-0000-0000-000000000004',
          title: 'Campus Food Recommendations? 🍕',
          content: 'What are the best places to eat around campus? I\'m new here and looking for good food spots. Any recommendations?',
          type: 'general',
          tags: ['food', 'campus-life', 'recommendations'],
          likes: 23,
          comments: 18,
          shares: 4
        },
        {
          user_id: '00000000-0000-0000-0000-000000000005',
          title: 'Internship Opportunities Discussion',
          content: 'Let\'s share information about internship opportunities! If you know about any companies hiring interns or have tips for the application process, please share here.',
          type: 'general',
          tags: ['internship', 'career', 'opportunities'],
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
        return [];
      } else {
        console.log(`  ✅ Created ${data.length} community posts`);
        return data;
      }
    } else {
      console.log('  ℹ️  Posts already exist, skipping...');
      const { data } = await supabase.from('community_posts').select('id');
      return data || [];
    }
  } catch (error) {
    console.log('  ⚠️  Error seeding posts:', error.message);
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
    // Seed Post Reactions
    console.log('\n❤️  Seeding Post Reactions...');
    
    const { data: existingReactions } = await supabase
      .from('post_reactions')
      .select('id')
      .limit(1);

    if (!existingReactions || existingReactions.length === 0) {
      const reactions = [];
      const reactionTypes = ['like', 'love', 'insightful'];
      
      posts.forEach((post, postIndex) => {
        // Add 2-5 reactions per post
        const reactionCount = 2 + postIndex;
        for (let i = 0; i < Math.min(reactionCount, 5); i++) {
          reactions.push({
            post_id: post.id,
            user_id: `00000000-0000-0000-0000-00000000000${i + 1}`,
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
      console.log('  ℹ️  Reactions already exist, skipping...');
    }

    // Seed Post Comments
    console.log('\n💬 Seeding Post Comments...');
    
    const { data: existingComments } = await supabase
      .from('post_comments')
      .select('id')
      .limit(1);

    if (!existingComments || existingComments.length === 0) {
      const comments = [];
      const commentTexts = [
        'Great post! Thanks for sharing this.',
        'This is really helpful, appreciate it!',
        'I completely agree with this.',
        'Thanks for the information!',
        'Very useful, bookmarked for later.',
        'Can you provide more details about this?',
        'This helped me a lot, thank you!',
        'Interesting perspective!'
      ];

      posts.forEach((post, postIndex) => {
        // Add 1-4 comments per post
        const commentCount = 1 + postIndex;
        for (let i = 0; i < Math.min(commentCount, 4); i++) {
          comments.push({
            post_id: post.id,
            user_id: `00000000-0000-0000-0000-00000000000${(i % 5) + 1}`,
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
      console.log('  ℹ️  Comments already exist, skipping...');
    }
  } catch (error) {
    console.log('  ⚠️  Error:', error.message);
  }
}

async function seedNewsItems() {
  try {
    console.log('\n📰 Seeding News Items...');
    
    const { data: existingNews } = await supabase
      .from('news_items')
      .select('id')
      .limit(1);

    if (!existingNews || existingNews.length === 0) {
      // Schema: title, content, category, is_important, image_url, author_id
      const newsItems = [
        {
          title: 'COMSATS Wins National Hackathon 2025',
          content: 'COMSATS ITE students secured first place in the National Hackathon 2025, competing against 50+ universities. The winning project was an AI-powered healthcare solution that can predict diseases based on symptoms. The team received PKR 500,000 as prize money and mentorship opportunities from leading tech companies.',
          category: 'achievement',
          is_important: true,
          author_id: '00000000-0000-0000-0000-000000000001'
        },
        {
          title: 'New Computer Lab Inaugurated',
          content: 'A state-of-the-art computer lab with 100+ high-performance workstations has been inaugurated at COMSATS ITE campus. The lab features latest hardware including i7 processors, 32GB RAM, and RTX 3060 GPUs. Students can now work on resource-intensive projects including AI/ML and game development.',
          category: 'campus',
          is_important: false,
          author_id: '00000000-0000-0000-0000-000000000001'
        },
        {
          title: 'Industry Expert Seminar on AI and ML',
          content: 'Join us for an exclusive seminar on Artificial Intelligence and Machine Learning by industry experts from leading tech companies including Google, Microsoft, and local startups. The seminar will cover latest trends, career opportunities, and hands-on workshops. Date: October 20, 2025. Registration is free for all students.',
          category: 'academic',
          is_important: true,
          author_id: '00000000-0000-0000-0000-000000000001'
        },
        {
          title: 'COMSATS Students Excel in Programming Contest',
          content: 'Our programming team secured top 3 positions in the Inter-University Programming Contest held last week. Out of 80 participating teams, COMSATS had 3 teams in the top 10. Congratulations to all participants for their outstanding performance! Special mention to Team Alpha for securing 1st position.',
          category: 'achievement',
          is_important: false,
          author_id: '00000000-0000-0000-0000-000000000001'
        }
      ];

      const { data, error } = await supabase
        .from('news_items')
        .insert(newsItems)
        .select();

      if (error) {
        console.log('  ⚠️  Error:', error.message);
      } else {
        console.log(`  ✅ Created ${data.length} news items`);
      }
    } else {
      console.log('  ℹ️  News items already exist, skipping...');
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
      // Schema: title, description, category, priority, status, student_name, student_id, user_id
      const tickets = [
        {
          title: 'Unable to Access Student Portal',
          description: 'I am having trouble logging into the student portal. It shows "Invalid credentials" even though I\'m using the correct password. I have tried resetting my password but still facing the same issue.',
          category: 'Technical',
          priority: 'high',
          status: 'open',
          student_name: 'Ahmad Khan',
          student_id: 'FA21-BSE-001',
          user_id: '00000000-0000-0000-0000-000000000001'
        },
        {
          title: 'Fee Challan Not Generated',
          description: 'My fee challan for this semester is not generating. I need it urgently to pay before the deadline which is in 2 days. Please help me resolve this issue as soon as possible.',
          category: 'Financial',
          priority: 'high',
          status: 'in-progress',
          student_name: 'Sara Ahmed',
          student_id: 'FA21-BSE-015',
          user_id: '00000000-0000-0000-0000-000000000002'
        },
        {
          title: 'Course Registration Issue',
          description: 'I cannot register for "Database Systems" course. It shows "Prerequisites not met" but I have completed all required courses including Data Structures and Discrete Mathematics. My grades are also above the minimum requirement.',
          category: 'Academic',
          priority: 'medium',
          status: 'open',
          student_name: 'Ali Raza',
          student_id: 'FA21-BSE-032',
          user_id: '00000000-0000-0000-0000-000000000003'
        },
        {
          title: 'Library Book Return Issue',
          description: 'I returned a book "Introduction to Algorithms" last week on Monday but it still shows as issued in my account. This is affecting my ability to issue new books. Please update the records.',
          category: 'Library',
          priority: 'low',
          status: 'resolved',
          student_name: 'Fatima Malik',
          student_id: 'FA21-BSE-048',
          user_id: '00000000-0000-0000-0000-000000000004'
        },
        {
          title: 'Exam Schedule Clarification Needed',
          description: 'The exam schedule shows conflicting timings for two of my courses - Software Engineering and Computer Networks. Both are scheduled on the same day and time. Please clarify the correct schedule.',
          category: 'Academic',
          priority: 'medium',
          status: 'in-progress',
          student_name: 'Usman Ali',
          student_id: 'FA21-BSE-067',
          user_id: '00000000-0000-0000-0000-000000000005'
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
    'news_items',
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
  const results = [];

  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`❌ Table '${table}': Error - ${error.message}`);
        results.push({ table, status: 'error', count: 0 });
      } else if (count === 0) {
        console.log(`⚠️  Table '${table}': Empty (${count} records)`);
        emptyCount++;
        results.push({ table, status: 'empty', count: 0 });
      } else {
        console.log(`✅ Table '${table}': OK (${count} records)`);
        workingCount++;
        results.push({ table, status: 'ok', count });
      }
    } catch (error) {
      console.log(`❌ Table '${table}': ${error.message}`);
      results.push({ table, status: 'error', count: 0 });
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log(`✅ Working tables: ${workingCount}`);
  console.log(`⚠️  Empty tables: ${emptyCount}`);
  console.log('='.repeat(70) + '\n');

  return results;
}

async function main() {
  console.log('🚀 Starting comprehensive data seeding with FIXED schemas...\n');
  
  // Seed all tables in order
  const posts = await seedCommunityPosts();
  await seedReactionsAndComments(posts);
  await seedNewsItems();
  await seedHelpDeskTickets();
  
  // Verify everything
  const results = await verifyAllTables();
  
  console.log('✨ Seeding completed!\n');
  
  const emptyTables = results.filter(r => r.status === 'empty');
  if (emptyTables.length === 0) {
    console.log('🎉 SUCCESS! All tables now have data!');
  } else {
    console.log('⚠️  Some tables are still empty:');
    emptyTables.forEach(t => console.log(`   - ${t.table}`));
  }
  
  console.log('\n📋 Next steps:');
  console.log('   1. Visit http://localhost:3001/community (should show 5 posts)');
  console.log('   2. Visit http://localhost:3001/news (should show 4 articles)');
  console.log('   3. Visit http://localhost:3001/help-desk (should show 5 tickets)');
  console.log('   4. Test all features are working!\n');
}

main();
