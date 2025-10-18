"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const tableVariants = cva(
  "w-full caption-bottom text-sm",
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

const tableContainerVariants = cva(
  "relative w-full overflow-x-auto",
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

const tableHeaderVariants = cva(
  "[&_tr]:border-b",
  {
    variants: {
      variant: {
        default: "",
        glass: "[&_tr]:border-slate-200 dark:border-slate-700",
        "glass-subtle": "[&_tr]:border-slate-200 dark:border-slate-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const tableBodyVariants = cva(
  "[&_tr:last-child]:border-0",
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

const tableFooterVariants = cva(
  "border-t font-medium [&>tr]:last:border-b-0",
  {
    variants: {
      variant: {
        default: "bg-muted/50",
        glass: "bg-white/10 backdrop-blur-xl border-slate-200 dark:border-slate-700",
        "glass-subtle": "bg-white/5 backdrop-blur-lg border-slate-200 dark:border-slate-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const tableRowVariants = cva(
  "border-b transition-colors",
  {
    variants: {
      variant: {
        default: "hover:bg-muted/50 data-[state=selected]:bg-slate-100 dark:bg-slate-900",
        glass: "hover:bg-white/10 data-[state=selected]:bg-white/10 border-slate-200 dark:border-slate-700",
        "glass-subtle": "hover:bg-white/5 data-[state=selected]:bg-white/5 border-slate-200 dark:border-slate-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const tableHeadVariants = cva(
  "text-slate-900 dark:text-white h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
  {
    variants: {
      variant: {
        default: "",
        glass: "text-white bg-white/5",
        "glass-subtle": "text-white bg-white/3",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const tableCellVariants = cva(
  "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
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

const tableCaptionVariants = cva(
  "mt-4 text-sm",
  {
    variants: {
      variant: {
        default: "text-muted-foreground",
        glass: "text-white/70",
        "glass-subtle": "text-white/60",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface TableProps
  extends React.ComponentProps<"table">,
    VariantProps<typeof tableVariants> {}

function Table({ className, variant, ...props }: TableProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "transition-none" 
    : "transition-all animate-duration-300 animate-ease-default"

  return (
    <div
      data-slot="table-container"
      className={cn(
        tableContainerVariants({ variant }),
        animationClasses,
        variant?.startsWith("glass") && "dark"
      )}
    >
      <table
        data-slot="table"
        className={cn(
          tableVariants({ variant }),
          className,
          variant?.startsWith("glass") && "dark"
        )}
        {...props}
      />
    </div>
  )
}

interface TableHeaderProps
  extends React.ComponentProps<"thead">,
    VariantProps<typeof tableHeaderVariants> {}

function TableHeader({ className, variant, ...props }: TableHeaderProps) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        tableHeaderVariants({ variant }),
        className,
        variant?.startsWith("glass") && "dark"
      )}
      {...props}
    />
  )
}

interface TableBodyProps
  extends React.ComponentProps<"tbody">,
    VariantProps<typeof tableBodyVariants> {}

function TableBody({ className, variant, ...props }: TableBodyProps) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(
        tableBodyVariants({ variant }),
        className,
        variant?.startsWith("glass") && "dark"
      )}
      {...props}
    />
  )
}

interface TableFooterProps
  extends React.ComponentProps<"tfoot">,
    VariantProps<typeof tableFooterVariants> {}

function TableFooter({ className, variant, ...props }: TableFooterProps) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        tableFooterVariants({ variant }),
        className,
        variant?.startsWith("glass") && "dark"
      )}
      {...props}
    />
  )
}

interface TableRowProps
  extends React.ComponentProps<"tr">,
    VariantProps<typeof tableRowVariants> {}

function TableRow({ className, variant, ...props }: TableRowProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "transition-none" 
    : "transition-all animate-duration-300 animate-ease-default"

  return (
    <tr
      data-slot="table-row"
      className={cn(
        tableRowVariants({ variant }),
        animationClasses,
        className,
        variant?.startsWith("glass") && "dark"
      )}
      {...props}
    />
  )
}

interface TableHeadProps
  extends React.ComponentProps<"th">,
    VariantProps<typeof tableHeadVariants> {}

function TableHead({ className, variant, ...props }: TableHeadProps) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        tableHeadVariants({ variant }),
        className,
        variant?.startsWith("glass") && "dark"
      )}
      {...props}
    />
  )
}

interface TableCellProps
  extends React.ComponentProps<"td">,
    VariantProps<typeof tableCellVariants> {}

function TableCell({ className, variant, ...props }: TableCellProps) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        tableCellVariants({ variant }),
        className,
        variant?.startsWith("glass") && "dark"
      )}
      {...props}
    />
  )
}

interface TableCaptionProps
  extends React.ComponentProps<"caption">,
    VariantProps<typeof tableCaptionVariants> {}

function TableCaption({ className, variant, ...props }: TableCaptionProps) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        tableCaptionVariants({ variant }),
        className,
        variant?.startsWith("glass") && "dark"
      )}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}