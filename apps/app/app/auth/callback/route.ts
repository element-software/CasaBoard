import { NextResponse } from 'next/server'
import { SupabaseServer } from '@repo/lib'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('redirectTo') ?? '/auth/setup'
  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/auth/setup'
  }

  if (code) {
    const supabase = await SupabaseServer.createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        next = `${origin}${next}`
      } else if (forwardedHost) {
        next = `https://${forwardedHost}${next}`
      } else {
        next = `${origin}${next}`
      }
      return NextResponse.redirect(next)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
