import { Database } from '@/types/database'

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export type Product = Tables<'products'>
export type Customer = Tables<'customers'>
export type Order = Tables<'orders'>
export type OrderItem = Tables<'order_items'>

export type ProductWithDetails = Product
