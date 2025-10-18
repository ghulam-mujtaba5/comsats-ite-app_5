import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const breadcrumbLinkVariants = cva(
  "hover:text-slate-900 dark:text-white transition-colors",
  {
    variants: {
      variant: {
        default: "",
        glass: "text-white hover:text-white/90",
        "glass-subtle": "text-white hover:text-white/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const breadcrumbPageVariants = cva(
  "text-slate-900 dark:text-white font-normal",
  {
    variants: {
      variant: {
        default: "",
        glass: "text-white",
        "glass-subtle": "text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const breadcrumbListVariants = cva(
  "flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
  {
    variants: {
      variant: {
        default: "text-muted-foreground",
        glass: "text-white/80",
        "glass-subtle": "text-white/70",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface BreadcrumbProps extends React.ComponentProps<"nav"> {}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ ...props }, ref) => {
    return <nav ref={ref} aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
  }
)
Breadcrumb.displayName = "Breadcrumb"

interface BreadcrumbListProps
  extends React.ComponentProps<"ol">,
    VariantProps<typeof breadcrumbListVariants> {}

const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, variant, ...props }, ref) => {
    const prefersReducedMotion = usePrefersReducedMotion()
    
    // Apply animation classes conditionally based on user preferences
    const animationClasses = prefersReducedMotion 
      ? "" 
      : "transition-all duration-300"

    return (
      <ol
        ref={ref}
        data-slot="breadcrumb-list"
        className={cn(
          breadcrumbListVariants({ variant }),
          animationClasses,
          className,
          variant?.startsWith("glass") && "dark"
        )}
        {...props}
      />
    )
  }
)
BreadcrumbList.displayName = "BreadcrumbList"

interface BreadcrumbItemProps extends React.ComponentProps<"li"> {}

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <li
        ref={ref}
        data-slot="breadcrumb-item"
        className={cn("inline-flex items-center gap-1.5", className)}
        {...props}
      />
    )
  }
)
BreadcrumbItem.displayName = "BreadcrumbItem"

interface BreadcrumbLinkProps
  extends React.ComponentProps<"a">,
    VariantProps<typeof breadcrumbLinkVariants> {
  asChild?: boolean
}

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild, className, variant, ...props }, ref) => {
    const Comp = asChild ? Slot : "a"
    const prefersReducedMotion = usePrefersReducedMotion()
    
    // Apply animation classes conditionally based on user preferences
    const animationClasses = prefersReducedMotion 
      ? "" 
      : "transition-all duration-300 hover:scale-[1.02]"

    return (
      <Comp
        ref={ref}
        data-slot="breadcrumb-link"
        className={cn(
          breadcrumbLinkVariants({ variant }),
          animationClasses,
          className,
          variant?.startsWith("glass") && "dark"
        )}
        {...props}
      />
    )
  }
)
BreadcrumbLink.displayName = "BreadcrumbLink"

interface BreadcrumbPageProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof breadcrumbPageVariants> {}

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <span
        ref={ref}
        data-slot="breadcrumb-page"
        role="link"
        aria-disabled="true"
        aria-current="page"
        className={cn(
          breadcrumbPageVariants({ variant }),
          className,
          variant?.startsWith("glass") && "dark"
        )}
        {...props}
      />
    )
  }
)
BreadcrumbPage.displayName = "BreadcrumbPage"

interface BreadcrumbSeparatorProps extends React.ComponentProps<"li"> {}

const BreadcrumbSeparator = React.forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <li
        ref={ref}
        data-slot="breadcrumb-separator"
        role="presentation"
        aria-hidden="true"
        className={cn("[&>svg]:size-3.5", className)}
        {...props}
      >
        {children ?? <ChevronRight />}
      </li>
    )
  }
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

interface BreadcrumbEllipsisProps extends React.ComponentProps<"span"> {}

const BreadcrumbEllipsis = React.forwardRef<HTMLSpanElement, BreadcrumbEllipsisProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        data-slot="breadcrumb-ellipsis"
        role="presentation"
        aria-hidden="true"
        className={cn("flex size-9 items-center justify-center", className)}
        {...props}
      >
        <MoreHorizontal className="size-4" />
        <span className="sr-only">More</span>
      </span>
    )
  }
)
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}