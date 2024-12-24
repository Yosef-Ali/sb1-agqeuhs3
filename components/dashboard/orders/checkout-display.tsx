import { useState } from "react"
import { CartItem } from "@/lib/store/cart-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Printer, Share } from "lucide-react"
import { Receipt } from "./receipt"

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
      
      // Validate phone number
      if (!phoneNumber || phoneNumber.length < 10) {
        throw new Error("Please enter a valid phone number")
      }

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
    <div className="space-y-6">
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
        disabled={isProcessing || !phoneNumber}
      >
        {isProcessing ? "Processing..." : "Checkout"}
      </Button>
      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}
    </div>
  )
}
