import { create } from 'zustand'
import { toast } from "sonner"

export type CartItem = {
  id: string
  customer: string
  status: string
  total: number
  image?: string
  quantity: number
  createdAt?: Date
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  loading: boolean
  error: string | null
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setIsOpen: (open: boolean) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  loading: false,
  error: null,
  addItem: async (newItem) => {
    try {
      set({ loading: true, error: null })
      const existingItem = get().items.find(item => item.id === newItem.id)
      
      if (existingItem) {
        set((state) => ({
          items: state.items.map(item =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          loading: false
        }))
        toast.info("Item already in cart", {
          description: "Quantity has been increased"
        })
        return
      }
      
      set((state) => ({ 
        items: [...state.items, { ...newItem, quantity: 1, createdAt: new Date() }],
        isOpen: true,
        loading: false
      }))
      toast.success("Added to cart", {
        description: `${newItem.id} has been added to your cart`
      })
    } catch (err) {
      set({ error: err.message, loading: false })
      toast.error("Failed to add item", {
        description: err.message
      })
    }
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
