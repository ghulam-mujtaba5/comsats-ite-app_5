"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import Image, { StaticImageData } from "next/image"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  src,
  alt,
  width = 40,
  height = 40,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image> & {
  width?: number
  height?: number
}) {
  // Use Next.js Image component for better optimization
  // Only use Next.js Image for string URLs or StaticImageData
  if (src && (typeof src === 'string' || (typeof src === 'object' && src !== null && !(src instanceof Blob)))) {
    return (
      <Image
        src={src as string | StaticImageData}
        alt={alt || ""}
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
      data-slot="avatar-image"
      src={src as string | undefined}
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }