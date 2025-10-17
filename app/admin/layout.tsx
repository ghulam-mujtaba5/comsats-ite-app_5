import type { Metadata } from 'next'
import { createMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

// Section-level theming: apply light/dark CSS for all admin routes
import { AdminThemeWrapper } from './AdminThemeWrapper'

// Apply noindex to all admin routes by default to keep them out of search results.
export const metadata: Metadata = createMetadata({
  title: 'Admin Dashboard',
  description: 'CampusAxis administrative interface for content and moderation.',
  path: '/admin',
  noindex: true,
})

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminThemeWrapper>{children}</AdminThemeWrapper>
}
