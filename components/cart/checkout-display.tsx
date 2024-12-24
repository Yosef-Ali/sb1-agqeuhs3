"use client"

import { useState } from "react"
import { CartItem } from "@/lib/store/cart-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Receipt } from "../dashboard/orders/receipt"
import { toast } from "sonner"

interface CheckoutDisplayProps {
  items: CartItem[]
  subtotal: number
  onNewOrder: () => void
  clearCart: () => void
}

export function CheckoutDisplay({
  items,
  subtotal,
  onNewOrder,
  clearCart,
}: CheckoutDisplayProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [couponCode, setCouponCode] = useState("")
  const [showReceipt, setShowReceipt] = useState(false)
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
      <Receipt
        items={items}
        subtotal={subtotal}
        phoneNumber={phoneNumber}
      />
    )
  }

  return (
    <div className="p-6 space-y-4">
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
  )
}
