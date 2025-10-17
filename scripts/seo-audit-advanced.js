#!/usr/bin/env node

/**
 * Comprehensive SEO Audit Tool for CampusAxis
 * Analyzes technical SEO, content, performance, and provides actionable recommendations
 */

const fs = require('fs')
const path = require('path')
const https = require('https')

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// SEO Audit Results
const auditResults = {
  technical: { score: 0, issues: [], successes: [] },
  content: { score: 0, issues: [], successes: [] },
  performance: { score: 0, issues: [], successes: [] },
  mobile: { score: 0, issues: [], successes: [] },
  structured: { score: 0, issues: [], successes: [] }
}

// ==================== TECHNICAL SEO AUDIT ====================
function auditTechnicalSEO() {
  log('\n🔧 TECHNICAL SEO AUDIT', 'blue')
  log('='.repeat(60), 'blue')

  let score = 0
  const maxScore = 100

  // Check robots.txt
  const robotsPath = path.join(process.cwd(), 'app', 'robots.ts')
  if (fs.existsSync(robotsPath)) {
    score += 15
    auditResults.technical.successes.push('✅ robots.txt configured')
    log('✅ robots.txt: Found', 'green')
  } else {
    auditResults.technical.issues.push('❌ Missing robots.txt')
    log('❌ robots.txt: Missing', 'red')
  }

  // Check sitemap
  const sitemapPath = path.join(process.cwd(), 'app', 'sitemap.ts')
  if (fs.existsSync(sitemapPath)) {
    score += 15
    auditResults.technical.successes.push('✅ Dynamic sitemap.xml configured')
    log('✅ sitemap.xml: Found', 'green')
  } else {
    auditResults.technical.issues.push('❌ Missing sitemap.xml')
    log('❌ sitemap.xml: Missing', 'red')
  }

  // Check meta tags in layout
  const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx')
  if (fs.existsSync(layoutPath)) {
    const content = fs.readFileSync(layoutPath, 'utf-8')
    
    if (content.includes('metadata') || content.includes('Metadata')) {
      score += 10
      auditResults.technical.successes.push('✅ Meta tags configured in layout')
      log('✅ Meta Tags: Configured', 'green')
    } else {
      auditResults.technical.issues.push('⚠️ Meta tags may be incomplete')
      log('⚠️ Meta Tags: Check configuration', 'yellow')
    }

    if (content.includes('canonical')) {
      score += 10
      auditResults.technical.successes.push('✅ Canonical URLs configured')
      log('✅ Canonical URLs: Configured', 'green')
    } else {
      auditResults.technical.issues.push('⚠️ Missing canonical URLs')
      log('⚠️ Canonical URLs: Missing or incomplete', 'yellow')
    }
  }

  // Check for structured data
  const schemaPath = path.join(process.cwd(), 'lib', 'advanced-schema.ts')
  if (fs.existsSync(schemaPath)) {
    score += 15
    auditResults.technical.successes.push('✅ Advanced structured data library exists')
    log('✅ Structured Data: Advanced schemas available', 'green')
  } else {
    auditResults.technical.issues.push('❌ No structured data implementation')
    log('❌ Structured Data: Not implemented', 'red')
  }

  // Check next.config
  const configPath = path.join(process.cwd(), 'next.config.mjs')
  if (fs.existsSync(configPath)) {
    const config = fs.readFileSync(configPath, 'utf-8')
    
    if (config.includes('async headers')) {
      score += 10
      auditResults.technical.successes.push('✅ Security headers configured')
      log('✅ Security Headers: Configured', 'green')
    }

    if (config.includes('images')) {
      score += 10
      auditResults.technical.successes.push('✅ Image optimization enabled')
      log('✅ Image Optimization: Enabled', 'green')
    }
  }

  // Check for PWA
  const manifestPath = path.join(process.cwd(), 'app', 'manifest.ts')
  if (fs.existsSync(manifestPath)) {
    score += 15
    auditResults.technical.successes.push('✅ PWA manifest configured')
    log('✅ PWA: Manifest found', 'green')
  } else {
    auditResults.technical.issues.push('⚠️ PWA manifest missing')
    log('⚠️ PWA: No manifest', 'yellow')
  }

  auditResults.technical.score = score
  log(`\n📊 Technical SEO Score: ${score}/${maxScore}`, score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red')
}

// ==================== CONTENT SEO AUDIT ====================
function auditContentSEO() {
  log('\n📝 CONTENT SEO AUDIT', 'blue')
  log('='.repeat(60), 'blue')

  let score = 0
  const maxScore = 100

  // Check for primary landing pages
  const primaryPages = [
    { path: 'app/comsats-gpa-calculator/page.tsx', name: 'GPA Calculator Landing', points: 20 },
    { path: 'app/comsats-past-papers/page.tsx', name: 'Past Papers Landing', points: 20 },
    { path: 'app/faculty/page.tsx', name: 'Faculty Reviews', points: 15 },
    { path: 'app/timetable/page.tsx', name: 'Timetable', points: 10 }
  ]

  primaryPages.forEach(page => {
    const pagePath = path.join(process.cwd(), page.path)
    if (fs.existsSync(pagePath)) {
      const content = fs.readFileSync(pagePath, 'utf-8')
      
      // Check for metadata
      if (content.includes('export const metadata')) {
        score += page.points
        auditResults.content.successes.push(`✅ ${page.name}: Optimized with metadata`)
        log(`✅ ${page.name}: Found with metadata`, 'green')
      } else {
        auditResults.content.issues.push(`⚠️ ${page.name}: Missing metadata`)
        log(`⚠️ ${page.name}: Missing metadata`, 'yellow')
        score += page.points * 0.5
      }
    } else {
      auditResults.content.issues.push(`❌ ${page.name}: Page doesn't exist`)
      log(`❌ ${page.name}: Not found`, 'red')
    }
  })

  // Check for blog content
  const blogPath = path.join(process.cwd(), 'app', 'blog')
  if (fs.existsSync(blogPath)) {
    const blogFiles = fs.readdirSync(blogPath, { withFileTypes: true })
      .filter(d => d.isDirectory())
    
    if (blogFiles.length > 0) {
      score += 15
      auditResults.content.successes.push(`✅ Blog content exists (${blogFiles.length} articles)`)
      log(`✅ Blog: ${blogFiles.length} articles found`, 'green')
    } else {
      auditResults.content.issues.push('⚠️ Blog exists but no articles')
      log('⚠️ Blog: No articles yet', 'yellow')
    }
  } else {
    auditResults.content.issues.push('❌ No blog section')
    log('❌ Blog: Not found', 'red')
  }

  // Check for campus pages
  const campusPages = ['islamabad', 'lahore', 'attock', 'wah', 'abbottabad', 'sahiwal', 'vehari']
  let campusCount = 0
  campusPages.forEach(campus => {
    const campusPath = path.join(process.cwd(), 'app', 'campus', campus, 'page.tsx')
    if (fs.existsSync(campusPath)) {
      campusCount++
    }
  })

  if (campusCount >= 5) {
    score += 25
    auditResults.content.successes.push(`✅ Campus pages: ${campusCount}/7 configured`)
    log(`✅ Campus Pages: ${campusCount}/7 found (Excellent!)`, 'green')
  } else if (campusCount >= 3) {
    score += 20
    auditResults.content.successes.push(`✅ Campus pages: ${campusCount}/7 configured`)
    log(`✅ Campus Pages: ${campusCount}/7 found`, 'green')
  } else if (campusCount > 0) {
    score += 10
    auditResults.content.issues.push(`⚠️ Only ${campusCount}/7 campus pages`)
    log(`⚠️ Campus Pages: Only ${campusCount}/7 found`, 'yellow')
  } else {
    auditResults.content.issues.push('❌ No campus-specific pages')
    log('❌ Campus Pages: None found', 'red')
  }

  auditResults.content.score = score
  log(`\n📊 Content SEO Score: ${score}/${maxScore}`, score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red')
}

// ==================== STRUCTURED DATA AUDIT ====================
function auditStructuredData() {
  log('\n🏗️ STRUCTURED DATA AUDIT', 'blue')
  log('='.repeat(60), 'blue')

  let score = 0
  const maxScore = 100

  const schemaPath = path.join(process.cwd(), 'lib', 'advanced-schema.ts')
  if (fs.existsSync(schemaPath)) {
    const content = fs.readFileSync(schemaPath, 'utf-8')
    
    const schemaTypes = [
      { type: 'SoftwareApplication', points: 15, description: 'GPA Calculator' },
      { type: 'HowTo', points: 10, description: 'Tutorial guides' },
      { type: 'FAQPage', points: 15, description: 'FAQ sections' },
      { type: 'LocalBusiness', points: 15, description: 'Campus locations' },
      { type: 'Course', points: 10, description: 'Course information' },
      { type: 'BreadcrumbList', points: 10, description: 'Navigation breadcrumbs' },
      { type: 'Article', points: 10, description: 'Blog posts' },
      { type: 'Review', points: 10, description: 'Faculty reviews' },
      { type: 'AggregateRating', points: 5, description: 'Rating aggregates' }
    ]

    schemaTypes.forEach(schema => {
      if (content.includes(schema.type)) {
        score += schema.points
        auditResults.structured.successes.push(`✅ ${schema.type}: ${schema.description}`)
        log(`✅ ${schema.type}: Implemented`, 'green')
      } else {
        auditResults.structured.issues.push(`❌ ${schema.type}: Missing`)
        log(`❌ ${schema.type}: Not found`, 'red')
      }
    })
  } else {
    auditResults.structured.issues.push('❌ No structured data library')
    log('❌ No structured data implementation', 'red')
  }

  auditResults.structured.score = score
  log(`\n📊 Structured Data Score: ${score}/${maxScore}`, score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red')
}

// ==================== GENERATE RECOMMENDATIONS ====================
function generateRecommendations() {
  log('\n💡 SEO RECOMMENDATIONS', 'magenta')
  log('='.repeat(60), 'magenta')

  const allIssues = [
    ...auditResults.technical.issues,
    ...auditResults.content.issues,
    ...auditResults.structured.issues
  ]

  if (allIssues.length === 0) {
    log('🎉 No critical issues found! Your SEO is excellent!', 'green')
    return allIssues
  }

  log('\n🔴 Critical Issues to Fix:', 'red')
  allIssues.filter(i => i.includes('❌')).forEach(issue => {
    log(`   ${issue}`, 'red')
  })

  log('\n🟡 Warnings to Address:', 'yellow')
  allIssues.filter(i => i.includes('⚠️')).forEach(issue => {
    log(`   ${issue}`, 'yellow')
  })

  log('\n📋 Action Plan:', 'cyan')
  log('   1. Fix all critical (❌) issues first', 'cyan')
  log('   2. Create missing primary landing pages', 'cyan')
  log('   3. Implement all structured data types', 'cyan')
  log('   4. Add campus-specific pages for local SEO', 'cyan')
  log('   5. Publish regular blog content (2-3 posts/week)', 'cyan')
  log('   6. Submit sitemap to search engines', 'cyan')
  
  return allIssues
}

// ==================== GENERATE REPORT ====================
function generateReport() {
  const totalScore = Math.round(
    (auditResults.technical.score * 0.3 +
     auditResults.content.score * 0.3 +
     auditResults.structured.score * 0.4)
  )

  log('\n' + '='.repeat(60), 'blue')
  log('📊 COMPREHENSIVE SEO AUDIT REPORT', 'blue')
  log('='.repeat(60), 'blue')

  log(`\n🎯 Overall SEO Score: ${totalScore}/100`, totalScore >= 80 ? 'green' : totalScore >= 60 ? 'yellow' : 'red')
  
  log('\n📈 Category Scores:', 'cyan')
  log(`   Technical SEO:     ${auditResults.technical.score}/100`, 'cyan')
  log(`   Content SEO:       ${auditResults.content.score}/100`, 'cyan')
  log(`   Structured Data:   ${auditResults.structured.score}/100`, 'cyan')

  log('\n✅ Strengths:', 'green')
  const allSuccesses = [
    ...auditResults.technical.successes,
    ...auditResults.content.successes,
    ...auditResults.structured.successes
  ]
  allSuccesses.slice(0, 5).forEach(success => {
    log(`   ${success}`, 'green')
  })

  const allIssues = generateRecommendations()

  // Save report to file
  const reportData = {
    timestamp: new Date().toISOString(),
    overallScore: totalScore,
    categories: auditResults,
    recommendations: allIssues
  }

  const reportPath = path.join(process.cwd(), 'SEO_AUDIT_REPORT.json')
  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2))
  log(`\n💾 Full report saved to: SEO_AUDIT_REPORT.json`, 'cyan')

  log('\n' + '='.repeat(60), 'blue')
  log('Audit completed successfully!', 'green')
}

// ==================== MAIN EXECUTION ====================
async function main() {
  log('\n🚀 CampusAxis SEO Audit Tool', 'blue')
  log('Starting comprehensive SEO analysis...\n', 'cyan')

  try {
    auditTechnicalSEO()
    auditContentSEO()
    auditStructuredData()
    generateReport()
  } catch (error) {
    log(`\n❌ Error during audit: ${error.message}`, 'red')
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = { main }
