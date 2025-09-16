import type { Metadata } from "next"
import { createMetadata } from "@/lib/seo"

export const metadata: Metadata = createMetadata({
  title: "Reset Password",
  description: "Reset your password securely.",
  path: "/auth/reset-password",
  noindex: true,
})

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children
}
