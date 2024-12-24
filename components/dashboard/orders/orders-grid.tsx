"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

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
      return "warning" as const
    case "processing":
      return "default" as const
    case "completed":
      return "success" as const
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
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Shopping Cart ({cartItems.length})</SheetTitle>
          </SheetHeader>
          <div className="mt-8">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 relative">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.id}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.customer}</p>
                  <p className="text-sm text-gray-500">{item.id}</p>
                  <p className="font-medium">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(item.total)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
            {cartItems.length === 0 && (
              <p className="text-center text-gray-500">Your cart is empty</p>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {data.map((order) => (
          <div
            key={order.id}
            className="relative rounded-lg border p-4 hover:shadow-md transition-all group"
            onMouseEnter={() => setHoveredItem(order.id)}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => addToCart(order)}
          >
            <div className="aspect-square relative mb-2">
              <Image
                src={order.image || "/placeholder.png"}
                alt={`Order ${order.id}`}
                fill
                className="object-cover rounded-md transition-opacity"
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
            <div className="space-y-1">
              <p className="font-medium truncate">{order.customer}</p>
              <p className="text-sm text-gray-500">ID: {order.id}</p>
              <Badge variant={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
              <p className="text-sm font-medium">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(order.total)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
