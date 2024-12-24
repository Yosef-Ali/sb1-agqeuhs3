"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCartStore, useCartTotals } from "@/lib/store/cart-store"
import { CheckoutDisplay } from "../dashboard/orders/checkout-display"
import { CartItem } from "./cart-item"

export function CartSheet() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    isOpen,
    setIsOpen
  } = useCartStore()
  const { totalItems, subtotal } = useCartTotals()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [showReceipt, setShowReceipt] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-full sm:max-w-lg border-none p-0">
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
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex h-[400px] flex-col items-center justify-center space-y-2">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
              <p className="text-lg font-medium text-gray-900">Your cart is empty</p>
              <p className="text-gray-500">Add items to get started.</p>
            </div>
          ) : (
            <div className="divide-y">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  {...item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex-1" />
        {items.length > 0 && (
          <SheetFooter className="border-t bg-white">
            <div className="w-full p-6 space-y-4">
              <CheckoutDisplay
                items={items}
                subtotal={subtotal}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                showReceipt={showReceipt}
                setShowReceipt={setShowReceipt}
                onNewOrder={() => {
                  clearCart()
                  setIsOpen(false)
                }}
                clearCart={clearCart}
              />
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
