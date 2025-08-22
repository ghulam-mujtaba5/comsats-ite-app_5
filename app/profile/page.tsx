"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { DeleteAccountButton } from "@/components/auth/delete-account-button"
import Link from "next/link"

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
      <div className="container mx-auto max-w-4xl p-6">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Your Profile</h1>
              <p className="text-muted-foreground">Manage your account and activity.</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={logout} disabled={isLoading || !isAuthenticated}>
                Sign Out
              </Button>
              <DeleteAccountButton />
            </div>
          </div>

          {/* Account Details */}
          <section className="rounded-lg border p-4">
            <h2 className="font-semibold mb-3">Account Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium">{user?.email ?? "—"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">User ID</div>
                <div className="font-mono text-sm truncate">{user?.id ?? "—"}</div>
              </div>
            </div>
          </section>

          {/* Your Reviews */}
          <section className="rounded-lg border p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Your Reviews</h2>
              <Link href="/faculty" className="text-sm text-primary underline underline-offset-4">
                Write a review
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              You haven't submitted any reviews yet.
            </div>
          </section>

          {/* Activity */}
          <section className="rounded-lg border p-4">
            <h2 className="font-semibold mb-3">Recent Activity</h2>
            <div className="text-sm text-muted-foreground">No recent activity.</div>
          </section>
        </div>
      </div>
    </AuthGuard>
  )
}
