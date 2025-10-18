"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'
import { UnifiedGlassCard } from "@/components/shared/UnifiedGlassCard"

const accordionItemVariants = cva(
  "border-b last:border-b-0",
  {
    variants: {
      variant: {
        default: "",
        glass: "border-slate-200 dark:border-slate-700",
        "glass-subtle": "border-slate-200 dark:border-slate-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const accordionTriggerVariants = cva(
  "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180 interactive",
  {
    variants: {
      variant: {
        default: "",
        glass: "text-slate-900 dark:text-white",
        "glass-subtle": "text-slate-900 dark:text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Accordion = AccordionPrimitive.Root

interface AccordionItemProps
  extends React.ComponentProps<typeof AccordionPrimitive.Item>,
    VariantProps<typeof accordionItemVariants> {}

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, variant, ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "transition-none" 
    : "transition-all animate-duration-300 animate-ease-default"

  // If it's a glass variant, wrap in UnifiedGlassCard
  if (variant?.startsWith("glass")) {
    const glassVariant = variant === "glass-subtle" ? "subtle" : "base"
    
    return (
      <UnifiedGlassCard 
        variant={glassVariant} 
        className={cn("p-0 border-0", className)}
      >
        <AccordionPrimitive.Item
          ref={ref}
          data-slot="accordion-item"
          className={cn(
            accordionItemVariants({ variant }),
            animationClasses
          )}
          {...props}
        />
      </UnifiedGlassCard>
    )
  }

  return (
    <AccordionPrimitive.Item
      ref={ref}
      data-slot="accordion-item"
      className={cn(
        accordionItemVariants({ variant }),
        animationClasses,
        className
      )}
      {...props}
    />
  )
})
AccordionItem.displayName = AccordionPrimitive.Item.displayName

interface AccordionTriggerProps
  extends React.ComponentProps<typeof AccordionPrimitive.Trigger>,
    VariantProps<typeof accordionTriggerVariants> {}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, variant, children, ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "transition-none" 
    : "transition-all animate-duration-300 animate-ease-spring hover:scale-[1.01]"

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        data-slot="accordion-trigger"
        className={cn(
          accordionTriggerVariants({ variant }),
          animationClasses,
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className={cn(
          "text-slate-700 dark:text-slate-300 pointer-events-none size-4 shrink-0 translate-y-0.5",
          prefersReducedMotion ? "transition-none" : "transition-transform animate-duration-200"
        )} />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
})
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

interface AccordionContentProps
  extends React.ComponentProps<typeof AccordionPrimitive.Content> {}

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, children, ...props }, ref) => {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4 px-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
})
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }