import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'

export default async function DashboardPage() {
  try {
    const session = await requireAuth()
    
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid gap-6">
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold mb-2">Welcome back, {session.user.email}</h2>
            <p className="text-sm text-muted-foreground">
              Manage your orders and account settings here.
            </p>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    redirect('/login')
  }
}
