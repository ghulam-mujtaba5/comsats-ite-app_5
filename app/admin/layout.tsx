import type { Metadata } from 'next'
import { createMetadata } from '@/lib/seo'

// Apply noindex to all admin routes by default to keep them out of search results.
export const metadata: Metadata = createMetadata({
  title: 'Admin Dashboard',
  description: 'CampusAxis administrative interface for content and moderation.',
  path: '/admin',
  noindex: true,
})

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children
}
