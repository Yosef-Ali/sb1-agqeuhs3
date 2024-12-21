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
    <div className="flex min-h-screen flex-col space-y-6">
      <DashboardNav user={session?.user} />
      <main className="container flex-1 gap-12">
        {children}
      </main>
    </div>
  )
}
