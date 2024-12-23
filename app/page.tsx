import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <section className="w-full pt-12 md:pt-24 lg:pt-32 border-b">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Fresh Organic Fruits
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Delivered straight to your doorstep. Experience nature's sweetness, delivered with care.
              </p>
            </div>
            <div className="space-x-4">
              <Link
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                href="/products"
              >
                Shop Now
              </Link>
              <Link
                className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                href="/login"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
