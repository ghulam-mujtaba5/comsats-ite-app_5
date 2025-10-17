import layout from '@/app/styles/common.module.css'
import './accessibility-test.light.module.css'
import './accessibility-test.dark.module.css'

export default function AccessibilityTestLayout({
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