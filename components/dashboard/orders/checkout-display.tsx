import { useState } from "react"
import Image from "next/image"
import { CartItem } from "@/lib/store/cart-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Printer, Share } from "lucide-react"
import { Receipt } from "./receipt"
import { toast } from "sonner"

interface CheckoutDisplayProps {
  items: CartItem[]
  subtotal: number
  phoneNumber: string
  setPhoneNumber: (value: string) => void
  showReceipt: boolean
  setShowReceipt: (value: boolean) => void
  onNewOrder: () => void
  clearCart: () => void
}

export function CheckoutDisplay({
  items,
  subtotal,
  phoneNumber,
  setPhoneNumber,
  showReceipt,
  setShowReceipt,
  onNewOrder,
  clearCart,
}: CheckoutDisplayProps) {
  const [couponCode, setCouponCode] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    try {
      setIsProcessing(true)
      setError(null)

      // Process checkout logic here
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call

      onNewOrder()
      setShowReceipt(true)
      toast.success("Order placed successfully!")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      toast.error("Checkout failed", {
        description: errorMessage
      })
    } finally {
      setIsProcessing(false)
    }
  }
  if (showReceipt) {
    return (
      <div className="flex flex-col h-full">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>Order Receipt</SheetTitle>
        </SheetHeader>
        <div className="flex-1 p-6 overflow-y-auto">
          <Receipt
            items={items}
            subtotal={subtotal}
            phoneNumber={phoneNumber}
          />
        </div>
        <div className="p-6 border-t">
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={() => window.print()}
              variant="outline"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Receipt
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                const receiptText = document.querySelector('pre')?.textContent
                if (receiptText) {
                  window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(receiptText)}`)
                }
              }}
            >
              <Share className="w-4 h-4 mr-2" />
              Share Receipt
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="px-6 py-4 border-b">
        <SheetTitle>Checkout</SheetTitle>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-6">
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <div className="relative h-full w-full">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.id}
                    width={96}
                    height={96}
                    className="object-cover object-center"
                    fill
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between text-base font-medium">
                  <h3>{item.customer}</h3>
                  <p className="ml-4">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(item.total * item.quantity)}
                  </p>
                </div>
                <p className="mt-1 text-sm text-gray-500">Order ID: {item.id}</p>
                <div className="flex flex-1 items-end justify-between text-sm">
                  <p>Qty {item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t bg-white p-6 space-y-4">
        <div className="space-y-4">
          <Input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Coupon Code (Optional)"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD"
            }).format(subtotal)}</span>
          </div>
          {couponCode && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-$0.00</span>
            </div>
          )}
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD"
            }).format(subtotal)}</span>
          </div>
        </div>
        <Button
          className="w-full"
          size="lg"
          onClick={handleCheckout}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Checkout"}
        </Button>
        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}
      </div>
    </div>
  )
}
