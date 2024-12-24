import { create } from 'zustand'
import { toast } from "sonner"
import { CartItem, CartState } from '@/types/cart'

interface CartStore extends CartState {
  isOpen: boolean
  loading: boolean
  error: string | null
  setIsOpen: (open: boolean) => void
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  total: 0, // Add this line to match CartState interface
  isOpen: false,
  loading: false,
  error: null,
  addItem: async (newItem) => {
    try {
      set({ loading: true, error: null })
      const existingItem = get().items.find(item => item.id === newItem.id)
      const currentTotal = get().total
      
      if (existingItem) {
        set((state) => ({
          items: state.items.map(item =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: currentTotal + newItem.total,
          loading: false
        }))
        toast("Quantity updated") // Fixed toast call
        return
      }
      
      set((state) => ({ 
        items: [...state.items, { ...newItem, quantity: 1, createdAt: new Date() }],
        total: currentTotal + newItem.total,
        isOpen: true,
        loading: false
      }))
      toast("Added to cart") // Fixed toast call
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add item"
      set({ error: errorMessage, loading: false })
      toast.error(errorMessage)
    }
  },
  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter(item => item.id !== id)
    }))
    toast("Removed from cart") // Fixed toast call
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
    toast("Cart cleared") // Fixed toast call
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
