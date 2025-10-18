"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'
import { UnifiedGlassCard } from "@/components/shared/UnifiedGlassCard"

const dialogContentVariants = cva(
  "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-4 shadow-lg duration-200 sm:p-6 sm:max-w-lg",
  {
    variants: {
      variant: {
        default: "",
        glass: "",
        "glass-subtle": "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const dialogOverlayVariants = cva(
  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50",
  {
    variants: {
      variant: {
        default: "bg-black/50",
        glass: "bg-black/30 dark:bg-black/20",
        "glass-subtle": "bg-black/20 dark:bg-black/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Dialog primitive components
const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

interface DialogOverlayProps
  extends React.ComponentProps<typeof DialogPrimitive.Overlay>,
    VariantProps<typeof dialogOverlayVariants> {
  'aria-label'?: string
}

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DialogOverlayProps
>(({ className, variant, 'aria-label': ariaLabel, ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "" 
    : "transition-all duration-300"

  return (
    <DialogPrimitive.Overlay
      ref={ref}
      data-slot="dialog-overlay"
      className={cn(
        dialogOverlayVariants({ variant }),
        animationClasses,
        className
      )}
      aria-label={ariaLabel}
      {...props}
    />
  )
})
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

interface DialogContentProps
  extends React.ComponentProps<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {
  showCloseButton?: boolean
  'aria-label'?: string
  'aria-describedby'?: string
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, variant, children, showCloseButton = true, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedBy, ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "transition-none" 
    : "transition-all animate-duration-300 animate-ease-default"

  // If it's a glass variant, use UnifiedGlassCard
  if (variant === "glass" || variant === "glass-subtle") {
    const glassVariant = variant === "glass-subtle" ? "subtle" : "base"
    
    return (
      <DialogPortal>
        <DialogOverlay variant={variant} aria-label="Dialog overlay" />
        <DialogPrimitive.Content
          ref={ref}
          data-slot="dialog-content"
          className={cn(
            "p-0 border-0",
            animationClasses,
            className
          )}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          {...props}
        >
          <UnifiedGlassCard
            variant={glassVariant}
            className="p-4 sm:p-6"
          >
            {children}
            {showCloseButton && (
              <DialogPrimitive.Close
                data-slot="dialog-close"
                className={cn(
                  "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-slate-700 dark:text-slate-300 absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 min-h-[44px] min-w-[44px] flex items-center justify-center",
                  prefersReducedMotion ? "transition-none" : "transition-opacity animate-duration-200"
                )}
                aria-label="Close dialog"
              >
                <XIcon aria-hidden="true" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            )}
          </UnifiedGlassCard>
        </DialogPrimitive.Content>
      </DialogPortal>
    )
  }

  return (
    <DialogPortal>
      <DialogOverlay variant={variant} aria-label="Dialog overlay" />
      <DialogPrimitive.Content
        ref={ref}
        data-slot="dialog-content"
        className={cn(
          dialogContentVariants({ variant }),
          animationClasses,
          className
        )}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className={cn(
              "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-slate-700 dark:text-slate-300 absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 min-h-[44px] min-w-[44px] flex items-center justify-center",
              prefersReducedMotion ? "transition-none" : "transition-opacity animate-duration-200"
            )}
            aria-label="Close dialog"
          >
            <XIcon aria-hidden="true" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
})
DialogContent.displayName = DialogPrimitive.Content.displayName

interface DialogHeaderProps extends React.ComponentProps<"div"> {}

const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="dialog-header"
        className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
        {...props}
      />
    )
  }
)
DialogHeader.displayName = "DialogHeader"

interface DialogFooterProps extends React.ComponentProps<"div"> {}

const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="dialog-footer"
        className={cn(
          "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
          className
        )}
        {...props}
      />
    )
  }
)
DialogFooter.displayName = "DialogFooter"

interface DialogTitleProps
  extends React.ComponentProps<typeof DialogPrimitive.Title> {
  'aria-label'?: string
}

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
>(({ className, 'aria-label': ariaLabel, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    data-slot="dialog-title"
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    aria-label={ariaLabel}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

interface DialogDescriptionProps
  extends React.ComponentProps<typeof DialogPrimitive.Description> {
  'aria-label'?: string
}

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, 'aria-label': ariaLabel, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    data-slot="dialog-description"
    className={cn("text-slate-700 dark:text-slate-300 text-sm", className)}
    aria-label={ariaLabel}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}