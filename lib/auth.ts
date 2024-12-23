import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { cache } from 'react'
import { type Database } from '@/types/database'

export const createServerClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
})

export async function auth() {
  const supabase = createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function requireAuth() {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }
  return session
}

export async function signOut() {
  const supabase = createServerClient()
  await supabase.auth.signOut()
}

export async function getUser() {
  const session = await auth()
  return session?.user ?? null
}
