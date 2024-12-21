import Link from "next/link"
import { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"

interface DashboardNavProps {
  user: User | null
}

export function DashboardNav({ user }: DashboardNavProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Dashboard</span>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Overview
            </Link>
            <Link
              href="/dashboard/orders"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Orders
            </Link>
            <Link
              href="/dashboard/products"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Products
            </Link>
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            {user?.email}
          </Button>
        </div>
      </div>
    </header>
  )
}
