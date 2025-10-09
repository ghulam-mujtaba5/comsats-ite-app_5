import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { marked } from 'marked'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Simple HTML sanitization function
export function sanitizeHtml(content: string): string {
  // Convert markdown to HTML synchronously
  const html = marked.parse(content || '', { async: false }) as string
  
  // Basic sanitization - remove script tags
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}