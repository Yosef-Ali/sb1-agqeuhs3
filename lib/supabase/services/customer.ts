import { createServerClient } from '@/lib/supabase/server'
import { Customer } from '@/lib/supabase/types'

export async function getCustomers() {
  const supabase = createServerClient()
  const { data: customers, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Error fetching customers: ${error.message}`)
  }

  return customers
}

export async function getCustomer(id: string) {
  const supabase = createServerClient()
  const { data: customer, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(`Error fetching customer: ${error.message}`)
  }

  return customer
}

export async function createCustomer(customer: Partial<Customer>) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('customers')
    .insert(customer)
    .select()
    .single()

  if (error) {
    throw new Error(`Error creating customer: ${error.message}`)
  }

  return data
}

export async function updateCustomer(id: string, customer: Partial<Customer>) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('customers')
    .update(customer)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Error updating customer: ${error.message}`)
  }

  return data
}

export async function deleteCustomer(id: string) {
  const supabase = createServerClient()
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Error deleting customer: ${error.message}`)
  }
}
