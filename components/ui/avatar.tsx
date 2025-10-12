"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import Image, { StaticImageData } from "next/image"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { usePrefersReducedMotion } from '@/hooks/use-enhanced-animations'

const avatarVariants = cva(
  "relative flex size-8 shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      variant: {
        default: "",
        glass: "bg-white/10 backdrop-blur-xl border border-white/20 shadow-glass",
        "glass-subtle": "bg-white/5 backdrop-blur-lg border border-white/10 shadow-glass-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const avatarFallbackVariants = cva(
  "flex size-full items-center justify-center rounded-full",
  {
    variants: {
      variant: {
        default: "bg-muted",
        glass: "bg-white/10 backdrop-blur-xl",
        "glass-subtle": "bg-white/5 backdrop-blur-lg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface AvatarProps
  extends React.ComponentProps<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, variant, ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "transition-none" 
    : "transition-all animate-duration-300 animate-ease-default"

  return (
    <AvatarPrimitive.Root
      ref={ref}
      data-slot="avatar"
      className={cn(
        avatarVariants({ variant }),
        animationClasses,
        className,
        variant?.startsWith("glass") && "dark"
      )}
      {...props}
    />
  )
})
Avatar.displayName = AvatarPrimitive.Root.displayName

interface AvatarImageProps
  extends React.ComponentProps<typeof AvatarPrimitive.Image>,
    VariantProps<typeof avatarVariants> {
  width?: number
  height?: number
}

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({ className, variant, width = 40, height = 40, src, ...props }, ref) => {
  // Use Next.js Image component for better optimization
  // Only use Next.js Image for string URLs or StaticImageData
  if (src && (typeof src === 'string' || (typeof src === 'object' && src !== null && 'src' in src))) {
    return (
      <Image
        src={src as string | StaticImageData}
        alt={props.alt || ""}
        width={width}
        height={height}
        className={cn("aspect-square size-full object-cover", className)}
        {...props}
      />
    )
  }
  
  // Fallback to Radix UI AvatarImage if no src or if src is a Blob
  return (
    <AvatarPrimitive.Image
      ref={ref}
      data-slot="avatar-image"
      src={src as string | undefined}
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
})
AvatarImage.displayName = AvatarPrimitive.Image.displayName

interface AvatarFallbackProps
  extends React.ComponentProps<typeof AvatarPrimitive.Fallback>,
    VariantProps<typeof avatarFallbackVariants> {}

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, variant, ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Apply animation classes conditionally based on user preferences
  const animationClasses = prefersReducedMotion 
    ? "transition-none" 
    : "transition-all animate-duration-300 animate-ease-default"

  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      data-slot="avatar-fallback"
      className={cn(
        avatarFallbackVariants({ variant }),
        animationClasses,
        className,
        variant?.startsWith("glass") && "dark"
      )}
      {...props}
    />
  )
})
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }