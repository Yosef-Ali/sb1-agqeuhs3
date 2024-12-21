'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartState, CartItem } from '@/types/cart'
import { Product } from '@/types/database'

interface CartStore extends CartState {
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      addItem: (product: Product) => {
        const items = [...get().items]
        const existingItem = items.find(item => item.product.id === product.id)

        if (existingItem) {
          existingItem.quantity += 1
        } else {
          items.push({ product, quantity: 1 })
        }

        set({
          items,
          total: items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
        })
      },
      removeItem: (productId: string) => {
        const items = get().items.filter(item => item.product.id !== productId)
        set({
          items,
          total: items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
        })
      },
      updateQuantity: (productId: string, quantity: number) => {
        const items = get().items.map(item =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        ).filter(item => item.quantity > 0)

        set({
          items,
          total: items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
        })
      },
      clearCart: () => set({ items: [], total: 0 })
    }),
    {
      name: 'cart-storage'
    }
  )
)