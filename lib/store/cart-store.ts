import { create } from 'zustand'
import { toast } from "sonner"

export type CartItem = {
  id: string
  customer: string
  status: string
  total: number
  image?: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setIsOpen: (open: boolean) => void
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  addItem: (newItem) => {
    set((state) => {
      const existingItem = state.items.find(item => item.id === newItem.id)
      
      if (existingItem) {
        toast.info("Item already in cart", {
          description: "Quantity has been increased"
        })
        return {
          items: state.items.map(item =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      }
      
      toast.success("Added to cart", {
        description: `${newItem.id} has been added to your cart`
      })
      return { 
        items: [...state.items, { ...newItem, quantity: 1 }],
        isOpen: true
      }
    })
  },
  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter(item => item.id !== id)
    }))
    toast.success("Removed from cart")
  },
  updateQuantity: (id, quantity) => {
    if (quantity < 1) {
      get().removeItem(id)
      return
    }
    
    set((state) => ({
      items: state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    }))
  },
  clearCart: () => {
    set({ items: [] })
    toast.success("Cart cleared")
  },
  setIsOpen: (open) => set({ isOpen: open })
}))

export const useCartTotals = () => {
  const items = useCartStore((state) => state.items)
  return {
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + (item.total * item.quantity), 0)
  }
}
