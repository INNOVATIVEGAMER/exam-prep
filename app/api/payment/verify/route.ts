import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifySignature } from '@/lib/razorpay'

export async function POST(request: NextRequest) {
  try {
    // 1. Verify auth — getUser() validates token server-side with Supabase auth
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse and validate request body
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await request.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
    }

    // 3. Verify HMAC-SHA256 signature to confirm payment legitimacy
    const isValid = verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    )

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // 4. Update purchase row to 'paid' — scoped to this user's order
    const admin = createAdminClient()
    const { error: updateError } = await admin
      .from('purchases')
      .update({
        status: 'paid',
        razorpay_payment_id,
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .eq('user_id', user.id)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update purchase' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[payment/verify]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
