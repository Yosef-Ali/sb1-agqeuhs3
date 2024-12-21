import { MarketingHeader } from "@/components/marketing/header"
import { MarketingFooter } from "@/components/marketing/footer"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <div className="w-full">
        <MarketingHeader />
      </div>
      <main className="flex-1 w-full">{children}</main>
      <div className="w-full">
        <MarketingFooter />
      </div>
    </div>
  )
}
