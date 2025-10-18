import type { Metadata } from "next"
import { createMetadata } from "@/lib/seo"
import styles from './layout.module.css';

export const metadata: Metadata = createMetadata({
  title: "Admin Sign-in — CampusAxis",
  description: "Restricted admin authentication portal.",
  path: "/admin/auth",
  noindex: true,
})

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children
}
