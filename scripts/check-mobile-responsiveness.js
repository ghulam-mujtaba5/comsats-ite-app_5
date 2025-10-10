#!/usr/bin/env node

/**
 * Mobile Responsiveness Checker Script
 * 
 * This script checks all pages in the CampusAxis project for common mobile responsiveness issues.
 * It scans through all page files and identifies potential problems that could affect mobile experience.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const PROJECT_ROOT = path.join(__dirname, '..');
const APP_DIR = path.join(PROJECT_ROOT, 'app');
const COMPONENTS_DIR = path.join(PROJECT_ROOT, 'components');

// Common mobile responsiveness issues to check for
const MOBILE_ISSUES = [
  {
    name: 'Fixed Width Elements',
    pattern: /width:\s*\d+px/i,
    description: 'Fixed width elements may cause horizontal scrolling on mobile'
  },
  {
    name: 'Small Touch Targets',
    pattern: /min-height:\s*([0-9]|[1-3][0-9])px/i,
    description: 'Touch targets should be at least 44px for mobile usability'
  },
  {
    name: 'Desktop-Only Classes',
    pattern: /\bhidden\b|\bmd:|lg:|xl:/i,
    description: 'Desktop-only responsive classes may hide important content on mobile'
  },
  {
    name: 'Absolute Positioning',
    pattern: /position:\s*absolute/i,
    description: 'Absolute positioning may cause layout issues on different screen sizes'
  },
  {
    name: 'Fixed Positioning',
    pattern: /position:\s*fixed/i,
    description: 'Fixed positioning may interfere with mobile viewport'
  },
  {
    name: 'Large Font Sizes',
    pattern: /font-size:\s*([4-9][0-9]|[1-9][0-9][0-9])px/i,
    description: 'Very large font sizes may cause readability issues on mobile'
  },
  {
    name: 'Missing Viewport Meta',
    pattern: /<meta[^>]*name=["']viewport["'][^>]*>/i,
    negative: true,
    description: 'Missing viewport meta tag can cause mobile rendering issues'
  }
];

// Function to recursively get all files in a directory
function getAllFiles(dir, extension = '.tsx') {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(file, extension));
    } else if (path.extname(file) === extension) {
      results.push(file);
    }
  });
  
  return results;
}

// Function to check a file for mobile issues
function checkFileForIssues(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  MOBILE_ISSUES.forEach(issue => {
    const matches = content.match(issue.pattern);
    
    if (issue.negative) {
      // For negative checks (missing elements), we want to report when NOT found
      if (!matches) {
        issues.push({
          name: issue.name,
          description: issue.description,
          line: 0
        });
      }
    } else {
      // For positive checks (present elements), we want to report when found
      if (matches) {
        issues.push({
          name: issue.name,
          description: issue.description,
          line: content.substring(0, matches.index).split('\n').length
        });
      }
    }
  });
  
  return issues;
}

// Function to scan all pages for mobile issues
function scanPagesForMobileIssues() {
  console.log('🔍 Scanning all pages for mobile responsiveness issues...\n');
  
  const pageFiles = getAllFiles(APP_DIR, '.tsx');
  const componentFiles = getAllFiles(COMPONENTS_DIR, '.tsx');
  const allFiles = [...pageFiles, ...componentFiles];
  
  let totalIssues = 0;
  const filesWithIssues = [];
  
  allFiles.forEach(filePath => {
    const relativePath = path.relative(PROJECT_ROOT, filePath);
    const issues = checkFileForIssues(filePath);
    
    if (issues.length > 0) {
      totalIssues += issues.length;
      filesWithIssues.push({
        file: relativePath,
        issues: issues
      });
      
      console.log(`📁 ${relativePath}`);
      issues.forEach(issue => {
        console.log(`   ⚠️  ${issue.name} (line ${issue.line})`);
        console.log(`      ${issue.description}`);
      });
      console.log('');
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total files scanned: ${allFiles.length}`);
  console.log(`   Files with issues: ${filesWithIssues.length}`);
  console.log(`   Total issues found: ${totalIssues}`);
  
  if (filesWithIssues.length > 0) {
    console.log(`\n📝 Detailed report saved to mobile-responsiveness-report.txt`);
    
    // Generate detailed report
    const report = generateDetailedReport(filesWithIssues);
    fs.writeFileSync(
      path.join(PROJECT_ROOT, 'mobile-responsiveness-report.txt'),
      report
    );
  } else {
    console.log(`\n✅ No mobile responsiveness issues found!`);
  }
}

// Function to generate detailed report
function generateDetailedReport(filesWithIssues) {
  let report = `CampusAxis Mobile Responsiveness Report\n`;
  report += `Generated on: ${new Date().toISOString()}\n\n`;
  
  report += `Files with potential mobile responsiveness issues:\n\n`;
  
  filesWithIssues.forEach(fileInfo => {
    report += `${fileInfo.file}\n`;
    fileInfo.issues.forEach(issue => {
      report += `  - ${issue.name} (line ${issue.line})\n`;
      report += `    ${issue.description}\n`;
    });
    report += `\n`;
  });
  
  return report;
}

// Run the scan
scanPagesForMobileIssues();