import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

/**
 * Next.js Proxy — runs on every request before it reaches a page or API route.
 * Responsible for refreshing Supabase auth sessions stored in cookies.
 *
 * The matcher below excludes static files and Next.js internals so the proxy
 * only runs on real page/API requests.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static  (static assets)
     * - _next/image   (image optimization)
     * - favicon.ico
     * - Public image formats
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
