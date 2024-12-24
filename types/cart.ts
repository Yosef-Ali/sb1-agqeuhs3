import { Product } from './database'

export type CartItem = {
  id: string
  customer: string
  status: "pending" | "processing" | "completed" | "cancelled"
  total: number
  quantity: number
  image?: string
  createdAt?: Date
  product?: Product
}

export interface CartState {
  items: CartItem[]
  total: number
}
