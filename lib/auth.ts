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
  return user
}

export async function requireAuth() {
  const user = await auth()
  if (!user) {
    redirect('/login')
  }
  return user
}

export async function signOut() {
  const supabase = createServerClient()
  await supabase.auth.signOut()
}

export async function getUser() {
  const supabase = createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) return null
  return user
}
