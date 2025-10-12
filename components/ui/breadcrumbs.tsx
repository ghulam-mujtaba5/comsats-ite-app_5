"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const breadcrumbsVariants = cva(
  "flex flex-wrap items-center gap-1 text-sm",
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

const breadcrumbLinkVariants = cva(
  "hover:text-foreground transition-colors",
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

export type Crumb = {
  label: string
  href?: string
}

interface BreadcrumbsProps extends VariantProps<typeof breadcrumbsVariants> {
  items?: Crumb[]
  className?: string
}

export function Breadcrumbs({ items, variant, className }: BreadcrumbsProps) {
  const pathname = usePathname()
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "" 
    : "transition-all duration-300"

  // Fallback: generate from pathname if items not provided
  const autoItems: Crumb[] = React.useMemo(() => {
    if (items && items.length) return items
    const segments = pathname.split("/").filter(Boolean)
    const crumbs: Crumb[] = [{ label: "Home", href: "/" }]
    let acc = ""
    segments.forEach((seg, idx) => {
      acc += `/${seg}`
      // humanize segment
      const label = decodeURIComponent(seg)
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (m) => m.toUpperCase())
      crumbs.push({ label, href: idx === segments.length - 1 ? undefined : acc })
    })
    return crumbs
  }, [items, pathname])

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn(
        animationClasses,
        className,
        variant?.startsWith("glass") && "dark"
      )}
    >
      <ol className={cn(
        breadcrumbsVariants({ variant }),
        className
      )}>
        {autoItems.map((item, idx) => {
          const isLast = idx === autoItems.length - 1
          if (isLast) {
            return (
              <li 
                key={idx} 
                aria-current="page" 
                className="truncate max-w-[50ch]" 
                title={item.label}
              >
                {item.label}
              </li>
            )
          }
          return (
            <li key={idx} className="inline-flex items-center">
              {item.href ? (
                <Link 
                  href={item.href} 
                  className={cn(
                    breadcrumbLinkVariants({ variant }),
                    animationClasses
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span>{item.label}</span>
              )}
              <span 
                className={cn(
                  "mx-2 select-none",
                  variant === "glass" ? "text-white/40" : 
                  variant === "glass-subtle" ? "text-white/30" : 
                  "text-border"
                )} 
                aria-hidden
              >
                /
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}