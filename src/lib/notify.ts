"use client"

import { toast } from "@/hooks/use-toast"

export const notify = {
  success: (title: string, description?: string) =>
    toast({ title, description }),
  error: (title: string, description?: string) =>
    toast({ title, description, variant: "destructive" }),
  info: (title: string, description?: string) =>
    toast({ title, description }),
}

/**
 * Wrap fetch with automatic animated notifications.
 * - Shows a destructive toast on HTTP errors or network failures.
 * - Optionally shows a success toast for ok responses.
 */
export async function notifyFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
  opts?: { successMessage?: string; errorMessage?: string; showOnSuccess?: boolean },
) {
  try {
    const res = await fetch(input, init)
    if (!res.ok) {
      // Try to extract server error message
      let message = opts?.errorMessage || `Request failed (${res.status})`
      try {
        const data = await res.clone().json()
        const serverMsg = (data?.error || data?.message || "").toString()
        if (serverMsg) message = serverMsg
      } catch {}
      toast({ title: "Something went wrong", description: message, variant: "destructive" })
    } else if (opts?.showOnSuccess && opts.successMessage) {
      toast({ title: opts.successMessage })
    }
    return res
  } catch (e: any) {
    const msg = e?.message ? String(e.message) : "Network error"
    toast({ title: "Network error", description: msg, variant: "destructive" })
    throw e
  }
}
