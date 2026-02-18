import Razorpay from 'razorpay'
import crypto from 'crypto'

/**
 * Server-side Razorpay client — lazily instantiated on first call.
 * ONLY import in API Route Handlers — never in client components.
 */
export function getRazorpay() {
  // Use RAZORPAY_KEY_ID server-side (not exposed to browser).
  // Fall back to NEXT_PUBLIC_ variant for compatibility.
  const key_id =
    process.env.RAZORPAY_KEY_ID ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  const key_secret = process.env.RAZORPAY_KEY_SECRET
  if (!key_id || !key_secret) {
    throw new Error(
      `Razorpay env vars missing: key_id=${!!key_id} key_secret=${!!key_secret}`
    )
  }
  return new Razorpay({ key_id, key_secret })
}

/**
 * Verifies the Razorpay payment signature using HMAC-SHA256.
 * Must be called server-side after payment completion.
 */
export function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const body = `${orderId}|${paymentId}`
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex')
  return expectedSignature === signature
}
