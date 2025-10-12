const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addReactions() {
  console.log('❤️  Adding Post Reactions...\n');

  // Get all posts
  const { data: posts } = await supabase
    .from('community_posts')
    .select('id')
    .limit(5);

  if (!posts || posts.length === 0) {
    console.log('No posts found!');
    return;
  }

  // Get real user
  const { data: users } = await supabase.auth.admin.listUsers();
  const userId = users.users[0].id;

  const reactions = [];
  const types = ['like', 'love', 'celebrate', 'insightful', 'support'];

  // Add unique reactions - each post gets different reaction types
  posts.forEach((post, index) => {
    // Add 1-3 different reaction types per post
    const numReactions = (index % 3) + 1;
    for (let i = 0; i < numReactions; i++) {
      reactions.push({
        post_id: post.id,
        user_id: userId,
        reaction_type: types[(index + i) % types.length]
      });
    }
  });

  console.log(`Creating ${reactions.length} unique reactions...`);

  for (const reaction of reactions) {
    const { error } = await supabase
      .from('post_reactions')
      .insert(reaction);

    if (error) {
      console.log(`  ⚠️  Skipped: ${reaction.reaction_type} (${error.message.substring(0, 50)})`);
    } else {
      console.log(`  ✅ Added: ${reaction.reaction_type}`);
    }
  }

  // Verify
  const { count } = await supabase
    .from('post_reactions')
    .select('*', { count: 'exact', head: true });

  console.log(`\n✨ Total reactions in DB: ${count}`);
}

addReactions();
