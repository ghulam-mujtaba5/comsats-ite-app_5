#!/usr/bin/env node

/**
 * SEO Audit Script for CampusAxis
 * Validates SEO implementation and provides recommendations
 */

const fs = require('fs')
const path = require('path')

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
}

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.bright}${msg}${colors.reset}\n`),
}

// Configuration
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://campusaxis.site'
const appDir = path.join(process.cwd(), 'app')

// Audit results
const results = {
  passed: 0,
  warnings: 0,
  failed: 0,
  recommendations: [],
}

// Check environment variables
function checkEnvironment() {
  log.section('📋 Environment Configuration')

  const requiredVars = [
    'NEXT_PUBLIC_SITE_URL',
    'NEXT_PUBLIC_SITE_NAME',
    'NEXT_PUBLIC_SITE_TITLE',
  ]

  const optionalVars = [
    'NEXT_PUBLIC_GA_MEASUREMENT_ID',
    'NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_VERIFICATION',
    'NEXT_PUBLIC_BING_WEBMASTER_VERIFICATION',
    'NEXT_PUBLIC_TWITTER_HANDLE',
  ]

  requiredVars.forEach((varName) => {
    if (process.env[varName]) {
      log.success(`${varName} is set`)
      results.passed++
    } else {
      log.error(`${varName} is missing`)
      results.failed++
    }
  })

  optionalVars.forEach((varName) => {
    if (process.env[varName]) {
      log.success(`${varName} is set`)
      results.passed++
    } else {
      log.warning(`${varName} is not set (optional)`)
      results.warnings++
      results.recommendations.push(`Set ${varName} for better SEO and analytics`)
    }
  })
}

// Check robots.txt
function checkRobots() {
  log.section('🤖 Robots.txt Configuration')

  const robotsPath = path.join(appDir, 'robots.ts')
  
  if (fs.existsSync(robotsPath)) {
    log.success('robots.ts exists')
    results.passed++
    
    const content = fs.readFileSync(robotsPath, 'utf-8')
    
    if (content.includes('sitemap')) {
      log.success('Sitemap reference found in robots.txt')
      results.passed++
    } else {
      log.warning('No sitemap reference in robots.txt')
      results.warnings++
    }

    if (content.includes('crawlDelay')) {
      log.success('Crawl delay configured')
      results.passed++
    } else {
      log.info('Consider adding crawl delay for better server performance')
    }
  } else {
    log.error('robots.ts not found')
    results.failed++
  }
}

// Check sitemap
function checkSitemap() {
  log.section('🗺️  Sitemap Configuration')

  const sitemapPath = path.join(appDir, 'sitemap.ts')
  
  if (fs.existsSync(sitemapPath)) {
    log.success('sitemap.ts exists')
    results.passed++
    
    const content = fs.readFileSync(sitemapPath, 'utf-8')
    
    if (content.includes('changeFrequency')) {
      log.success('Change frequency configured')
      results.passed++
    }

    if (content.includes('priority')) {
      log.success('Priority configured')
      results.passed++
    }

    if (content.includes('lastModified')) {
      log.success('Last modified dates configured')
      results.passed++
    }
  } else {
    log.error('sitemap.ts not found')
    results.failed++
  }

  const nextSitemapConfig = path.join(process.cwd(), 'next-sitemap.config.js')
  if (fs.existsSync(nextSitemapConfig)) {
    log.success('next-sitemap.config.js exists')
    results.passed++
  } else {
    log.info('next-sitemap.config.js not found (optional)')
  }
}

// Check metadata in layout
function checkLayout() {
  log.section('📄 Layout Metadata')

  const layoutPath = path.join(appDir, 'layout.tsx')
  
  if (fs.existsSync(layoutPath)) {
    log.success('layout.tsx exists')
    results.passed++
    
    const content = fs.readFileSync(layoutPath, 'utf-8')
    
    const checks = [
      { key: 'title', name: 'Title' },
      { key: 'description', name: 'Description' },
      { key: 'keywords', name: 'Keywords' },
      { key: 'openGraph', name: 'Open Graph tags' },
      { key: 'twitter', name: 'Twitter Card tags' },
      { key: 'robots', name: 'Robots meta tag' },
      { key: 'viewport', name: 'Viewport configuration' },
      { key: 'verification', name: 'Search engine verification' },
      { key: 'manifest', name: 'Web app manifest' },
      { key: 'icons', name: 'Favicon configuration' },
    ]

    checks.forEach(({ key, name }) => {
      if (content.includes(key)) {
        log.success(`${name} configured`)
        results.passed++
      } else {
        log.warning(`${name} not found`)
        results.warnings++
      }
    })
  } else {
    log.error('layout.tsx not found')
    results.failed++
  }
}

// Check structured data
function checkStructuredData() {
  log.section('📊 Structured Data')

  const layoutPath = path.join(appDir, 'layout.tsx')
  
  if (fs.existsSync(layoutPath)) {
    const content = fs.readFileSync(layoutPath, 'utf-8')
    
    if (content.includes('application/ld+json') || content.includes('jsonLd')) {
      log.success('JSON-LD structured data found')
      results.passed++
    } else {
      log.warning('No JSON-LD structured data found in layout')
      results.warnings++
      results.recommendations.push('Add organization and website schema to layout.tsx')
    }
  }

  const seoUtilsPath = path.join(process.cwd(), 'lib', 'seo-utils.ts')
  if (fs.existsSync(seoUtilsPath)) {
    log.success('SEO utilities library exists')
    results.passed++
    
    const content = fs.readFileSync(seoUtilsPath, 'utf-8')
    
    const schemas = ['Organization', 'WebSite', 'Breadcrumb', 'Article', 'FAQ', 'Course', 'Person']
    schemas.forEach((schema) => {
      if (content.includes(schema)) {
        log.success(`${schema} schema helper found`)
        results.passed++
      }
    })
  }
}

// Check 404 page
function check404Page() {
  log.section('🔍 404 Page')

  const notFoundPath = path.join(appDir, 'not-found.tsx')
  
  if (fs.existsSync(notFoundPath)) {
    log.success('Custom 404 page exists')
    results.passed++
    
    const content = fs.readFileSync(notFoundPath, 'utf-8')
    
    if (content.includes('Home') || content.includes('href="/"')) {
      log.success('Home link found in 404 page')
      results.passed++
    } else {
      log.warning('No home link in 404 page')
      results.warnings++
    }
  } else {
    log.warning('Custom 404 page not found')
    results.warnings++
    results.recommendations.push('Create a custom 404 page with helpful navigation')
  }
}

// Check RSS feed
function checkRSSFeed() {
  log.section('📰 RSS Feed')

  const feedPath = path.join(appDir, 'feed.xml', 'route.ts')
  
  if (fs.existsSync(feedPath)) {
    log.success('RSS feed route exists')
    results.passed++
  } else {
    log.warning('RSS feed not found')
    results.warnings++
    results.recommendations.push('Create an RSS feed at /feed.xml for blog posts')
  }
}

// Check image optimization
function checkImages() {
  log.section('🖼️  Image Optimization')

  const nextConfigPath = path.join(process.cwd(), 'next.config.mjs')
  
  if (fs.existsSync(nextConfigPath)) {
    const content = fs.readFileSync(nextConfigPath, 'utf-8')
    
    if (content.includes('images')) {
      log.success('Image configuration found')
      results.passed++
      
      if (content.includes('remotePatterns') || content.includes('domains')) {
        log.success('Remote image patterns configured')
        results.passed++
      }

      if (content.includes('formats')) {
        log.success('Image formats configured (WebP recommended)')
        results.passed++
      }
    }

    if (content.includes('next/image')) {
      log.info('Using next/image for optimization')
    }
  }
}

// Check performance optimizations
function checkPerformance() {
  log.section('⚡ Performance Optimizations')

  const nextConfigPath = path.join(process.cwd(), 'next.config.mjs')
  
  if (fs.existsSync(nextConfigPath)) {
    const content = fs.readFileSync(nextConfigPath, 'utf-8')
    
    const optimizations = [
      { key: 'compiler', name: 'Compiler optimizations' },
      { key: 'experimental', name: 'Experimental features' },
      { key: 'swcMinify', name: 'SWC minification' },
      { key: 'optimizeCss', name: 'CSS optimization' },
      { key: 'optimizePackageImports', name: 'Package import optimization' },
    ]

    optimizations.forEach(({ key, name }) => {
      if (content.includes(key)) {
        log.success(`${name} enabled`)
        results.passed++
      }
    })
  }

  const publicDir = path.join(process.cwd(), 'public')
  const manifestPath = path.join(publicDir, 'manifest.json')
  const webmanifestPath = path.join(publicDir, 'manifest.webmanifest')
  
  if (fs.existsSync(manifestPath) || fs.existsSync(webmanifestPath)) {
    log.success('PWA manifest found')
    results.passed++
  } else {
    log.info('PWA manifest not found (optional for SEO)')
  }
}

// Check analytics integration
function checkAnalytics() {
  log.section('📊 Analytics & Monitoring')

  const monitoringPath = path.join(process.cwd(), 'lib', 'monitoring.ts')
  
  if (fs.existsSync(monitoringPath)) {
    log.success('Monitoring utilities exist')
    results.passed++
    
    const content = fs.readFileSync(monitoringPath, 'utf-8')
    
    if (content.includes('gtag')) {
      log.success('Google Analytics integration found')
      results.passed++
    }

    if (content.includes('trackWebVitals')) {
      log.success('Web Vitals tracking found')
      results.passed++
    }
  } else {
    log.warning('Monitoring utilities not found')
    results.warnings++
  }
}

// Print summary
function printSummary() {
  log.section('📊 Audit Summary')

  const total = results.passed + results.warnings + results.failed

  console.log(`${colors.green}Passed:${colors.reset}   ${results.passed}/${total}`)
  console.log(`${colors.yellow}Warnings:${colors.reset} ${results.warnings}/${total}`)
  console.log(`${colors.red}Failed:${colors.reset}   ${results.failed}/${total}`)

  const score = Math.round((results.passed / total) * 100)
  console.log(`\n${colors.bright}SEO Score: ${score}%${colors.reset}`)

  if (score >= 90) {
    console.log(`${colors.green}Excellent! Your SEO is well-optimized.${colors.reset}`)
  } else if (score >= 70) {
    console.log(`${colors.yellow}Good, but there's room for improvement.${colors.reset}`)
  } else {
    console.log(`${colors.red}Needs improvement. Please address the issues above.${colors.reset}`)
  }

  if (results.recommendations.length > 0) {
    log.section('💡 Recommendations')
    results.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`)
    })
  }

  console.log('\n')
}

// Run all checks
function runAudit() {
  console.log(`\n${colors.bright}${colors.cyan}🔍 CampusAxis SEO Audit${colors.reset}\n`)
  console.log(`Site URL: ${siteUrl}\n`)

  checkEnvironment()
  checkRobots()
  checkSitemap()
  checkLayout()
  checkStructuredData()
  check404Page()
  checkRSSFeed()
  checkImages()
  checkPerformance()
  checkAnalytics()

  printSummary()

  // Exit with error code if critical issues found
  if (results.failed > 0) {
    process.exit(1)
  }
}

// Run the audit
runAudit()
