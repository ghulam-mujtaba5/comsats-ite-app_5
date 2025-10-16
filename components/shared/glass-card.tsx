"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  glassVariant?: 'primary' | 'secondary' | 'subtle'
  hoverEffect?: boolean
  border?: boolean
}

export function GlassCard({
  title,
  description,
  children,
  className,
  glassVariant = 'primary',
  hoverEffect = true,
  border = true,
  ...props
}: GlassCardProps) {
  // Define glass variants
  const glassClasses = {
    primary: "bg-card/90 backdrop-blur-3xl",
    secondary: "bg-card/80 backdrop-blur-2xl",
    subtle: "bg-card/70 backdrop-blur-xl",
  }

  // Define border classes
  const borderClasses = border 
    ? "border border-white/30" 
    : ""

  // Define hover effect classes
  const hoverClasses = hoverEffect
    ? "transition-all duration-300 hover:shadow-2xl"
    : ""

  return (
    <Card 
      className={cn(
        glassClasses[glassVariant],
        borderClasses,
        hoverClasses,
        "rounded-2xl shadow-xl glass-primary glass-professional",
        className
      )}
      {...props}
    >
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={title || description ? "" : "p-6"}>
        {children}
      </CardContent>
    </Card>
  )
}