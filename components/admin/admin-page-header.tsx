"use client"

import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LucideIcon } from "lucide-react"
import { useAccessibility } from "@/hooks/use-accessibility"

interface AdminPageHeaderProps {
  title: string
  description: string
  icon: LucideIcon
  iconGradient?: string
  badges?: {
    label: string
    value: string | number
    icon: LucideIcon
    color?: string
  }[]
  actions?: {
    label: string
    icon: LucideIcon
    onClick: () => void
    variant?: "default" | "outline"
    gradient?: string
  }[]
  className?: string
  id?: string
}

export function AdminPageHeader({
  title,
  description,
  icon: Icon,
  iconGradient = "from-blue-600 to-indigo-600",
  badges = [],
  actions = [],
  className = "",
  id = "main-content"
}: AdminPageHeaderProps) {
  const { announceToScreenReader } = useAccessibility()

  const handleActionClick = (action: typeof actions[0]) => {
    announceToScreenReader(`Executing ${action.label}`)
    action.onClick()
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/20 ${className}`}>
        {/* Hero Section with Enhanced Glassmorphism */}
        <header className="relative overflow-hidden" role="banner">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 backdrop-blur-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          
          <div className="relative app-container pt-12 pb-8">
            <div className="glass-card-enhanced p-6 sm:p-8 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative" aria-hidden="true">
                      <div className={`absolute inset-0 bg-gradient-to-r ${iconGradient} rounded-2xl blur-xl opacity-30 animate-pulse`} />
                      <div className={`relative bg-gradient-to-r ${iconGradient} p-3 rounded-2xl`}>
                        <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 
                        id={id}
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent"
                        tabIndex={-1}
                      >
                        {title}
                      </h1>
                      <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base lg:text-lg mt-1">
                        {description}
                      </p>
                    </div>
                  </div>
                  
                  {badges.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3" role="group" aria-label="Page statistics">
                      {badges.map((badge, index) => (
                        <Badge 
                          key={`${badge.label}-${index}`}
                          variant="outline" 
                          className={`bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-xs sm:text-sm ${badge.color || 'border-blue-200 dark:border-blue-800'}`}
                          aria-label={`${badge.label}: ${badge.value}`}
                        >
                          <badge.icon className="h-3 w-3 mr-1" aria-hidden="true" />
                          <span className="sr-only-enhanced">{badge.label}:</span>
                          {badge.label}: {badge.value}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                {actions.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3" role="group" aria-label="Page actions">
                    {actions.map((action, index) => (
                      <Button 
                        key={`${action.label}-${index}`}
                        size="sm" 
                        variant={action.variant || "outline"}
                        onClick={() => handleActionClick(action)}
                        className={
                          action.variant === "outline" 
                            ? "glass-button-enhanced"
                            : action.gradient 
                              ? `bg-gradient-to-r ${action.gradient} hover:shadow-xl transition-all duration-300 border-0 shadow-lg text-white`
                              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-white"
                        }
                        aria-describedby={`action-${index}-desc`}
                      >
                        <action.icon className="h-4 w-4 mr-2" aria-hidden="true" />
                        {action.label}
                        <span id={`action-${index}-desc`} className="sr-only-enhanced">
                          {action.label} button
                        </span>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      </div>
  )
}