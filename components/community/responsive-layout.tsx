"use client"

import { useState, useEffect } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

interface ResponsiveLayoutProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveLayout({ children, className }: ResponsiveLayoutProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1024px)")
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const isLargeDesktop = useMediaQuery("(min-width: 1280px)")

  // Add responsive classes to body for CSS-based adjustments
  useEffect(() => {
    const body = document.body
    body.classList.remove("mobile", "tablet", "desktop", "large-desktop")
    
    if (isMobile) body.classList.add("mobile")
    if (isTablet) body.classList.add("tablet")
    if (isDesktop) body.classList.add("desktop")
    if (isLargeDesktop) body.classList.add("large-desktop")
    
    return () => {
      body.classList.remove("mobile", "tablet", "desktop", "large-desktop")
    }
  }, [isMobile, isTablet, isDesktop, isLargeDesktop])

  return (
    <div 
      className={cn(
        "responsive-layout",
        isMobile && "layout-mobile",
        isTablet && "layout-tablet",
        isDesktop && "layout-desktop",
        isLargeDesktop && "layout-large-desktop",
        className
      )}
    >
      {children}
    </div>
  )
}

interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  minColumnWidth?: string
  gap?: string
}

export function ResponsiveGrid({ 
  children, 
  className,
  minColumnWidth = "250px",
  gap = "1rem"
}: ResponsiveGridProps) {
  return (
    <div 
      className={cn("grid", className)}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${minColumnWidth}, 1fr))`,
        gap
      }}
    >
      {children}
    </div>
  )
}

interface ResponsiveCardProps {
  children: React.ReactNode
  className?: string
  responsive?: boolean
}

export function ResponsiveCard({ 
  children, 
  className,
  responsive = true
}: ResponsiveCardProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  
  return (
    <div 
      className={cn(
        "border rounded-lg bg-white dark:bg-slate-800 text-card-foreground shadow-sm",
        responsive && isMobile ? "p-4" : "p-6",
        className
      )}
    >
      {children}
    </div>
  )
}

interface ResponsiveButtonProps {
  children: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg"
  responsive?: boolean
  [key: string]: any
}

export function ResponsiveButton({ 
  children, 
  className,
  size = "md",
  responsive = true,
  ...props
}: ResponsiveButtonProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  
  const sizeClasses = {
    sm: isMobile && responsive ? "h-8 px-3 text-xs" : "h-9 px-3 text-sm",
    md: isMobile && responsive ? "h-9 px-4 text-sm" : "h-10 px-4 py-2",
    lg: isMobile && responsive ? "h-10 px-6 text-base" : "h-11 px-8 text-base"
  }
  
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

interface ResponsiveTextProps {
  children: React.ReactNode
  className?: string
  variant?: "title" | "heading" | "body" | "caption"
  responsive?: boolean
}

export function ResponsiveText({ 
  children, 
  className,
  variant = "body",
  responsive = true
}: ResponsiveTextProps) {
  const variantClasses = {
    title: "text-responsive-title",
    heading: "text-responsive-heading",
    body: "text-responsive-body",
    caption: "text-responsive-caption"
  }
  
  return (
    <span className={cn(variantClasses[variant], className)}>
      {children}
    </span>
  )
}