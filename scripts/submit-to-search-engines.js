#!/usr/bin/env node

/**
 * Search Engine Submission & Indexing Automation Script
 * Submits sitemaps to Google, Bing, Yahoo, and other search engines
 */

const https = require('https')
const fs = require('fs')
const path = require('path')

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// ==================== GOOGLE SEARCH CONSOLE ====================
async function submitToGoogle() {
  log('\n📊 Submitting to Google Search Console...', 'blue')
  
  // Google requires API authentication, so we'll provide instructions
  log('⚠️  Google requires API authentication:', 'yellow')
  log('1. Go to https://search.google.com/search-console', 'cyan')
  log('2. Add your property if not already added', 'cyan')
  log('3. Go to Sitemaps section', 'cyan')
  log(`4. Submit: ${SITEMAP_URL}`, 'cyan')
  log('5. For programmatic access, set up Google Search Console API', 'cyan')
  
  // Alternative: Use IndexNow API (supported by Google)
  log('\n🔄 Attempting IndexNow submission (supports Google, Bing)...', 'blue')
  return submitToIndexNow()
}

// ==================== BING WEBMASTER TOOLS ====================
async function submitToBing() {
  log('\n🔷 Submitting to Bing Webmaster Tools...', 'blue')
  
  log('Manual submission required:', 'yellow')
  log('1. Go to https://www.bing.com/webmasters', 'cyan')
  log('2. Add your site if not already added', 'cyan')
  log('3. Go to Sitemaps section', 'cyan')
  log(`4. Submit: ${SITEMAP_URL}`, 'cyan')
  log('5. Set up Bing Webmaster API for automated submissions', 'cyan')
  
  return { success: true, method: 'manual' }
}

// ==================== INDEXNOW API ====================
async function submitToIndexNow() {
  return new Promise((resolve) => {
    // IndexNow requires an API key file
    log('📝 IndexNow API submission...', 'blue')
    
    // Generate a random API key if not exists
    const apiKeyFile = path.join(process.cwd(), 'public', 'indexnow-key.txt')
    let apiKey = ''
    
    try {
      if (fs.existsSync(apiKeyFile)) {
        apiKey = fs.readFileSync(apiKeyFile, 'utf-8').trim()
      } else {
        // Generate random API key
        apiKey = Array.from({ length: 32 }, () => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('')
        
        fs.writeFileSync(apiKeyFile, apiKey)
        log(`✅ Generated IndexNow API key: ${apiKey}`, 'green')
        log(`📁 Saved to: ${apiKeyFile}`, 'cyan')
      }
    } catch (err) {
      log(`❌ Error with API key: ${err.message}`, 'red')
      return resolve({ success: false, error: err.message })
    }
    
    // Submit to IndexNow (works for Google, Bing, Yandex)
    const indexNowUrl = 'api.indexnow.org'
    const postData = JSON.stringify({
      host: new URL(SITE_URL).hostname,
      key: apiKey,
      keyLocation: `${SITE_URL}/indexnow-key.txt`,
      urlList: [
        SITE_URL,
        `${SITE_URL}/gpa-calculator`,
        `${SITE_URL}/past-papers`,
        `${SITE_URL}/faculty`,
        `${SITE_URL}/timetable`,
        `${SITE_URL}/community`,
        `${SITE_URL}/admissions`,
        `${SITE_URL}/blog`
      ]
    })
    
    const options = {
      hostname: indexNowUrl,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }
    
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 202) {
          log('✅ Successfully submitted to IndexNow', 'green')
          log('   (Notified: Google, Bing, Yandex, Seznam.cz)', 'cyan')
          resolve({ success: true, data })
        } else {
          log(`⚠️  IndexNow returned status ${res.statusCode}`, 'yellow')
          resolve({ success: false, statusCode: res.statusCode })
        }
      })
    })
    
    req.on('error', (err) => {
      log(`❌ IndexNow error: ${err.message}`, 'red')
      resolve({ success: false, error: err.message })
    })
    
    req.write(postData)
    req.end()
  })
}

