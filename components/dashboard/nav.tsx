import Link from "next/link"
import { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/components/cart/cart-context"

interface DashboardNavProps {
  user: User | null
}

export function DashboardNav({ user }: DashboardNavProps) {
  const { totalItems, setIsOpen } = useCart()
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
            <Link
              href="/dashboard/customers"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Customers
            </Link>
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            className="relative"
            onClick={() => setIsOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>
          <p className="text-sm text-muted-foreground">
            {user?.email}
          </p>
          <form action="/auth/signout" method="post">
            <Button variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
