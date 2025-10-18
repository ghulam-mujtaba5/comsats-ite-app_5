import { glob } from 'glob'
import { promises as fs } from 'fs'
import path from 'path'

const aliasMap = {
  '@/lib/mongodb': '@infrastructure/database/mongodb',
  '@/lib/mongo': '@infrastructure/database/mongo',
  '@/lib/supabase-admin': '@infrastructure/database/supabase-admin',
  '@/lib/supabase-utils': '@infrastructure/database/supabase-utils',
  '@/lib/auth': '@core/auth',
  '@/lib/auth-server': '@features/auth/server',
  '@/lib/gamification': '@features/gamification/lib',
  '@/lib/gamification-achievements': '@features/gamification/achievements',
  '@/lib/community': '@features/community/lib',
  '@/lib/community-data': '@features/community/data',
  '@/lib/faculty-data': '@features/faculty/data',
  '@/lib/past-papers-data': '@features/past-papers/data',
  '@/lib/resources-data': '@features/resources/data',
  '@/lib/gpa-utils': '@features/gpa-calculator/utils',
  '@/lib/student-department-utils': '@features/student-portal/utils',
  '@/lib/admin': '@features/admin/lib',
  '@/lib/admin-access': '@features/admin/access',
  '@/lib/admin-utils': '@features/admin/utils',
  '@/lib/admin-middleware': '@features/admin/middleware',
  '@/lib/utils': '@lib/utils',
  '@/lib/config': '@config/config',
  '@/lib/data': '@infrastructure/data',
  '@/lib/services': '@infrastructure/services',
  '@/lib/core': '@core/legacy',
  '@/lib/theme': '@styles/theme',
  '@/lib/': '@/src/lib/',
}

async function updateImports() {
  const files = await glob('**/*.{ts,tsx}', { ignore: 'node_modules/**' })
  for (const file of files) {
    let content = await fs.readFile(file, 'utf-8')
    const originalContent = content
    for (const [oldPath, newPath] of Object.entries(aliasMap)) {
      const regex = new RegExp(`(from\\s+['"])${oldPath}(['"])`, 'g')
      content = content.replace(regex, `$1${newPath}$2`)
    }
    if (content !== originalContent) {
      console.log(`Updating imports in ${file}`)
      await fs.writeFile(file, content, 'utf-8')
    }
  }
}

updateImports().catch(console.error)
