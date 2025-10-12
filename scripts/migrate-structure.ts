#!/usr/bin/env tsx

/**
 * Migration Script for New Project Structure
 * 
 * This script helps migrate the existing project structure to the new organized structure
 * by updating import paths and providing migration guidance.
 */

import fs from 'fs/promises'
import path from 'path'

// Define the mapping of old paths to new paths
const PATH_MAPPINGS = {
  // Component mappings
  '@/components/ui/': '@/components/shared/ui/',
  '@/components/layout/': '@/components/shared/layout/',
  '@/components/community/': '@/components/features/community/',
  '@/components/gamification/': '@/components/features/gamification/',
  '@/components/profile/': '@/components/features/profile/',
  '@/components/animations/': '@/components/features/animations/',
  '@/components/emotion/': '@/components/features/emotion/',
  
  // Hook mappings
  '@/hooks/use-realtime-posts': '@/hooks/features/community/use-realtime-posts',
  '@/hooks/use-realtime-comments': '@/hooks/features/community/use-realtime-comments',
  '@/hooks/use-realtime-likes': '@/hooks/features/community/use-realtime-likes',
  '@/hooks/use-realtime-polls': '@/hooks/features/community/use-realtime-polls',
  '@/hooks/use-advanced-search': '@/hooks/features/community/use-advanced-search',
  '@/hooks/use-achievements': '@/hooks/features/gamification/use-achievements',
  '@/hooks/use-user-profile': '@/hooks/features/gamification/use-user-profile',
  '@/hooks/use-emotion-detection': '@/hooks/features/emotion/use-emotion-detection',
  '@/hooks/use-emotion-state': '@/hooks/features/emotion/use-emotion-state',
  '@/hooks/use-enhanced-animations': '@/hooks/features/animations/use-enhanced-animations',
  '@/hooks/use-celebration-animations': '@/hooks/features/animations/use-celebration-animations',
  '@/hooks/use-confetti-effect': '@/hooks/features/animations/use-confetti-effect',
  '@/hooks/use-animation-effects': '@/hooks/features/animations/use-animation-effects',
  '@/hooks/use-media-query': '@/hooks/shared/use-media-query',
  '@/hooks/use-mobile': '@/hooks/shared/use-mobile',
  '@/hooks/use-toast': '@/hooks/shared/use-toast',
  '@/hooks/use-offline': '@/hooks/shared/use-offline',
  '@/hooks/use-accessibility': '@/hooks/shared/use-accessibility',
  
  // Library mappings
  '@/lib/supabase': '@/lib/data/supabase',
  '@/lib/supabase-utils': '@/lib/data/supabase-utils',
  '@/lib/supabase-admin': '@/lib/data/supabase-admin',
  '@/lib/mongo': '@/lib/data/mongo',
  '@/lib/mongodb': '@/lib/data/mongodb',
  '@/lib/auth': '@/lib/core/auth',
  '@/lib/community': '@/lib/core/community',
  '@/lib/gamification': '@/lib/core/gamification',
  '@/lib/faculty-data': '@/lib/core/faculty-data',
  '@/lib/past-papers-data': '@/lib/core/past-papers-data',
  '@/lib/resources-data': '@/lib/core/resources-data',
  '@/lib/gpa-utils': '@/lib/core/gpa-utils',
  '@/lib/auth-server': '@/lib/services/auth-server',
  '@/lib/admin': '@/lib/services/admin',
  '@/lib/admin-access': '@/lib/services/admin-access',
  '@/lib/admin-utils': '@/lib/services/admin-utils',
  '@/lib/analytics': '@/lib/services/analytics',
  '@/lib/notification-helpers': '@/lib/services/notification-helpers',
  '@/lib/notify': '@/lib/services/notify',
  '@/lib/seo': '@/lib/services/seo',
  '@/lib/seo-utils': '@/lib/services/seo-utils',
  '@/lib/seo-config': '@/lib/services/seo-config',
  '@/lib/faculty-seo': '@/lib/services/faculty-seo',
  '@/lib/utils': '@/lib/utils/utils',
  '@/lib/cva': '@/lib/utils/cva',
  '@/lib/validation': '@/lib/utils/validation',
  '@/lib/responsive': '@/lib/utils/responsive',
  '@/lib/responsive-test-utils': '@/lib/utils/responsive-test-utils',
  '@/lib/polyfills': '@/lib/utils/polyfills',
  '@/lib/retry-utils': '@/lib/utils/retry-utils',
  '@/lib/rate-limit': '@/lib/utils/rate-limit',
  '@/lib/error-handler': '@/lib/utils/error-handler',
  '@/lib/errors': '@/lib/utils/errors',
  '@/lib/web-vitals': '@/lib/utils/web-vitals',
  '@/lib/avatar-updater': '@/lib/utils/avatar-updater',
  '@/lib/campus-email-mapping': '@/lib/utils/campus-email-mapping',
  '@/lib/contribution-constants': '@/lib/utils/contribution-constants',
  '@/lib/filter-data': '@/lib/utils/filter-data',
  '@/lib/filter-persistence': '@/lib/utils/filter-persistence',
  '@/lib/glassmorphism-2025': '@/lib/utils/glassmorphism-2025',
  '@/lib/icon-generator': '@/lib/utils/icon-generator',
  '@/lib/media-upload': '@/lib/utils/media-upload',
  '@/lib/site-map': '@/lib/utils/site-map',
  '@/lib/user-campus-detector': '@/lib/utils/user-campus-detector',
}

