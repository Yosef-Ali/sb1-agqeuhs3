"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Verify user authentication state using getUser
      const { data: { user } } = await supabase.auth.getUser()

      if (!user && event === 'SIGNED_OUT') {
        router.push('/auth')
      }
      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  return <>{children}</>
}
