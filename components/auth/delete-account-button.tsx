"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"


export function DeleteAccountButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    const ok = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone."
    )
    if (!ok) return

    try {
      setLoading(true)
      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session?.access_token) {
        alert("You must be signed in to delete your account.")
        setLoading(false)
        return
      }

      const res = await fetch("/api/account", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
        },
      })

      if (res.status !== 204) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || "Failed to delete account")
      }

      await supabase.auth.signOut()
      router.replace("/auth")
    } catch (e: any) {
      alert(e?.message || "Something went wrong while deleting your account.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Delete account
    </Button>
  )
}

