"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { cva, type VariantProps } from "class-variance-authority"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const alertDialogOverlayVariants = cva(
  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50",
  {
    variants: {
      variant: {
        default: "bg-black/50",
        glass: "bg-black/30 backdrop-blur-sm",
        "glass-subtle": "bg-black/20 backdrop-blur-xs",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const alertDialogContentVariants = cva(
  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
  {
    variants: {
      variant: {
        default: "bg-background",
        glass: "bg-white/10 backdrop-blur-xl border-slate-200 dark:border-slate-700 shadow-glass",
        "glass-subtle": "bg-white/5 backdrop-blur-lg border-slate-200 dark:border-slate-700 shadow-glass-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Use the primitive components directly
const AlertDialog = AlertDialogPrimitive.Root
const AlertDialogTrigger = AlertDialogPrimitive.Trigger
const AlertDialogPortal = AlertDialogPrimitive.Portal

interface AlertDialogOverlayProps
  extends React.ComponentProps<typeof AlertDialogPrimitive.Overlay>,
    VariantProps<typeof alertDialogOverlayVariants> {}

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  AlertDialogOverlayProps
>(({ className, variant, ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "" 
    : "transition-all duration-300"

  return (
    <AlertDialogPrimitive.Overlay
      ref={ref}
      data-slot="alert-dialog-overlay"
      className={cn(
        alertDialogOverlayVariants({ variant }),
        animationClasses,
        className
      )}
      {...props}
    />
  )
})
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

interface AlertDialogContentProps
  extends React.ComponentProps<typeof AlertDialogPrimitive.Content>,
    VariantProps<typeof alertDialogContentVariants> {}

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  AlertDialogContentProps
>(({ className, variant, ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "" 
    : "transition-all duration-300"

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay variant={variant} />
      <AlertDialogPrimitive.Content
        ref={ref}
        data-slot="alert-dialog-content"
        className={cn(
          alertDialogContentVariants({ variant }),
          animationClasses,
          className,
          variant?.startsWith("glass") && "dark"
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
})
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

interface AlertDialogHeaderProps extends React.ComponentProps<"div"> {}

const AlertDialogHeader = React.forwardRef<HTMLDivElement, AlertDialogHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="alert-dialog-header"
        className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
        {...props}
      />
    )
  }
)
AlertDialogHeader.displayName = "AlertDialogHeader"

interface AlertDialogFooterProps extends React.ComponentProps<"div"> {}

const AlertDialogFooter = React.forwardRef<HTMLDivElement, AlertDialogFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="alert-dialog-footer"
        className={cn(
          "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
          className
        )}
        {...props}
      />
    )
  }
)
AlertDialogFooter.displayName = "AlertDialogFooter"

interface AlertDialogTitleProps
  extends React.ComponentProps<typeof AlertDialogPrimitive.Title> {}

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  AlertDialogTitleProps
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Title
      ref={ref}
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  )
})
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

interface AlertDialogDescriptionProps
  extends React.ComponentProps<typeof AlertDialogPrimitive.Description> {}

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  AlertDialogDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Description
      ref={ref}
      data-slot="alert-dialog-description"
      className={cn("text-slate-700 dark:text-slate-300 text-sm", className)}
      {...props}
    />
  )
})
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName

interface AlertDialogActionProps
  extends React.ComponentProps<typeof AlertDialogPrimitive.Action> {}

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  AlertDialogActionProps
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Action
      ref={ref}
      className={cn(buttonVariants(), className)}
      {...props}
    />
  )
})
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

interface AlertDialogCancelProps
  extends React.ComponentProps<typeof AlertDialogPrimitive.Cancel> {}

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  AlertDialogCancelProps
>(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Cancel
      ref={ref}
      className={cn(buttonVariants({ variant: "outline" }), className)}
      {...props}
    />
  )
})
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}