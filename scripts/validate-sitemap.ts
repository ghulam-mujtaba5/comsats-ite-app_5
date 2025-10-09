import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Simple script to validate sitemap entries
async function validateSitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'
  
  // Test a few key URLs to ensure they're valid
  const testUrls = [
    '/',
    '/gpa-calculator',
    '/gpa-calculator/semester',
    '/gpa-calculator/cumulative',
    '/gpa-calculator/aggregate',
    '/gpa-calculator/planning',
    '/blog',
    '/blog/comsats-grading-system',
    '/blog/comsats-gpa-calculator-guide',
    '/past-papers',
    '/faculty',
    '/news',
    '/community'
  ]

  console.log('Validating sitemap URLs...')
  
  let validCount = 0
  let invalidCount = 0
  
  for (const path of testUrls) {
    try {
      const url = `${siteUrl}${path}`
      new URL(url) // This will throw if URL is invalid
      console.log(`✓ Valid URL: ${url}`)
      validCount++
    } catch (error) {
      console.log(`✗ Invalid URL format: ${siteUrl}${path}`)
      invalidCount++
    }
  }
  
  console.log(`\nValidation complete: ${validCount} valid, ${invalidCount} invalid`)
  
  if (invalidCount > 0) {
    console.log('Sitemap validation failed!')
    process.exit(1)
  }
  
  console.log('All URLs are valid!')
  process.exit(0)
}

validateSitemap().catch(error => {
  console.error('Validation failed with error:', error)
  process.exit(1)
})