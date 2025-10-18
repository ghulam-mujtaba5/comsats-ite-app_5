"use client"

import * as React from "react"
import { GripVerticalIcon } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const resizableHandleVariants = cva(
  "relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:translate-x-0 data-[panel-group-direction=vertical]:after:-translate-y-1/2 [&[data-panel-group-direction=vertical]>div]:rotate-90",
  {
    variants: {
      variant: {
        default: "bg-border focus-visible:ring-ring",
        glass: "bg-white/20 focus-visible:ring-white/30 backdrop-blur-sm",
        "glass-subtle": "bg-white/10 focus-visible:ring-white/20 backdrop-blur-xs",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface ResizablePanelGroupProps
  extends React.ComponentProps<typeof ResizablePrimitive.PanelGroup> {}

const ResizablePanelGroup = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.PanelGroup>,
  ResizablePanelGroupProps
>(({ className, ...props }, ref) => {
  return (
    <ResizablePrimitive.PanelGroup
      ref={ref}
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
})
ResizablePanelGroup.displayName = ResizablePrimitive.PanelGroup.displayName

interface ResizablePanelProps
  extends React.ComponentProps<typeof ResizablePrimitive.Panel> {}

const ResizablePanel = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.Panel>,
  ResizablePanelProps
>(({ ...props }, ref) => {
  return <ResizablePrimitive.Panel ref={ref} data-slot="resizable-panel" {...props} />
})
ResizablePanel.displayName = ResizablePrimitive.Panel.displayName

interface ResizableHandleProps
  extends React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle>,
    VariantProps<typeof resizableHandleVariants> {
  withHandle?: boolean
}

const ResizableHandle = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.PanelResizeHandle>,
  ResizableHandleProps
>(({ withHandle, className, variant, ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "transition-none" 
    : "transition-all animate-duration-300 animate-ease-default"

  return (
    <ResizablePrimitive.PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(
        resizableHandleVariants({ variant }),
        animationClasses,
        className,
        variant?.startsWith("glass") && "dark"
      )}
      {...props}
    >
      {withHandle && (
        <div className={cn(
          "z-10 flex h-4 w-3 items-center justify-center rounded-xs border",
          variant === "glass" ? "bg-white/20 border-slate-200 dark:border-slate-700" : 
          variant === "glass-subtle" ? "bg-white/10 border-slate-200 dark:border-slate-700" : 
          "bg-border border-border"
        )}>
          <GripVerticalIcon className="size-2.5" />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  )
})
ResizableHandle.displayName = ResizablePrimitive.PanelResizeHandle.displayName

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }