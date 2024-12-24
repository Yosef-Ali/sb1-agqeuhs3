"use client"
/* @readonly */

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
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

export function CartSheet() {
  const [showCheckout, setShowCheckout] = useState(false)
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    isOpen,
    setIsOpen
  } = useCartStore()
  const { totalItems, subtotal } = useCartTotals()

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
              <div className="border-t bg-white sticky bottom-0 p-4">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => setShowCheckout(true)}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </>
        ) : (
          <CheckoutDisplay 
            items={items} 
            subtotal={subtotal} 
            clearCart={clearCart}
            onBack={() => setShowCheckout(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
