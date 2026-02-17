import Razorpay from 'razorpay'
import crypto from 'crypto'

/**
 * Server-side Razorpay client.
 * ONLY import in API Route Handlers — never in client components.
 */
export const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

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
