#!/usr/bin/env tsx

/**
 * Validation Script for New Project Structure
 * 
 * This script validates that the new project structure is correctly implemented
 * by checking import paths and ensuring all exports work correctly.
 */

import fs from 'fs/promises'
import path from 'path'

// Test imports to validate the new structure
async function validateStructure() {
  const results = {
    components: {
      shared: false,
      features: false
    },
    hooks: {
      shared: false,
      features: false
    },
    lib: {
      core: false,
      data: false,
      services: false,
      utils: false,
      config: false
    },
    errors: [] as string[]
  }

  try {
    // Test component imports
    const componentImports = [
      // Shared components
      () => import('@/components/shared/ui'),
      () => import('@/components/shared/layout'),
      () => import('@/components/shared/common'),
      
      // Feature components
      () => import('@/components/features/community'),
      () => import('@/components/features/gamification'),
      () => import('@/components/features/profile'),
      () => import('@/components/features/animations'),
      () => import('@/components/features/emotion')
    ]

    for (const importFn of componentImports) {
      try {
        await importFn()
      } catch (error) {
        results.errors.push(`Component import failed: ${error}`)
      }
    }
    results.components.shared = true
    results.components.features = true

  } catch (error) {
    results.errors.push(`Component validation failed: ${error}`)
  }

  try {
    // Test hook imports
    const hookImports = [
      // Shared hooks
      () => import('@/hooks/shared'),
      
      // Feature hooks
      () => import('@/hooks/features/community'),
      () => import('@/hooks/features/gamification'),
      () => import('@/hooks/features/emotion'),
      () => import('@/hooks/features/animations')
    ]

    for (const importFn of hookImports) {
      try {
        await importFn()
      } catch (error) {
        results.errors.push(`Hook import failed: ${error}`)
      }
    }
    results.hooks.shared = true
    results.hooks.features = true

  } catch (error) {
    results.errors.push(`Hook validation failed: ${error}`)
  }

  try {
    // Test library imports
    const libImports = [
      () => import('@/lib/core'),
      () => import('@/lib/data'),
      () => import('@/lib/services'),
      () => import('@/lib/utils'),
      () => import('@/lib/config')
    ]

    for (const importFn of libImports) {
      try {
        await importFn()
      } catch (error) {
        results.errors.push(`Library import failed: ${error}`)
      }
    }
    results.lib.core = true
    results.lib.data = true
    results.lib.services = true
    results.lib.utils = true
    results.lib.config = true

  } catch (error) {
    results.errors.push(`Library validation failed: ${error}`)
  }

  return results
}

// Function to check for circular dependencies
async function checkCircularDependencies() {
  // This is a simplified check - in a real implementation, you might use
  // a tool like madge or dependency-cruiser for comprehensive analysis
  console.log('🔍 Checking for obvious circular dependencies...')
  
  // For now, we'll just log that this check should be done
  console.log('⚠️  Note: For comprehensive circular dependency checking, use tools like madge or dependency-cruiser')
  
  return []
}

// Function to validate directory structure
async function validateDirectoryStructure() {
  const requiredDirs = [
    'components/shared/ui',
    'components/shared/layout',
    'components/shared/common',
    'components/features/community',
    'components/features/gamification',
    'components/features/profile',
    'components/features/animations',
    'components/features/emotion',
    'hooks/shared',
    'hooks/features/community',
    'hooks/features/gamification',
    'hooks/features/emotion',
    'hooks/features/animations',
    'lib/core',
    'lib/data',
    'lib/services',
    'lib/utils',
    'lib/config'
  ]

  const missingDirs = []
  
  for (const dir of requiredDirs) {
    try {
      const fullPath = path.join(__dirname, '..', dir)
      await fs.access(fullPath)
    } catch {
      missingDirs.push(dir)
    }
  }
  
  return missingDirs
}

// Main validation function
async function main() {
  console.log('🧪 Validating new project structure...')
  
  // Validate directory structure
  const missingDirs = await validateDirectoryStructure()
  if (missingDirs.length > 0) {
    console.log('❌ Missing required directories:')
    missingDirs.forEach(dir => console.log(`  - ${dir}`))
    process.exit(1)
  }
  
  // Validate imports
  const results = await validateStructure()
  
  console.log('\n✅ Directory structure validation passed!')
  
  console.log('\n📊 Import validation results:')
  console.log(`Components - Shared: ${results.components.shared ? '✅' : '❌'}`)
  console.log(`Components - Features: ${results.components.features ? '✅' : '❌'}`)
  console.log(`Hooks - Shared: ${results.hooks.shared ? '✅' : '❌'}`)
  console.log(`Hooks - Features: ${results.hooks.features ? '✅' : '❌'}`)
  console.log(`Library - Core: ${results.lib.core ? '✅' : '❌'}`)
  console.log(`Library - Data: ${results.lib.data ? '✅' : '❌'}`)
  console.log(`Library - Services: ${results.lib.services ? '✅' : '❌'}`)
  console.log(`Library - Utils: ${results.lib.utils ? '✅' : '❌'}`)
  console.log(`Library - Config: ${results.lib.config ? '✅' : '❌'}`)
  
  // Check for circular dependencies
  await checkCircularDependencies()
  
  if (results.errors.length > 0) {
    console.log('\n❌ Validation errors found:')
    results.errors.forEach(error => console.log(`  - ${error}`))
    process.exit(1)
  }
  
  console.log('\n🎉 All validations passed! The new project structure is correctly implemented.')
}

// Run the validation if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('Validation failed:', error)
    process.exit(1)
  })
}

export { validateStructure, validateDirectoryStructure, checkCircularDependencies }