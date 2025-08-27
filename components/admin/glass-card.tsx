"use client"

import { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface GlassCardProps {
  children?: ReactNode
  title?: string
  description?: string
  icon?: LucideIcon
  iconGradient?: string
  hover?: boolean
  className?: string
  headerContent?: ReactNode
}

export function GlassCard({
  children,
  title,
  description,
  icon: Icon,
  iconGradient = "from-blue-500 to-purple-500",
  hover = true,
  className = "",
  headerContent
}: GlassCardProps) {
  return (
    <Card className={`glass-card border border-white/20 dark:border-white/10 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 ${hover ? 'hover:shadow-xl transition-all duration-300' : ''} ${className}`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
      
      {(title || Icon || headerContent) && (
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${iconGradient} rounded-xl blur-lg opacity-30`} />
                  <div className={`relative bg-gradient-to-r ${iconGradient} p-2 rounded-xl`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              )}
              {title && (
                <div>
                  <CardTitle className="text-xl text-slate-900 dark:text-white">{title}</CardTitle>
                  {description && (
                    <CardDescription className="text-slate-600 dark:text-slate-300">{description}</CardDescription>
                  )}
                </div>
              )}
            </div>
            {headerContent}
          </div>
        </CardHeader>
      )}
      
      {children && (
        <CardContent className="relative">
          {children}
        </CardContent>
      )}
    </Card>
  )
}