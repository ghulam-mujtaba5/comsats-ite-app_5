"use client"

import { usePathname } from "next/navigation"
import { Footer } from "@/components/layout/footer"

export function FooterConditional() {
  const pathname = usePathname()
  // Hide footer on all admin routes
  if (pathname && pathname.startsWith("/admin")) {
    return null
  }
  return <Footer />
}
