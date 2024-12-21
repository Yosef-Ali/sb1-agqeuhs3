'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Customer } from '@/lib/supabase/types'

export function useCustomer() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCustomer() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error
        setCustomer(data)
      } catch (error) {
        console.error('Error loading customer:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCustomer()
  }, [])

  return { customer, loading }
}