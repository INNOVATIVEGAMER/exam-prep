import { createClient } from '@supabase/supabase-js'

/**
 * Admin Supabase client — bypasses Row Level Security.
 * Uses the secret key (sb_secret_xxx).
 *
 * ONLY use in API Route Handlers (server-side).
 * NEVER import in Client Components or expose to the browser.
 *
 * Used for:
 * - Creating Razorpay orders (inserting purchase rows)
 * - Verifying payments and updating purchase status
 * - Seeding data
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  )
}
