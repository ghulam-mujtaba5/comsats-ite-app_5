// Simple test script to verify past papers API functionality
const API_BASE = 'http://localhost:3000'

async function testPastPapersAPI() {
  console.log('🧪 Testing Past Papers API...\n')
  
  try {
    // Test 1: Fetch all past papers
    console.log('📋 Test 1: Fetching all past papers...')
    const response = await fetch(`${API_BASE}/api/past-papers`)
    const data = await response.json()
    
    console.log(`Status: ${response.status}`)
    console.log(`Papers found: ${data.data ? data.data.length : 0}`)
    
    if (data.data && data.data.length > 0) {
      console.log('Sample paper data:', JSON.stringify(data.data[0], null, 2))
    }
    
    // Test 2: Check if specific course exists
    if (data.data && data.data.length > 0) {
      const firstPaper = data.data[0]
      const courseCode = firstPaper.course_code
      
      console.log(`\n📋 Test 2: Fetching course ${courseCode}...`)
      const courseResponse = await fetch(`${API_BASE}/api/past-papers/${courseCode}`)
      const courseData = await courseResponse.json()
      
      console.log(`Course Status: ${courseResponse.status}`)
      console.log('Course data:', JSON.stringify(courseData, null, 2))
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Only run if this file is executed directly (not imported)
if (typeof window === 'undefined' && require.main === module) {
  testPastPapersAPI()
}

module.exports = { testPastPapersAPI }