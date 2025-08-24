"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

export type Crumb = {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items?: Crumb[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const pathname = usePathname()

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
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {autoItems.map((item, idx) => {
          const isLast = idx === autoItems.length - 1
          if (isLast) {
            return (
              <li key={idx} aria-current="page" className="truncate max-w-[50ch]" title={item.label}>
                {item.label}
              </li>
            )
          }
          return (
            <li key={idx} className="inline-flex items-center">
              {item.href ? (
                <Link href={item.href} className="hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span>{item.label}</span>
              )}
              <span className="mx-2 text-border select-none" aria-hidden>
                /
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
