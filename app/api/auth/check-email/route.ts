import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST /api/auth/check-email
 * Body: { email: string }
 * Response: { exists: boolean | null }
 *
 * Calls the check_email_exists() Postgres function (SECURITY DEFINER, service_role only)
 * which queries auth.users. The auth schema isn't exposed via PostgREST directly,
 * so we go through an RPC function instead.
 *
 * This is the only reliable way to distinguish "no account" from "wrong password"
 * since Supabase returns the same "Invalid login credentials" error for both.
 *
 * Returns exists=null on any error so the caller can fail gracefully.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { data, error } = await admin.rpc('check_email_exists', {
      lookup_email: email,
    })

    if (error) {
      console.error('[check-email] rpc error:', error.message)
      return NextResponse.json({ exists: null })
    }

    return NextResponse.json({ exists: data === true })
  } catch (err) {
    console.error('[check-email] unexpected error:', err)
    return NextResponse.json({ exists: null })
  }
}
