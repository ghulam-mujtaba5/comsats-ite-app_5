import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth-server'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const { user } = await requireUser()
  if (!user) redirect('/auth?next=%2Fdashboard')
  return (
    <div className="container mx-auto max-w-5xl py-12">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-muted-foreground">Welcome back{user.email ? `, ${user.email}` : ''}.</p>
    </div>
  )
}
