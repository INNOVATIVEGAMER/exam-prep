// Razorpay Checkout (CDN) type declarations
// These interfaces are exported so they can be imported in components,
// and Window is augmented via declare global.

export interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayPaymentResponse) => void
  prefill?: {
    name?: string
    email?: string
  }
  theme?: {
    color?: string
  }
  modal?: {
    ondismiss?: () => void
  }
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

export interface RazorpayInstance {
  open(): void
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}
