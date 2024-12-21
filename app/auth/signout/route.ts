import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { type CookieOptions } from '@supabase/auth-helpers-nextjs'

export async function POST(request: Request) {
  const cookieStore = cookies()

  const supabase = createRouteHandlerClient(
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  await supabase.auth.signOut()

  return NextResponse.redirect(new URL('/', request.url), {
    status: 302,
  })
}
