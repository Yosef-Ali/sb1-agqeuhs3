import { CartItem } from "@/lib/store/cart-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
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
  return (
    <div className="border-t">
      <div className="p-6 space-y-4">
        <div className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
            <Input 
              id="phone" 
              placeholder="Enter your phone number"
              className="h-9"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="coupon" className="text-sm font-medium">Coupon Code</label>
            <div className="flex space-x-2">
              <Input 
                id="coupon" 
                placeholder="Enter coupon code"
                className="h-9"
              />
              <Button variant="outline" size="sm" className="h-9">
                Apply
              </Button>
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="font-medium">Subtotal</span>
          <span>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(subtotal)}
          </span>
        </div>
      </div>
      <Separator />
      <div className="p-6">
        <div className="flex justify-between font-medium text-lg">
          <span>Total</span>
          <span>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(subtotal)}
          </span>
        </div>
      </div>
      <div className="grid gap-2 px-6 pb-6">
        {!showReceipt ? (
          <Button 
            className="w-full" 
            size="lg"
            onClick={() => setShowReceipt(true)}
          >
            Checkout
          </Button>
        ) : (
          <div className="space-y-4">
            <Receipt 
              items={items}
              subtotal={subtotal}
              phoneNumber={phoneNumber}
            />
            <div className="flex gap-2">
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
                  const receiptText = document.querySelector('pre')?.textContent
                  if (receiptText) {
                    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(receiptText)}`)
                  }
                }}
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setShowReceipt(false)
                onNewOrder()
              }}
            >
              New Order
            </Button>
          </div>
        )}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={clearCart}
        >
          Clear Cart
        </Button>
      </div>
    </div>
  )
}
