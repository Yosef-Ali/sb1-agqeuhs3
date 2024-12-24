import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { cache } from 'react'
import { type Database } from '@/types/database'

export const createServerClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
})

// Cache auth results for 1 minute
const AUTH_CACHE = new Map<string, { user: any; timestamp: number }>()
const CACHE_TTL = 60 * 1000 // 1 minute in milliseconds

export async function auth() {
  const supabase = createServerClient()
  
  // Check cache first
  const cached = AUTH_CACHE.get('currentUser')
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.user
  }

  // If not in cache or expired, fetch from Supabase
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  
  // Update cache
  AUTH_CACHE.set('currentUser', {
    user,
    timestamp: Date.now()
  })
  
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
  return auth() // Reuse the cached auth function
}
function redirect(path: string) {
  const error = new Error('Redirect');
  error.stack = `${error.name}: ${error.message}\n    at redirect (${path})`;
  throw error;
}

