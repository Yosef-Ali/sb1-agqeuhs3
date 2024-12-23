import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col w-full">
      {/* Full-width header background */}
      <div className="w-full border-b bg-background">
        <div className="container mx-auto flex justify-center">
          <div className="w-full max-w-7xl">
            <MarketingHeader />
          </div>
        </div>
      </div>

      {/* Full-width main section with centered content */}
      <main className="flex-1 w-full bg-background">
        {children}
      </main>

      {/* Full-width footer background */}
      <div className="w-full border-t bg-background">
        <div className="container mx-auto flex justify-center">
          <div className="w-full max-w-7xl">
            <MarketingFooter />
          </div>
        </div>
      </div>
    </div>
  )
}