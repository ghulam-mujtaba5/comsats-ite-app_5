import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function seedDatabase() {
  console.log('Starting complete database seeding...')

  try {
    // Create admin user
    const { data: adminAuth, error: adminAuthError } = await supabase.auth.admin.createUser({
      email: 'admin@cuilahore.edu.pk',
      password: 'admin123456',
      email_confirm: true
    })

    if (adminAuthError && !adminAuthError.message.includes('already registered')) {
      throw adminAuthError
    }

    const adminUserId = adminAuth?.user?.id || (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === 'admin@cuilahore.edu.pk')?.id

    if (adminUserId) {
      await supabase.from('admin_users').upsert({
        user_id: adminUserId,
        role: 'super_admin',
        permissions: ['manage_all']
      })
      console.log('Admin user created successfully')
    }

    // Create test users
    const testUsers = [
      { email: 'ahmad.ali@student.comsats.edu.pk', password: 'student123' },
      { email: 'fatima.khan@student.comsats.edu.pk', password: 'student123' }
    ]

    const userIds = []
    for (const user of testUsers) {
      const { data: authUser, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true
      })

      if (error && !error.message.includes('already registered')) {
        console.error(`Error creating user ${user.email}:`, error)
      } else {
        const userId = authUser?.user?.id || (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === user.email)?.id
        if (userId) userIds.push(userId)
      }
    }

    console.log(`Created ${userIds.length} test users`)

    // Seed Lost & Found Items
    const lostFoundItems = [
      {
        title: "Black iPhone 14",
        description: "Lost my black iPhone 14 near the library. Has a clear case with a blue sticker.",
        category: "lost",
        item_type: "Electronics",
        location: "Main Library",
        contact_info: "ahmad.ali@student.comsats.edu.pk",
        user_id: userIds[0] || null
      },
      {
        title: "Red Water Bottle",
        description: "Found a red water bottle in the CS department. Has 'Sarah' written on it.",
        category: "found",
        item_type: "Personal Items",
        location: "CS Department",
        contact_info: "fatima.khan@student.comsats.edu.pk",
        user_id: userIds[1] || null
      }
    ]

    const { error: lostFoundError } = await supabase
      .from('lost_found_items')
      .upsert(lostFoundItems)

    if (lostFoundError) throw lostFoundError
    console.log('Lost & Found items seeded successfully')


    // Seed News Items (legacy table used elsewhere)
    const newsItems = [
      {
        title: "Spring 2024 Semester Registration Opens",
        content: "Registration for Spring 2024 semester will begin on January 25th.",
        category: "academic",
        is_important: true,
        author_id: adminUserId
      }
    ]

    const { error: newsError } = await supabase
      .from('news_items')
      .upsert(newsItems)

    if (newsError) throw newsError
    console.log('News items (legacy) seeded successfully')

    // Seed homepage News (correct table expected by /api/news)
    const homepageNews = [
      {
        title: 'Welcome to CampusAxis',
        content: 'We are rolling out new features across the portal.',
        image_url: null,
        status: 'published' as const,
        published_at: new Date().toISOString(),
      },
      {
        title: 'Orientation Schedule',
        content: 'Don\'t miss the orientation sessions this week.',
        image_url: null,
        status: 'published' as const,
        published_at: new Date().toISOString(),
      },
    ]

    const { error: homepageNewsError } = await supabase
      .from('news')
      .upsert(homepageNews)

    if (homepageNewsError) throw homepageNewsError
    console.log('Homepage news seeded successfully')

    // Seed Events
    const events = [
      {
        title: "AI Workshop",
        description: "Learn AI fundamentals with hands-on projects.",
        event_date: "2024-02-15",
        event_time: "10:00:00",
        location: "CS Auditorium",
        category: "workshop",
        organizer: "CS Department",
        capacity: 100,
        registration_open: true,
        created_by: adminUserId
      }
    ]

    const { error: eventsError } = await supabase
      .from('events')
      .upsert(events)

    if (eventsError) throw eventsError
    console.log('Events seeded successfully')

    // Seed Support Resources
    const supportResources = [
      {
        title: "Counseling Services",
        description: "Professional counseling for mental health and personal issues.",
        category: "mental-health",
        contact_info: "counseling@cuilahore.edu.pk | Ext: 2345",
        availability: "Mon-Fri 9:00 AM - 5:00 PM",
        is_emergency: false,
        created_by: adminUserId
      }
    ]

    const { error: supportError } = await supabase
      .from('support_resources')
      .upsert(supportResources)

    if (supportError) throw supportError
    console.log('Support resources seeded successfully')

    // Seed Guidance Content
    const guidanceContent = [
      {
        title: "Course Registration Process",
        description: "Step-by-step guide for registering courses each semester",
        content: "1. Check academic standing\n2. Meet with advisor\n3. Register courses\n4. Pay fees",
        category: "academic",
        is_important: true,
        created_by: adminUserId
      }
    ]

    const { error: guidanceError } = await supabase
      .from('guidance_content')
      .upsert(guidanceContent)

    if (guidanceError) throw guidanceError
    console.log('Guidance content seeded successfully')

    // Seed FAQ Items (legacy table used elsewhere)
    const faqItems = [
      {
        question: "How do I apply for admission?",
        answer: "Visit the admissions office or apply online through our portal.",
        category: "admission",
        tags: ["application", "requirements"],
        created_by: adminUserId
      }
    ]

    const { error: faqError } = await supabase
      .from('faq_items')
      .upsert(faqItems)

    if (faqError) throw faqError
    console.log('FAQ items (legacy) seeded successfully')

    // Seed homepage FAQs (correct table expected by /api/faqs)
    const homepageFaqs = [
      { question: 'What is CampusAxis?', answer: 'A student portal for COMSATS.', sort_order: 1 },
      { question: 'How to sign in?', answer: 'Use your university email.', sort_order: 2 },
      { question: 'Who can post news?', answer: 'Admins can post and publish news.', sort_order: 3 },
    ]

    const { error: homepageFaqsError } = await supabase
      .from('faqs')
      .upsert(homepageFaqs)

    if (homepageFaqsError) throw homepageFaqsError
    console.log('Homepage FAQs seeded successfully')

    // Seed Community Cards (correct table expected by /api/community-cards)
    const communityCards = [
      {
        title: 'Join our Discord',
        subtitle: 'Chat with peers',
        description: 'Connect with fellow students in real-time.',
        link_url: 'https://discord.gg/example',
        sort_order: 1,
        status: 'published' as const,
      },
      {
        title: 'Share your notes',
        subtitle: 'Help the community',
        description: 'Upload summaries and study guides to support others.',
        link_url: '/community',
        sort_order: 2,
        status: 'published' as const,
      },
    ]

    const { error: communityCardsError } = await supabase
      .from('community_cards')
      .upsert(communityCards)

    if (communityCardsError) throw communityCardsError
    console.log('Community cards seeded successfully')

    console.log('✅ Complete database seeding finished successfully!')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    process.exit(1)
  }
}

seedDatabase()
