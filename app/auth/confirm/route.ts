import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Server-side auth code exchange handler.
 * Supabase redirects here after verifying the PKCE token from password reset emails.
 * We exchange the code for a session server-side (cookie-based), then redirect
 * to the actual reset password form — clean, no code in the URL.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Code missing or exchange failed — send back to forgot password with error flag
  return NextResponse.redirect(`${origin}/forgot-password?error=expired`)
}
