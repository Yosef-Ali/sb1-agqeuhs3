"use client"

import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCartStore, useCartTotals } from "@/lib/store/cart-store"
import { CheckoutDisplay } from "../orders/checkout-display"

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
                <div key={item.id} className="flex gap-4 p-6">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={item.image || "/placeholder.png"}
                      alt={item.id}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between text-base font-medium">
                      <h3>{item.customer}</h3>
                      <p className="ml-4">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(Number(item.total) * item.quantity)}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Order ID: {item.id}</p>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {items.length > 0 && (
          <div className="sticky bottom-0 border-t p-6 space-y-4 bg-white">
            <CheckoutDisplay />
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
