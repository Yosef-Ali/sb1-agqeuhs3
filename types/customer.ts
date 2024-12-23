export interface Customer {
  id: string
  full_name: string | null
  email: string
  address?: string | null
  phone: string | null
  created_at: string
  updated_at?: string
}

export type CustomerFormValues = {
  fullName: string
  email: string
  phone: string | null
}
