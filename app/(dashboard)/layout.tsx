import { DashboardNav } from "@/components/dashboard/nav"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen flex-col items-center space-y-6">
      <div className="w-full">
        <DashboardNav user={session?.user} />
      </div>
      <main className="container flex-1 gap-12 max-w-7xl mx-auto px-4">
        {children}
      </main>
    </div>
  )
}
