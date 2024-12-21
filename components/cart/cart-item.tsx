'use client'

import { CartItem as CartItemType } from '@/types/cart'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()
  const { product, quantity } = item

  return (
    <div className="flex items-center gap-4 py-4">
      <div className="relative h-20 w-20">
        <Image
          src={product.image_url || '/placeholder.png'}
          alt={product.name}
          fill
          className="object-cover rounded"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateQuantity(product.id, quantity - 1)}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateQuantity(product.id, quantity + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => removeItem(product.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}