"use client"

import { GlassCard } from "./glass-card"

interface AdminLoadingProps {
  message?: string
  spinnerColor?: string
}

export function AdminLoading({ 
  message = "Loading...", 
  spinnerColor = "border-blue-600" 
}: AdminLoadingProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <GlassCard className="p-8" hover={false}>
        <div className="flex items-center gap-3">
          <div className={`animate-spin rounded-full h-6 w-6 border-b-2 ${spinnerColor}`}></div>
          <span className="text-slate-600 dark:text-slate-300">{message}</span>
        </div>
      </GlassCard>
    </div>
  )
}