import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  quality?: number
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  loading?: "eager" | "lazy"
  unoptimized?: boolean
}

/**
 * Optimized Image Component with automatic blur placeholder and error handling
 * 
 * Features:
 * - Automatic WebP conversion
 * - Lazy loading by default
 * - Error state handling
 * - Loading state shimmer effect
 * - Blur placeholder support
 * - Responsive sizing
 * 
 * @example
 * <OptimizedImage 
 *   src="/hero.jpg" 
 *   alt="Hero banner"
 *   width={1200}
 *   height={630}
 *   priority={true} // For above-the-fold images
 * />
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
  quality = 85,
  objectFit = "cover",
  placeholder,
  blurDataURL,
  loading,
  unoptimized = false,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Generate shimmer placeholder for better perceived performance
  const shimmer = (w: number, h: number) => `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#f6f7f8" offset="0%" />
          <stop stop-color="#edeef1" offset="20%" />
          <stop stop-color="#f6f7f8" offset="40%" />
          <stop stop-color="#f6f7f8" offset="100%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#f6f7f8" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
    </svg>
  `

  const toBase64 = (str: string) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str)

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-lg",
          fill ? "absolute inset-0" : "",
          className
        )}
        style={
          !fill && width && height
            ? { width: `${width}px`, height: `${height}px` }
            : undefined
        }
      >
        <div className="text-center text-slate-700 dark:text-slate-300 p-4">
          <p className="text-sm">Failed to load image</p>
          <p className="text-xs opacity-60">{alt}</p>
        </div>
      </div>
    )
  }

  const imageProps: any = {
    src,
    alt,
    quality,
    priority,
    unoptimized,
    onLoad: () => setIsLoading(false),
    onError: () => {
      setIsLoading(false)
      setHasError(true)
    },
    className: cn(
      "duration-700 ease-in-out",
      isLoading ? "scale-110 blur-2xl grayscale" : "scale-100 blur-0 grayscale-0",
      className
    ),
  }

  if (fill) {
    imageProps.fill = true
    imageProps.sizes = sizes || "100vw"
    imageProps.style = { objectFit }
  } else {
    imageProps.width = width
    imageProps.height = height
  }

  // Add blur placeholder if not provided
  if (!placeholder && !blurDataURL && width && height) {
    imageProps.placeholder = "blur"
    imageProps.blurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`
  } else if (placeholder === "blur" && blurDataURL) {
    imageProps.placeholder = "blur"
    imageProps.blurDataURL = blurDataURL
  }

  // Override loading if specified
  if (loading) {
    imageProps.loading = loading
  }

  return <Image {...imageProps} />
}

/**
 * Lazy loaded image wrapper for images below the fold
 * Automatically adds lazy loading and intersection observer
 */
export function LazyImage(props: OptimizedImageProps) {
  return <OptimizedImage {...props} priority={false} loading="lazy" />
}

/**
 * Priority image wrapper for above-the-fold images
 * Automatically adds eager loading and high priority
 */
export function PriorityImage(props: OptimizedImageProps) {
  return <OptimizedImage {...props} priority={true} loading="eager" />
}
