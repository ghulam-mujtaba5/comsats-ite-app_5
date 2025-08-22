"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const { user, logout, isAuthenticated, isLoading } = useAuth()

  return (
    <AuthGuard
      fallback={
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold">Sign in required</h1>
            <p className="text-muted-foreground">Please sign in to view your profile settings.</p>
            <a href="/auth" className="text-primary underline">Go to Sign In</a>
          </div>
        </div>
      }
    >
      <div className="container mx-auto max-w-2xl p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account details.</p>
          </div>

          <div className="rounded-lg border p-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium">{user?.email ?? "—"}</div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={logout} disabled={isLoading || !isAuthenticated}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
