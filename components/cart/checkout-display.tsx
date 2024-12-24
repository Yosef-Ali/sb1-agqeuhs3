"use client"

import { Printer, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartItem } from "@/lib/store/cart-store"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { toast } from "sonner"

interface CheckoutDisplayProps {
  items: CartItem[]
  subtotal: number
  clearCart: () => void
  onBack: () => void
}

export function CheckoutDisplay({
  items,
  subtotal,
  clearCart
}: CheckoutDisplayProps) {
  const [showPOSReceipt, setShowPOSReceipt] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const currentDate = new Date().toLocaleDateString()
  const orderNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')

  const handleCheckout = async () => {
    try {
      setIsProcessing(true)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setShowPOSReceipt(true)
      clearCart()
      toast.success("Order placed successfully!")
    } catch (err) {
      toast.error("Checkout failed")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="px-6 py-4 border-b">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mr-2"
          >
            ←
          </Button>
          <SheetTitle>Checkout</SheetTitle>
        </div>
      </SheetHeader>
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
