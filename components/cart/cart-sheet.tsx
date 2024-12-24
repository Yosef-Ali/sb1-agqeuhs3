"use client"
/* @readonly */

import { useState } from "react"
import { ShoppingCart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import { useCartStore, useCartTotals } from "@/lib/store/cart-store"
import { CartItem } from "@/types/cart"
import { CartItem as CartItemComponent } from "./cart-item"
import { CheckoutDisplay } from "./checkout-display"
import { Separator } from "../ui/separator"
import { toast } from "sonner"
import { Input } from "../ui/input"

export function CartSheet() {
  const [showCheckout, setShowCheckout] = useState(false)
  const [phone, setPhone] = useState("")
  const [coupon, setCoupon] = useState("")
  const [isApplying, setIsApplying] = useState(false)
  const [error, setError] = useState("")
  const [discount, setDiscount] = useState(0)
  
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    isOpen,
    setIsOpen
  } = useCartStore()
  
  const { totalItems, subtotal } = useCartTotals()
  const finalTotal = subtotal - discount

  const validatePhone = (phone: string) => {
    if (!phone) return true // Allow empty phone number
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    return phoneRegex.test(phone)
  }

  const handleApplyCoupon = async () => {
    if (!validatePhone(phone)) {
      setError("Please enter a valid phone number")
      return
    }

    setIsApplying(true)
    try {
      // Simulate API call to validate coupon
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Add your coupon validation logic here
      toast.success("Coupon applied successfully!")
    } catch (err) {
      toast.error("Invalid coupon code")
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-full sm:max-w-lg border-none p-0">
        {!showCheckout ? (
          <>
            <SheetHeader className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <SheetTitle>Shopping Cart ({totalItems})</SheetTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="h-8 px-3"
                >
                  Clear Cart
                </Button>
              </div>
            </SheetHeader>
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto pb-32"> {/* Add bottom padding */}
                {items.length === 0 ? (
                  <div className="flex h-[400px] flex-col items-center justify-center space-y-2">
                    <ShoppingCart className="h-12 w-12 text-gray-400" />
                    <p className="text-lg font-medium text-gray-900">Your cart is empty</p>
                    <p className="text-gray-500">Add items to get started</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {items.map((item) => (
                      <CartItemComponent
                        key={item.id}
                        {...item}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeItem}
                      />
                    ))}
                  </div>
                )}
              </div>
              <Separator />
              <div className="p-4 flex items-center justify-between bg-gray-50">
                <p className="text-sm font-medium">Subtotal</p>
                <p className="font-medium text-lg">${subtotal.toFixed(2)}</p>
              </div>
              <Separator />

              {items.length > 0 && (
                <div className="p-4 space-y-6">
                  {/* Coupon Section */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Have a coupon?</p>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter coupon code"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={handleApplyCoupon}
                        disabled={!coupon || isApplying}
                      >
                        {isApplying ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          'Apply'
                        )}
                      </Button>
                    </div>
                    {discount > 0 && (
                      <p className="text-sm text-green-600">
                        Coupon applied! You saved ${discount.toFixed(2)}
                      </p>
                    )}
                  </div>

                  {/* Customer Information */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Contact Information</p>
                    <Input
                      type="tel"
                      placeholder="Phone number"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value)
                        setError("")
                      }}
                      className={error ? "border-red-500" : ""}
                    />
                    {error && (
                      <p className="text-sm text-red-500">{error}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Order Summary */}
              {items.length > 0 && (
                <div className="border-t p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div className="border-t bg-white sticky bottom-0 p-4">
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    onClick={() => setShowCheckout(true)}
                    disabled={items.length === 0}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white"
                  >
                    {items.length === 0 
                      ? 'Your cart is empty'
                      : `Checkout • $${finalTotal.toFixed(2)}`}
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <CheckoutDisplay
            items={items}
            subtotal={subtotal}
            clearCart={clearCart}
            onBack={() => setShowCheckout(false)}
            phone={phone}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
