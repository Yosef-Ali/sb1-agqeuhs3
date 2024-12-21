import Link from "next/link"

export function MarketingFooter() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 md:order-1 md:flex-row md:gap-6">
          <Link href="/terms" className="text-sm hover:underline">
            Terms
          </Link>
          <Link href="/privacy" className="text-sm hover:underline">
            Privacy
          </Link>
        </div>
        <p className="text-sm text-muted-foreground md:order-0">
          &copy; {new Date().getFullYear()} Organic Fruits. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
