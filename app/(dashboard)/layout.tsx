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
    <div className="flex min-h-screen flex-col w-full">
      {/* Full-width nav background */}
      <div className="w-full border-b bg-background">
        <div className="container mx-auto flex justify-center">
          <div className="w-full max-w-7xl">
            <DashboardNav user={session} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 w-full">
        <div className="container mx-auto flex justify-center py-6">
          <div className="w-full max-w-7xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}