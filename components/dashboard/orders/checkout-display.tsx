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
  const [showPOSReceipt, setShowPOSReceipt] = useState(false)
  const orderNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
  const currentDate = new Date().toLocaleDateString()

  const handleCheckout = async () => {
    try {
      setIsProcessing(true)
      setError(null)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setShowPOSReceipt(true)
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
  if (showPOSReceipt) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 p-6 space-y-4">
          <div className="text-center space-y-2">
            <h2 className="font-bold text-xl">RECEIPT</h2>
            <p className="text-sm text-gray-500">Order #{orderNumber}</p>
            <p className="text-sm text-gray-500">{currentDate}</p>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <p>{item.customer}</p>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD"
                  }).format(item.total * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD"
                }).format(subtotal)}
              </span>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-500 pt-4">
            <p>Thank you for your purchase!</p>
            <p>Please visit again</p>
          </div>
        </div>
        
        <div className="border-t p-6">
          <div className="flex gap-4">
            <Button
              className="flex-1"
              onClick={() => window.print()}
              variant="outline"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                const receiptText = `Order #${orderNumber}\n${currentDate}\n\n${items.map(item => 
                  `${item.customer} x${item.quantity}: $${item.total * item.quantity}`
                ).join('\n')}\n\nTotal: $${subtotal}\n\nThank you for your purchase!`
                window.open(`https://wa.me/?text=${encodeURIComponent(receiptText)}`)
              }}
            >
              <Share className="w-4 h-4 mr-2" />
              Share
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