// ==================== SITEMAP PING ====================
async function pingSitemapToSearchEngines() {
  log('\n🌐 Pinging sitemap to search engines...', 'blue')
  
  const searchEngines = [
    {
      name: 'Google',
      url: `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
    },
    {
      name: 'Bing',
      url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
    }
  ]
  
  const results = []
  
  for (const engine of searchEngines) {
    try {
      await new Promise((resolve) => {
        https.get(engine.url, (res) => {
          if (res.statusCode === 200) {
            log(`✅ ${engine.name}: Sitemap pinged successfully`, 'green')
            results.push({ engine: engine.name, success: true })
          } else {
            log(`⚠️  ${engine.name}: Returned status ${res.statusCode}`, 'yellow')
            results.push({ engine: engine.name, success: false, status: res.statusCode })
          }
          resolve()
        }).on('error', (err) => {
          log(`❌ ${engine.name}: ${err.message}`, 'red')
          results.push({ engine: engine.name, success: false, error: err.message })
          resolve()
        })
      })
    } catch (err) {
      log(`❌ ${engine.name} error: ${err.message}`, 'red')
    }
  }
  
  return results
}

// ==================== SUBMIT SPECIFIC URLS ====================
async function submitSpecificUrls(urls) {
  log('\n🔗 Submitting specific URLs for indexing...', 'blue')
  
  const keyUrls = urls || [
    `${SITE_URL}/`,
    `${SITE_URL}/gpa-calculator`,
    `${SITE_URL}/past-papers`,
    `${SITE_URL}/faculty`,
    `${SITE_URL}/timetable`,
    `${SITE_URL}/admissions`,
    `${SITE_URL}/community`,
    `${SITE_URL}/blog`,
    `${SITE_URL}/news`,
    `${SITE_URL}/resources`
  ]
  
  log(`📌 Priority URLs (${keyUrls.length}):`, 'cyan')
  keyUrls.forEach(url => log(`   - ${url}`, 'cyan'))
  
  // Use IndexNow for these URLs
  return submitToIndexNow()
}

// ==================== GENERATE SUBMISSION REPORT ====================
function generateReport(results) {
  log('\n' + '='.repeat(60), 'blue')
  log('📋 SEARCH ENGINE SUBMISSION REPORT', 'blue')
  log('='.repeat(60), 'blue')
  
  log(`\n🌐 Site: ${SITE_URL}`, 'cyan')
  log(`📄 Sitemap: ${SITEMAP_URL}`, 'cyan')
  log(`📅 Submission Date: ${new Date().toISOString()}`, 'cyan')
  
  log('\n✅ Completed Actions:', 'green')
  results.forEach(result => {
    if (result.success) {
      log(`   ✓ ${result.action}`, 'green')
    }
  })
  
  log('\n⚠️  Manual Actions Required:', 'yellow')
  log('   1. Google Search Console: Add and verify property', 'yellow')
  log('   2. Bing Webmaster Tools: Add and verify property', 'yellow')
  log('   3. Set up Google Analytics for tracking', 'yellow')
  log('   4. Set up Google Tag Manager (optional)', 'yellow')
  
  log('\n📊 Next Steps:', 'blue')
  log('   1. Monitor indexing in Search Console (24-48 hours)', 'cyan')
  log('   2. Check coverage reports for errors', 'cyan')
  log('   3. Submit additional important URLs manually', 'cyan')
  log('   4. Set up regular sitemap updates (weekly)', 'cyan')
  
  log('\n' + '='.repeat(60), 'blue')
}

// ==================== MAIN EXECUTION ====================
async function main() {
  log('\n🚀 CampusAxis - Search Engine Submission Tool', 'blue')
  log('='.repeat(60), 'blue')
  
  const results = []
  
  try {
    // 1. Ping sitemaps
    const pingResults = await pingSitemapToSearchEngines()
    if (pingResults.some(r => r.success)) {
      results.push({ action: 'Sitemap pinged to search engines', success: true })
    }
    
    // 2. IndexNow submission
    const indexNowResult = await submitToIndexNow()
    if (indexNowResult.success) {
      results.push({ action: 'IndexNow API submission', success: true })
    }
    
    // 3. Submit key URLs
    const urlResult = await submitSpecificUrls()
    if (urlResult.success) {
      results.push({ action: 'Key URLs submitted via IndexNow', success: true })
    }
    
    // 4. Google instructions
    await submitToGoogle()
    
    // 5. Bing instructions
    await submitToBing()
    
    // Generate final report
    generateReport(results)
    
    log('\n✅ Submission process completed!', 'green')
    log('⏰ Allow 24-48 hours for indexing to begin', 'cyan')
    
  } catch (err) {
    log(`\n❌ Error during submission: ${err.message}`, 'red')
    process.exit(1)
  }
}

// Run if executed directly
if (require.main === module) {
  main()
}

module.exports = { main, submitToIndexNow, pingSitemapToSearchEngines }
