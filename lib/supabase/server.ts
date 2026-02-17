import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Server-side Supabase client with cookie management.
 * Uses the publishable key — handles session token refresh via cookies.
 * Use in Server Components, Server Actions, and Route Handlers for auth-aware queries.
 *
 * For admin/service-role operations (bypassing RLS), use createAdminClient() from ./admin.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component — cookies can't be set.
            // This is fine; the proxy.ts handles session refresh.
          }
        },
      },
    }
  )
}
