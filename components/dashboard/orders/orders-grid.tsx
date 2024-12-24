"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"

type Order = {
  id: string
  customer: string
  status: "pending" | "processing" | "completed" | "cancelled"
  total: number
  date: string
  image?: string // Added for product image
}

interface OrdersGridProps {
  data: Order[]
}

export function OrdersGrid({ data }: OrdersGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {data.map((order) => (
        <div
          key={order.id}
          className="relative rounded-lg border p-4 hover:shadow-md transition-shadow"
        >
          <div className="aspect-square relative mb-2">
            <Image
              src={order.image || "/placeholder.png"}
              alt={`Order ${order.id}`}
              fill
              className="object-cover rounded-md"
            />
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
  )
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
