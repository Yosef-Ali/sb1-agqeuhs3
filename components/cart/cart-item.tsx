"use client"

import Image from "next/image"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CartItemProps {
  id: string
  customer: string
  status: string
  total: number
  image?: string
  quantity: number
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

export function CartItem({
  id,
  customer,
  status,
  total,
  image,
  quantity,
  onUpdateQuantity,
  onRemove
}: CartItemProps) {
  return (
    <div className="flex gap-4 p-6">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={image || "/placeholder.png"}
          alt={id}
          width={96}
          height={96}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between text-base font-medium">
          <h3>{customer}</h3>
          <p className="ml-4">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(Number(total) * quantity)}
          </p>
        </div>
        <p className="mt-1 text-sm text-gray-500">Order ID: {id}</p>
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(id, quantity - 1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onUpdateQuantity(id, quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(id)}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  )
}
