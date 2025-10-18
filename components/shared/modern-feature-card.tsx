"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModernFeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  delay?: number
  className?: string
  href?: string
  gradient?: "primary" | "secondary" | "accent"
}

export function ModernFeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
  className,
  href,
  gradient = "primary",
}: ModernFeatureCardProps) {
  const gradients = {
    primary: "from-primary/10 to-secondary/10",
    secondary: "from-secondary/10 to-accent/10",
    accent: "from-accent/10 to-primary/10",
  }

  const iconGradients = {
    primary: "from-primary to-secondary",
    secondary: "from-secondary to-accent",
    accent: "from-accent to-primary",
  }

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className={cn(
        "group relative overflow-hidden",
        "glass-secondary rounded-xl p-6",
        "border border-glass-light hover:border-glass-medium",
        "shadow-glass-sm hover:shadow-glass-md",
        "transition-all duration-300",
        "cursor-pointer",
        className
      )}
    >
      {/* Gradient overlay on hover */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          gradients[gradient]
        )}
      />
      
      {/* Content */}
      <div className="relative z-10 space-y-4">
        {/* Icon */}
        <div className="relative">
          <div 
            className={cn(
              "inline-flex items-center justify-center",
              "w-14 h-14 rounded-xl",
              "bg-gradient-to-br shadow-md",
              "transition-transform duration-300 group-hover:scale-110",
              iconGradients[gradient]
            )}
          >
            <Icon className="w-7 h-7 text-white" />
          </div>
          
          {/* Glow effect */}
          <div 
            className={cn(
              "absolute inset-0 w-14 h-14 rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300",
              "bg-gradient-to-br",
              iconGradients[gradient]
            )}
          />
        </div>

        {/* Text content */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground group-hover:campus-gradient-text transition-all duration-300">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Hover indicator */}
        <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>Explore</span>
          <svg 
            className="w-4 h-4 transition-transform group-hover:translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  )

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    )
  }

  return content
}

// Grid container for feature cards
export function ModernFeatureGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("campus-feature-grid", className)}>
      {children}
    </div>
  )
}
