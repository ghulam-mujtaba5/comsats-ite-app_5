import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { Manrope } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/layout/header"

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "CampusAxis - COMSATS University Islamabad",
  description: "Your ultimate guide to COMSATS ITE. Access past papers, calculate your GPA, read faculty reviews, and explore a wealth of academic resources.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-serif: ${manrope.variable};
}
        `}</style>
      </head>
      <body className={`${GeistSans.variable} ${manrope.variable} antialiased bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
