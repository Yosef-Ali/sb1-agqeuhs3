import { Product } from './database'

export interface CartItem {
  id: string
  customer: string
  status: "pending" | "processing" | "completed" | "cancelled"
  total: number
  quantity: number
  image?: string
  product?: Product // Keep this if you need it for backward compatibility
}

export interface CartState {
  items: CartItem[]
  total: number
}