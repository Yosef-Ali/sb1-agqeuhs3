"use client"

"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Minus, Plus } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { useCartStore, useCartTotals } from "@/lib/store/cart-store"
import { Separator } from "@/components/ui/separator"

type Order = {
  id: string
  customer: string
  status: "pending" | "processing" | "completed" | "cancelled"
  total: number
  date: string
  image?: string
}

interface OrdersGridProps {
  data: Order[]
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "secondary" as const
    case "processing":
      return "default" as const
    case "completed":
      return "secondary" as const
    case "cancelled":
      return "destructive" as const
    default:
      return "secondary" as const
  }
}

export function OrdersGrid({ data }: OrdersGridProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const { 
    items, 
    addItem, 
    removeItem, 
    updateQuantity, 
    clearCart,
    isOpen, 
    setIsOpen 
  } = useCartStore()
  const { totalItems, subtotal } = useCartTotals()

  return (
    <div className="relative">

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle className="text-xl font-semibold">Cart ({totalItems})</SheetTitle>
          </SheetHeader>
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-6 border-b">
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
                        }).format(item.total * item.quantity)}
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
              {items.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center space-y-2">
                  <ShoppingCart className="h-12 w-12 text-gray-400" />
                  <p className="text-lg font-medium text-gray-900">Your cart is empty</p>
                  <p className="text-gray-500">Add items to get started.</p>
                </div>
              )}
            </div>
            {items.length > 0 && (
              <div className="border-t">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Subtotal</span>
                    <span>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Shipping</span>
                    <span>Free</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(subtotal)}
                  </span>
                </div>
                <div className="grid gap-2 px-6 pb-6">
                  <Button className="w-full" size="lg">
                    Checkout
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((order) => (
          <div
            key={order.id}
            className="group relative overflow-hidden rounded-lg border bg-white"
            onMouseEnter={() => setHoveredItem(order.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <button 
              onClick={() => addItem(order)}
              className="w-full aspect-square overflow-hidden"
            >
              <Image
                src={order.image || "/placeholder.png"}
                alt={`Order ${order.id}`}
                width={400}
                height={400}
                className="object-cover transition-transform group-hover:scale-105"
              />
              {hoveredItem === order.id && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-4 rounded-md">
                  <p className="font-medium text-center mb-2">{order.customer}</p>
                  <p className="text-sm mb-2">{order.id}</p>
                  <Badge variant={getStatusColor(order.status)} className="mb-2">
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  <p className="font-medium mb-4">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(order.total)}
                  </p>
                  <div className="w-full flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </div>
                </div>
              )}
            </button>
            <p className="text-sm text-center text-gray-500 py-2">Click image to add to cart</p>
          </div>
        ))}
      </div>
    </div>
  )
}
