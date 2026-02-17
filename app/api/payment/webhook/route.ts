import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Razorpay Webhook — handles payment lifecycle events.
 *
 * To set up: in Razorpay dashboard → Settings → Webhooks, add:
 *   URL: https://<your-domain>/api/payment/webhook
 *   Events: payment.captured
 *   Secret: set RAZORPAY_WEBHOOK_SECRET env var to the same secret
 *
 * This acts as a fallback for cases where the client-side /verify call fails
 * (e.g. user closes tab after payment completes).
 */

function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')
  return crypto.timingSafeEqual(
    Buffer.from(expectedSig, 'hex'),
    Buffer.from(signature, 'hex')
  )
}

export async function POST(request: NextRequest) {
  // 1. Read raw body for signature verification (must come before any parsing)
  const rawBody = await request.text()
  const signature = request.headers.get('x-razorpay-signature') ?? ''

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('[webhook] RAZORPAY_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  // 2. Verify webhook signature
  let isValid = false
  try {
    isValid = verifyWebhookSignature(rawBody, signature, webhookSecret)
  } catch {
    isValid = false
  }

  if (!isValid) {
    console.warn('[webhook] invalid signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // 3. Parse event payload
  let event: { event: string; payload: Record<string, unknown> }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // 4. Handle payment.captured — mark purchase as paid
  if (event.event === 'payment.captured') {
    const paymentEntity = (event.payload as {
      payment?: { entity?: { id?: string; order_id?: string } }
    })?.payment?.entity

    const paymentId = paymentEntity?.id
    const orderId = paymentEntity?.order_id

    if (!paymentId || !orderId) {
      console.error('[webhook] missing payment_id or order_id in payload')
      return NextResponse.json({ error: 'Bad payload' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { error } = await admin
      .from('purchases')
      .update({ status: 'paid', razorpay_payment_id: paymentId })
      .eq('razorpay_order_id', orderId)
      .neq('status', 'paid') // idempotent — don't overwrite if already paid

    if (error) {
      console.error('[webhook] db update error:', error.message)
      // Return 500 so Razorpay retries the webhook
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    console.log('[webhook] payment.captured processed:', orderId, paymentId)
  }

  // Return 200 for all events (even unhandled ones) to acknowledge receipt
  return NextResponse.json({ received: true })
}
