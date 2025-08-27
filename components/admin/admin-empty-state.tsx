"use client"

import { GlassCard } from "./glass-card"

interface AdminEmptyStateProps {
  title: string
  description: string
  emoji?: string
  icon?: React.ReactNode
}

export function AdminEmptyState({ 
  title, 
  description, 
  emoji = "📝",
  icon
}: AdminEmptyStateProps) {
  return (
    <GlassCard className="p-12 text-center" hover={false}>
      <div className="space-y-4">
        <div className="text-4xl">
          {icon || emoji}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
          <p className="text-slate-600 dark:text-slate-300">{description}</p>
        </div>
      </div>
    </GlassCard>
  )
}