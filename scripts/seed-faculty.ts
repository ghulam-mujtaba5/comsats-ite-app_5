import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Sample faculty data
const sampleFaculty = [
  {
    id: '61ddfa5c-0854-4450-a69f-2ecc1dd9d825',
    name: 'Dr. Ahmed Khan',
    title: 'Professor',
    department: 'Computer Science',
    email: 'ahmed.khan@cuilahore.edu.pk',
    office: 'CS-201',
    phone: '+92-42-111-001-007',
    specialization: ['Software Engineering', 'Database Systems', 'Web Development'],
    courses: ['CS-101 Programming Fundamentals', 'CS-301 Database Systems', 'CS-401 Software Engineering'],
    education: ['PhD Computer Science - University of Punjab', 'MS Computer Science - LUMS'],
    experience: '15 years',
    profile_image: null,
    rating_avg: 4.2,
    rating_count: 45
  },
  {
    id: '72ddfa5c-0854-4450-a69f-2ecc1dd9d826',
    name: 'Dr. Sarah Ali',
    title: 'Associate Professor',
    department: 'Computer Science',
    email: 'sarah.ali@cuilahore.edu.pk',
    office: 'CS-105',
    specialization: ['Data Structures', 'Algorithms', 'Machine Learning'],
    courses: ['CS-201 Data Structures', 'CS-301 Algorithms', 'CS-501 Machine Learning'],
    education: ['PhD Computer Science - MIT', 'MS Computer Science - Stanford'],
    experience: '12 years',
    profile_image: null,
    rating_avg: 4.6,
    rating_count: 38
  },
  {
    id: '83ddfa5c-0854-4450-a69f-2ecc1dd9d827',
    name: 'Dr. Muhammad Hassan',
    title: 'Assistant Professor',
    department: 'Computer Science',
    email: 'm.hassan@cuilahore.edu.pk',
    office: 'CS-110',
    specialization: ['Computer Networks', 'Cybersecurity', 'Distributed Systems'],
    courses: ['CS-401 Computer Networks', 'CS-501 Network Security', 'CS-601 Distributed Systems'],
    education: ['PhD Computer Science - NUST', 'MS Computer Science - FAST'],
    experience: '8 years',
    profile_image: null,
    rating_avg: 3.9,
    rating_count: 29
  },
  {
    id: '94ddfa5c-0854-4450-a69f-2ecc1dd9d828',
    name: 'Dr. Fatima Sheikh',
    title: 'Professor',
    department: 'Electrical Engineering',
    email: 'fatima.sheikh@cuilahore.edu.pk',
    office: 'EE-201',
    specialization: ['Circuit Analysis', 'Power Systems', 'Control Systems'],
    courses: ['EE-101 Circuit Analysis', 'EE-301 Power Systems', 'EE-401 Control Systems'],
    education: ['PhD Electrical Engineering - UET', 'MS Electrical Engineering - NUST'],
    experience: '18 years',
    profile_image: null,
    rating_avg: 4.4,
    rating_count: 52
  },
  {
    id: 'a5ddfa5c-0854-4450-a69f-2ecc1dd9d829',
    name: 'Prof. Aisha Malik',
    title: 'Professor',
    department: 'Business Administration',
    email: 'aisha.malik@cuilahore.edu.pk',
    office: 'BBA-301',
    specialization: ['Financial Management', 'Strategic Management', 'Entrepreneurship'],
    courses: ['ACC-101 Financial Accounting', 'MGT-301 Strategic Management', 'ENT-401 Entrepreneurship'],
    education: ['PhD Business Administration - IBA', 'MBA Finance - LUMS'],
    experience: '20 years',
    profile_image: null,
    rating_avg: 4.1,
    rating_count: 67
  }
]

async function seedFaculty() {
  console.log('Seeding faculty data...')
  
  try {
    // Insert sample faculty data
    const { data, error } = await supabase
      .from('faculty')
      .upsert(sampleFaculty, { onConflict: 'id' })
      
    if (error) {
      console.error('Error seeding faculty:', error)
      process.exit(1)
    }
    
    console.log(`Successfully seeded ${sampleFaculty.length} faculty members`)
    console.log('Faculty data seeded successfully!')
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

// Run the seed function
seedFaculty()