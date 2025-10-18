import layout from '@/app/styles/common.module.css'
import './glassmorphism-test.light.module.css'
import './glassmorphism-test.dark.module.css'
import '@/styles/design-system/glassmorphism-unified.css'

export default function GlassmorphismTestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <main className={`${layout.section} ${layout.max6xl} py-8`}>
        {children}
      </main>
    </div>
  )
}