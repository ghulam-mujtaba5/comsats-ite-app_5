"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { AdminGuard } from "@/components/admin/admin-guard"
import { Button } from "@/components/ui/button"

export default function AdminDashboardPage() {
  const router = useRouter()
  return (
    <AdminGuard
      fallback={
        <div className="min-h-screen flex items-center justify-center p-6 text-center space-y-3">
          <div>
            <h1 className="text-2xl font-bold">Admin access required</h1>
            <p className="text-muted-foreground">Go to the admin login page to continue.</p>
            <Link href="/admin/login" className="text-primary underline">Admin Login</Link>
          </div>
        </div>
      }
    >
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage faculty and timetable data.</p>
          </div>
          <Button
            variant="outline"
            onClick={async () => {
              await fetch('/api/admin/session', { method: 'DELETE' })
              router.replace('/admin/login')
            }}
          >
            Logout
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/admin/faculty" className="block border rounded-lg p-5 hover:bg-accent">
            <h2 className="text-xl font-semibold">Faculty Management</h2>
            <p className="text-muted-foreground">Add/edit faculty, CSV import/export</p>
          </Link>
          <Link href="/admin/timetable-docs" className="block border rounded-lg p-5 hover:bg-accent">
            <h2 className="text-xl font-semibold">Timetable Documents</h2>
            <p className="text-muted-foreground">Upload/edit/delete PDF schedules</p>
          </Link>
          <Link href="/admin/resources" className="block border rounded-lg p-5 hover:bg-accent">
            <h2 className="text-xl font-semibold">Resources</h2>
            <p className="text-muted-foreground">Add/edit/delete resources with Google Drive links or files</p>
          </Link>
        </div>
      </div>
    </AdminGuard>
  )
}
