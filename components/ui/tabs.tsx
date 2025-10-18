"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { getEnhancedGlassClasses, glassPresets } from "@/lib/glassmorphism-2025"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const tabsListVariants = cva(
  "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
  {
    variants: {
      variant: {
        default: "",
        glass: getEnhancedGlassClasses({
          ...glassPresets.card,
          variant: 'glass-subtle',
          accessibility: {
            reducedMotion: true,
            focusVisible: true
          }
        }),
        "glass-subtle": getEnhancedGlassClasses({
          ...glassPresets.card,
          variant: 'glass-subtle',
          accessibility: {
            reducedMotion: true,
            focusVisible: true
          }
        }),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const tabsTriggerVariants = cva(
  "data-[state=active]:bg-background dark:data-[state=active]:text-slate-900 dark:text-white focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-slate-900 dark:text-white dark:text-slate-700 dark:text-slate-300 inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 interactive hover-lift",
  {
    variants: {
      variant: {
        default: "",
        glass: getEnhancedGlassClasses({
          ...glassPresets.button,
          accessibility: {
            reducedMotion: true,
            focusVisible: true
          }
        }),
        "glass-subtle": getEnhancedGlassClasses({
          ...glassPresets.button,
          variant: 'glass-subtle',
          accessibility: {
            reducedMotion: true,
            focusVisible: true
          }
        }),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface TabsProps
  extends React.ComponentProps<typeof TabsPrimitive.Root> {}

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(({ className, ...props }, ref) => {
  return (
    <TabsPrimitive.Root
      ref={ref}
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
})
Tabs.displayName = TabsPrimitive.Root.displayName

interface TabsListProps
  extends React.ComponentProps<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "transition-none" 
    : "transition-all animate-duration-300 animate-ease-default"

  return (
    <TabsPrimitive.List
      ref={ref}
      data-slot="tabs-list"
      className={cn(
        tabsListVariants({ variant }),
        animationClasses,
        className,
        variant?.startsWith("glass") && "dark"
      )}
      {...props}
    />
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

interface TabsTriggerProps
  extends React.ComponentProps<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "transition-none" 
    : "transition-all animate-duration-300 animate-ease-spring hover:scale-[1.02]"

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      data-slot="tabs-trigger"
      className={cn(
        tabsTriggerVariants({ variant }),
        animationClasses,
        className,
        variant?.startsWith("glass") && "dark"
      )}
      {...props}
    />
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

interface TabsContentProps
  extends React.ComponentProps<typeof TabsPrimitive.Content> {}

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, ...props }, ref) => {
  return (
    <TabsPrimitive.Content
      ref={ref}
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
})
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }