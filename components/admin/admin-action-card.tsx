"use client"

import { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"

interface AdminActionCardProps {
  title: string
  description?: string
  icon: LucideIcon
  badges?: {
    label: string
    variant?: "default" | "secondary" | "destructive" | "outline"
    className?: string
  }[]
  actions?: {
    label: string
    icon: LucideIcon
    onClick: () => void
    variant?: "default" | "outline" | "destructive" | "secondary"
    className?: string
  }[]
  metadata?: string
  isProblematic?: boolean
  children?: ReactNode
}

export function AdminActionCard({
  title,
  description,
  icon: Icon,
  badges = [],
  actions = [],
  metadata,
  isProblematic = false,
  children
}: AdminActionCardProps) {
  return (
    <Card className={`glass-card border-0 rounded-2xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-xl group ${
      isProblematic 
        ? 'bg-gradient-to-br from-red-50/80 to-orange-50/80 dark:from-red-950/40 dark:to-orange-950/40 border border-red-200/50 dark:border-red-800/50 hover:shadow-red-500/20'
        : 'bg-gradient-to-br from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-900/40 border border-white/20 dark:border-white/10 hover:shadow-blue-500/10'
    }`}>
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl" />
      
      <CardContent className="relative p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
                isProblematic 
                  ? 'bg-gradient-to-br from-red-500 to-orange-500'
                  : 'bg-gradient-to-br from-blue-500 to-purple-500'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:scale-105 transition-transform duration-300">
                  {title}
                </h3>
                {description && (
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-3">
                    {description}
                  </p>
                )}
                {(badges.length > 0 || metadata) && (
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {badges.map((badge, index) => (
                      <Badge 
                        key={index}
                        variant={badge.variant || "outline"} 
                        className={`text-xs bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm ${badge.className || ''}`}
                      >
                        {badge.label}
                      </Badge>
                    ))}
                    {metadata && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {metadata}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            {children}
          </div>
          
          {actions.length > 0 && (
            <div className="flex items-center gap-2">
              {actions.map((action, index) => (
                <Button 
                  key={index}
                  size="sm" 
                  variant={action.variant || "outline"}
                  onClick={action.onClick}
                  className={action.className || (action.variant === "outline" ? "glass-button" : "")}
                >
                  <action.icon className="h-4 w-4 mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}