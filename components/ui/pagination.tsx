import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { cva, type VariantProps } from "class-variance-authority"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const paginationVariants = cva(
  "mx-auto flex w-full justify-center",
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

const paginationLinkVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "",
        glass: "text-white hover:bg-white/20",
        "glass-subtle": "text-white hover:bg-white/15",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const paginationEllipsisVariants = cva(
  "flex size-9 items-center justify-center",
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

interface PaginationProps
  extends React.ComponentProps<"nav">,
    VariantProps<typeof paginationVariants> {}

function Pagination({ className, variant, ...props }: PaginationProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "" 
    : "transition-all duration-300"

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn(
        paginationVariants({ variant }),
        animationClasses,
        className,
        variant?.startsWith("glass") && "dark"
      )}
      {...props}
    />
  )
}

interface PaginationContentProps extends React.ComponentProps<"ul"> {}

function PaginationContent({ className, ...props }: PaginationContentProps) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
}

interface PaginationItemProps extends React.ComponentProps<"li"> {}

function PaginationItem({ ...props }: PaginationItemProps) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a"> &
  VariantProps<typeof paginationLinkVariants>

function PaginationLink({
  className,
  variant,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "" 
    : "transition-all duration-300 hover:scale-105"

  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
        }),
        paginationLinkVariants({ variant }),
        size === "icon" ? "size-9" : "px-2.5 py-1.5",
        animationClasses,
        className,
        variant?.startsWith("glass") && "dark"
      )}
      {...props}
    />
  )
}

interface PaginationPreviousProps
  extends Omit<React.ComponentProps<typeof PaginationLink>, 'size'> {}

function PaginationPrevious({
  className,
  variant,
  ...props
}: PaginationPreviousProps) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      variant={variant}
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  )
}

interface PaginationNextProps
  extends Omit<React.ComponentProps<typeof PaginationLink>, 'size'> {}

function PaginationNext({
  className,
  variant,
  ...props
}: PaginationNextProps) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      variant={variant}
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  )
}

interface PaginationEllipsisProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof paginationEllipsisVariants> {}

function PaginationEllipsis({
  className,
  variant,
  ...props
}: PaginationEllipsisProps) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        paginationEllipsisVariants({ variant }),
        className,
        variant?.startsWith("glass") && "dark"
      )}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}