"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { toast } from "sonner"

export type CartItem = {
  id: string
  customer: string
  status: string
  total: number
  image?: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  totalItems: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === newItem.id)
      
      if (existingItem) {
        toast.info("Item already in cart", {
          description: "Quantity has been increased"
        })
        return currentItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      
      toast.success("Added to cart", {
        description: `${newItem.id} has been added to your cart`
      })
      return [...currentItems, { ...newItem, quantity: 1 }]
    })
    setIsOpen(true)
  }

  const removeItem = (id: string) => {
    setItems(items => items.filter(item => item.id !== id))
    toast.success("Removed from cart")
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id)
      return
    }
    
    setItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
    toast.success("Cart cleared")
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + (item.total * item.quantity), 0)

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isOpen,
      setIsOpen,
      totalItems,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error(
      "useCart hook must be used within a CartProvider component. " +
      "Wrap your component tree with <CartProvider>...</CartProvider>"
    )
  }
  return context
}
