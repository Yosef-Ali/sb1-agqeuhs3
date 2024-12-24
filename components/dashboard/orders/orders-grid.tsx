"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"
import { CheckoutDisplay } from "./checkout-display"
import { CartSheet } from "../cart/cart-sheet"

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
  const { addItem } = useCartStore()

  return (
    <div className="relative">

      <CartSheet />

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
