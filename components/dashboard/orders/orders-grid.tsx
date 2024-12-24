"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"

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
  const [cartItems, setCartItems] = useState<Order[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { toast } = useToast()

  const addToCart = (order: Order) => {
    setCartItems([...cartItems, order])
    setIsCartOpen(true)
    toast({
      title: "Added to cart",
      description: `${order.id} has been added to your cart`,
    })
  }

  const removeFromCart = (orderId: string) => {
    setCartItems(cartItems.filter(item => item.id !== orderId))
  }

  return (
    <div className="relative">
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Shopping Cart ({cartItems.length} items)</SheetTitle>
          </SheetHeader>
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto py-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 py-6 border-b">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
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
                        }).format(item.total)}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Order ID: {item.id}</p>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <Badge variant={getStatusColor(item.status)}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromCart(item.id);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {cartItems.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center space-y-2">
                  <ShoppingCart className="h-12 w-12 text-gray-400" />
                  <p className="text-lg font-medium text-gray-900">Your cart is empty</p>
                  <p className="text-gray-500">Add items to get started.</p>
                </div>
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="border-t px-4 py-6 sm:px-6">
                <div className="flex justify-between text-base font-medium">
                  <p>Subtotal</p>
                  <p>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(cartItems.reduce((total, item) => total + item.total, 0))}
                  </p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6">
                  <Button className="w-full" size="lg">
                    Checkout
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
            <div className="aspect-square overflow-hidden">
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
                  <Button size="sm" className="w-full">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              )}
            </div>
            <p className="text-sm text-center text-gray-500">Click to view details</p>
          </div>
        ))}
      </div>
    </div>
  )
}
