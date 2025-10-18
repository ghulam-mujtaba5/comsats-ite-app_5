/**
 * Image utilities for handling profile images and fallbacks
 */

/**
 * Get a fallback avatar URL based on user initials
 * Uses a default placeholder or generates a colored avatar
 */
export function getAvatarFallback(name: string): string {
  // Return placeholder image path
  return '/placeholder-user.jpg'
}

/**
 * Generate initials from a name
 */
export function getInitials(name: string, maxLength: number = 2): string {
  if (!name) return 'U'
  
  const parts = name.trim().split(/[\s._-]+/).filter(Boolean)
  
  if (parts.length === 0) return 'U'
  
  const initials = parts
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, maxLength)
  
  return initials || 'U'
}

/**
 * Handle image loading errors
 */
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement>) {
  const target = event.target as HTMLImageElement
  // Hide the broken image
  target.style.display = 'none'
  // Optionally, you could set a fallback src here
  // target.src = '/placeholder-user.jpg'
}

/**
 * Validate and sanitize image URLs
 */
export function validateImageUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') {
    return '/placeholder-user.jpg'
  }
  
  // Check if URL is valid
  try {
    new URL(url, window.location.origin)
    return url
  } catch {
    return '/placeholder-user.jpg'
  }
}
