"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Sparkles } from "lucide-react"

interface BrandedBannerProps {
  title: string
  subtitle?: string
  description: string
  ctaText?: string
  ctaLink?: string
  variant?: "default" | "gradient" | "glass"
  showLogo?: boolean
  className?: string
}

export function BrandedBanner({
  title,
  subtitle,
  description,
  ctaText,
  ctaLink,
  variant = "gradient",
  showLogo = true,
  className = "",
}: BrandedBannerProps) {
  const variantClasses = {
    default: "glass-interactive",
    gradient: "glass-hero glass-border-glow glass-hover-glow glass-depth glass-gradient",
    glass: "glass-secondary glass-hover glass-depth glass-layered",
  }

  return (
    <Card
      className={`relative overflow-hidden border-2 shadow-2xl hover:shadow-3xl transition-all duration-500 glass-floating ${variantClasses[variant]} ${className}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-mesh opacity-30" />
      
      {/* Gradient Orbs */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-indigo-500/20 to-pink-500/20 rounded-full blur-3xl" />

      {/* Logo Watermark */}
      {showLogo && (
        <div className="absolute top-6 right-6 opacity-10 dark:opacity-5">
          <Image
            src="/Campus Axis 1.svg"
            alt="CampusAxis Logo"
            width={120}
            height={120}
            className="rounded-2xl"
          />
        </div>
      )}

      <div className="relative z-10 p-8 lg:p-12">
        <div className="max-w-3xl">
          {/* Subtitle Badge */}
          {subtitle && (
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 backdrop-blur-sm text-sm font-medium">
                <Sparkles className="h-4 w-4 text-blue-500" />
                {subtitle}
              </span>
            </div>
          )}

          {/* Main Content */}
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h2>
          
          <p className="text-lg lg:text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-serif mb-6">
            {description}
          </p>

          {/* CTA Button */}
          {ctaText && ctaLink && (
            <div className="flex flex-wrap gap-4">
              <Link href={ctaLink}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover-lift rounded-xl"
                >
                  {ctaText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
