"use client"

import { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { LucideIcon } from "lucide-react"

interface AdminContentWrapperProps {
  children: ReactNode
  title?: string
  description?: string
  badge?: {
    label: string
    icon: LucideIcon
    color?: string
  }
}

export function AdminContentWrapper({
  children,
  title,
  description,
  badge
}: AdminContentWrapperProps) {
  return (
    <div className="app-container space-y-6 pb-12">
      {title && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
            {description && (
              <p className="text-slate-600 dark:text-slate-300">{description}</p>
            )}
          </div>
          {badge && (
            <Badge variant="outline" className={`${badge.color || 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'}`}>
              <badge.icon className="h-3 w-3 mr-1" />
              {badge.label}
            </Badge>
          )}
        </div>
      )}
      {children}
    </div>
  )
}