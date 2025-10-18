import type { Metadata } from 'next'
import { createMetadata } from '@/lib/seo'
import styles from './layout.module.css';

export const dynamic = 'force-dynamic'

// Apply noindex to all admin routes by default to keep them out of search results.
export const metadata: Metadata = createMetadata({
  title: 'Community Management',
  description: 'Manage community posts, users, and reports.',
  path: '/admin/community',
  noindex: true,
})

export default function CommunityAdminLayout({ children }: { children: React.ReactNode }) {
  return children
}