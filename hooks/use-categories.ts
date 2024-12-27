import { useEffect, useState } from 'react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Category } from '@/lib/supabase/types'  // Import Category from types

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true })

        if (error) {
          throw error
        }

        setCategories(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch categories'
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, isLoading, error }
}