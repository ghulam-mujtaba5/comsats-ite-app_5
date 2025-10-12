import React from 'react'

export default function CelebrationDemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {children}
    </div>
  )
}