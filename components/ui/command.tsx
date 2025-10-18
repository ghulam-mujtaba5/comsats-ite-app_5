"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'
import { UnifiedGlassCard } from "@/components/shared/UnifiedGlassCard"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const commandVariants = cva(
  "flex h-full w-full flex-col overflow-hidden rounded-md",
  {
    variants: {
      variant: {
        default: "bg-popover text-popover-foreground",
        glass: "",
        "glass-subtle": "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const commandInputWrapperVariants = cva(
  "flex h-9 items-center gap-2 px-3 interactive",
  {
    variants: {
      variant: {
        default: "border-b",
        glass: "border-b border-slate-200 dark:border-slate-700",
        "glass-subtle": "border-b border-slate-200 dark:border-slate-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const commandItemVariants = cva(
  "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 interactive hover-lift",
  {
    variants: {
      variant: {
        default: "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground",
        glass: "data-[selected=true]:bg-white/20 dark:data-[selected=true]:bg-white/10 data-[selected=true]:text-slate-900 dark:data-[selected=true]:text-white [&_svg:not([class*='text-'])]:text-slate-700 dark:[&_svg:not([class*='text-'])]:text-slate-300",
        "glass-subtle": "data-[selected=true]:bg-white/15 dark:data-[selected=true]:bg-white/7 data-[selected=true]:text-slate-900 dark:data-[selected=true]:text-white [&_svg:not([class*='text-'])]:text-slate-700 dark:[&_svg:not([class*='text-'])]:text-slate-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const commandGroupVariants = cva(
  "overflow-hidden p-1",
  {
    variants: {
      variant: {
        default: "text-slate-900 dark:text-white [&_[cmdk-group-heading]]:text-muted-foreground",
        glass: "text-slate-900 dark:text-white [&_[cmdk-group-heading]]:text-slate-700 dark:[&_[cmdk-group-heading]]:text-slate-300",
        "glass-subtle": "text-slate-900 dark:text-white [&_[cmdk-group-heading]]:text-slate-700 dark:[&_[cmdk-group-heading]]:text-slate-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface CommandProps
  extends React.ComponentProps<typeof CommandPrimitive>,
    VariantProps<typeof commandVariants> {}

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  CommandProps
>(({ className, variant, ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "transition-none" 
    : "transition-all animate-duration-300 animate-ease-default"

  // If it's a glass variant, use UnifiedGlassCard
  if (variant === "glass" || variant === "glass-subtle") {
    const glassVariant = variant === "glass-subtle" ? "subtle" : "base"
    
    return (
      <UnifiedGlassCard
        variant={glassVariant}
        className={cn(
          "flex h-full w-full flex-col overflow-hidden rounded-md border-0",
          animationClasses,
          className
        )}
        {...props}
      />
    )
  }

  return (
    <CommandPrimitive
      ref={ref}
      data-slot="command"
      className={cn(
        commandVariants({ variant }),
        animationClasses,
        className
      )}
      {...props}
    />
  )
})
Command.displayName = CommandPrimitive.displayName

interface CommandDialogProps
  extends React.ComponentProps<typeof Dialog> {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
}

const CommandDialog: React.FC<CommandDialogProps> = ({ 
  title = "Command Palette", 
  description = "Search for a command to run...", 
  children, 
  className, 
  showCloseButton = true, 
  ...props 
}) => {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn("overflow-hidden p-0", className)}
        showCloseButton={showCloseButton}
      >
        <Command className="[&_[cmdk-group-heading]]:text-slate-700 dark:text-slate-300 **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}
CommandDialog.displayName = "CommandDialog"

interface CommandInputProps
  extends React.ComponentProps<typeof CommandPrimitive.Input>,
    VariantProps<typeof commandInputWrapperVariants> {}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  CommandInputProps
>(({ className, variant, ...props }, ref) => {
  return (
    <div
      data-slot="command-input-wrapper"
      className={cn(
        commandInputWrapperVariants({ variant }),
        className
      )}
    >
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        ref={ref}
        data-slot="command-input"
        className={cn(
          "placeholder:text-slate-700 dark:text-slate-300 flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          variant?.startsWith("glass") && "placeholder:text-slate-700/70 dark:placeholder:text-slate-300/70 text-slate-900 dark:text-white",
          className
        )}
        {...props}
      />
    </div>
  )
})
CommandInput.displayName = CommandPrimitive.Input.displayName

interface CommandListProps
  extends React.ComponentProps<typeof CommandPrimitive.List> {}

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  CommandListProps
>(({ className, ...props }, ref) => {
  return (
    <CommandPrimitive.List
      ref={ref}
      data-slot="command-list"
      className={cn(
        "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto fade-in",
        className
      )}
      {...props}
    />
  )
})
CommandList.displayName = CommandPrimitive.List.displayName

interface CommandEmptyProps
  extends React.ComponentProps<typeof CommandPrimitive.Empty> {}

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  CommandEmptyProps
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    data-slot="command-empty"
    className="py-6 text-center text-sm"
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

interface CommandGroupProps
  extends React.ComponentProps<typeof CommandPrimitive.Group>,
    VariantProps<typeof commandGroupVariants> {}

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  CommandGroupProps
>(({ className, variant, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    data-slot="command-group"
    className={cn(
      commandGroupVariants({ variant }),
      "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

interface CommandSeparatorProps
  extends React.ComponentProps<typeof CommandPrimitive.Separator> {}

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  CommandSeparatorProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    data-slot="command-separator"
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

interface CommandItemProps
  extends React.ComponentProps<typeof CommandPrimitive.Item>,
    VariantProps<typeof commandItemVariants> {}

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  CommandItemProps
>(({ className, variant, ...props }, ref) => {
  return (
    <CommandPrimitive.Item
      ref={ref}
      data-slot="command-item"
      className={cn(
        commandItemVariants({ variant }),
        className
      )}
      {...props}
    />
  )
})

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = "CommandShortcut"

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}