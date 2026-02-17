import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Session refresh proxy utility.
 * Called by the root proxy.ts on every request to keep auth tokens fresh.
 *
 * Uses getClaims() (local JWT validation — no network call) to check the user.
 * For routes that need server-verified session validity, use getUser() instead.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // Always create a fresh client per request — never cache in a global variable.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do not add any code between createServerClient and getClaims().
  // getClaims() validates the JWT signature locally — fast, no network call.
  // If you need to verify the session is still active server-side, use getUser() instead.
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  const { pathname } = request.nextUrl

  // Redirect unauthenticated users away from protected routes
  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/payment')

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect already-logged-in users away from auth pages
  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup')

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: Always return supabaseResponse as-is (or copy its cookies).
  // Never create a new NextResponse.next() without copying supabaseResponse.cookies.
  return supabaseResponse
}
