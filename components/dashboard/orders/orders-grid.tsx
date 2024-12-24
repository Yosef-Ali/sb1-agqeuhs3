"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"
import { CheckoutDisplay } from "./checkout-display"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { useCartStore, useCartTotals } from "@/lib/store/cart-store"
import { Separator } from "@/components/ui/separator"
import { Receipt } from "./receipt"

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
  const [phoneNumber, setPhoneNumber] = useState("")
  const [showReceipt, setShowReceipt] = useState(false)
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
        <SheetContent side="right" className="w-full sm:max-w-lg border-none p-0">
          <SheetHeader className="px-6 py-4 border-b">
            <div className="flex items-center gap-2">
              <SheetTitle>Shopping Cart ({totalItems})</SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearCart}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
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
          <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
            <div className="flex-1 overflow-y-auto">
              {items.length > 0 && (
                <div className="divide-y">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-6">
                      {/* ... existing item content ... */}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {items.length > 0 && (
              <div className="sticky bottom-0 border-t p-6 space-y-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Coupon Code (Optional)"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD"
                    }).format(subtotal)}</span>
                  </div>
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
                  onClick={() => setShowReceipt(true)}
                >
                  Proceed to Checkout
                </Button>
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
              onClick={() => {
                addItem({
                  id: order.id,
                  customer: order.customer,
                  status: order.status,
                  total: order.total,
                  image: order.image || "/placeholder.png"
                })
              }}
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