// Function to recursively find all .ts and .tsx files
async function findFiles(dir: string, extensions: string[] = ['.ts', '.tsx']): Promise<string[]> {
  const files: string[] = []
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      
      if (entry.isDirectory()) {
        files.push(...await findFiles(fullPath, extensions))
      } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath)
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error)
  }
  
  return files
}

// Function to update import paths in a file
async function updateImportPaths(filePath: string): Promise<boolean> {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    let updatedContent = content
    let hasChanges = false
    
    // Update import paths
    for (const [oldPath, newPath] of Object.entries(PATH_MAPPINGS)) {
      const importRegex = new RegExp(`(['"])${oldPath}([^'"]*)['"]`, 'g')
      const updated = updatedContent.replace(importRegex, `$1${newPath}$2$1`)
      
      if (updated !== updatedContent) {
        hasChanges = true
        updatedContent = updated
      }
    }
    
    // Write updated content if changes were made
    if (hasChanges) {
      await fs.writeFile(filePath, updatedContent, 'utf-8')
      console.log(`Updated imports in: ${filePath}`)
      return true
    }
    
    return false
  } catch (error) {
    console.error(`Error updating file ${filePath}:`, error)
    return false
  }
}

// Function to generate migration report
async function generateMigrationReport() {
  const report = {
    totalFiles: 0,
    updatedFiles: 0,
    errors: [] as string[],
    mappings: PATH_MAPPINGS
  }
  
  try {
    const files = await findFiles(path.join(__dirname, '..'), ['.ts', '.tsx'])
    report.totalFiles = files.length
    
    for (const file of files) {
      try {
        const updated = await updateImportPaths(file)
        if (updated) {
          report.updatedFiles++
        }
      } catch (error) {
        report.errors.push(`Error processing ${file}: ${error}`)
      }
    }
  } catch (error) {
    report.errors.push(`Error finding files: ${error}`)
  }
  
  return report
}

// Main execution function
async function main() {
  console.log('🚀 Starting project structure migration...')
  
  const report = await generateMigrationReport()
  
  console.log('\n📊 Migration Report:')
  console.log(`Total files processed: ${report.totalFiles}`)
  console.log(`Files with updated imports: ${report.updatedFiles}`)
  console.log(`Success rate: ${((report.updatedFiles / report.totalFiles) * 100).toFixed(2)}%`)
  
  if (report.errors.length > 0) {
    console.log('\n❌ Errors encountered:')
    report.errors.forEach(error => console.log(`  - ${error}`))
  }
  
  console.log('\n✅ Migration completed!')
  console.log('\n📝 Next steps:')
  console.log('1. Review the changes in your version control system')
  console.log('2. Run tests to ensure everything still works')
  console.log('3. Update any remaining hardcoded paths')
  console.log('4. Update documentation references')
}

// Run the script if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('Migration failed:', error)
    process.exit(1)
  })
}

export { PATH_MAPPINGS, findFiles, updateImportPaths, generateMigrationReport }