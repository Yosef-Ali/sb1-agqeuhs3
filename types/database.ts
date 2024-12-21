export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          stock_quantity: number
          category: string | null
          image_url: string | null
          organic: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          stock_quantity?: number
          category?: string | null
          image_url?: string | null
          organic?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          stock_quantity?: number
          category?: string | null
          image_url?: string | null
          organic?: boolean
          created_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          full_name: string | null
          address: string | null
          phone: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          address?: string | null
          phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          address?: string | null
          phone?: string | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          status: string
          total_amount: number
          delivery_address: string
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          status?: string
          total_amount: number
          delivery_address: string
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          status?: string
          total_amount?: number
          delivery_address?: string
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price_at_time: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price_at_time: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price_at_time?: number
        }
      }
    }
  }
}