import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.signOut()

    return NextResponse.redirect(new URL('/', request.url), {
      status: 302,
    })
  } catch (error) {
    console.error('Signout error:', error)
    return new NextResponse('Signout error', { status: 500 })
  }
}
