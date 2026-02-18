'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'
import type { RazorpayPaymentResponse } from '@/types/razorpay'

interface BuyButtonProps {
  paperId: string
  price: number // in paisa
  paperTitle: string
  className?: string
}

export function BuyButton({ paperId, price, paperTitle, className }: BuyButtonProps) {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // Load Razorpay checkout script once on mount
  useEffect(() => {
    if (document.getElementById('razorpay-script')) {
      setScriptLoaded(true)
      return
    }
    const script = document.createElement('script')
    script.id = 'razorpay-script'
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => setScriptLoaded(true)
    document.body.appendChild(script)
  }, [])

  const handleBuy = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (!scriptLoaded) return

    setLoading(true)

    try {
      // 1. Create order server-side
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paperId }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Failed to create order. Please try again.')
        setLoading(false)
        return
      }

      // 2. Open Razorpay checkout modal
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: data.amount,
        currency: data.currency,
        name: 'ExamPrep',
        description: paperTitle,
        order_id: data.orderId,
        prefill: {
          email: user.email,
        },
        theme: {
          color: '#18181b', // zinc-900
        },
        handler: async (response: RazorpayPaymentResponse) => {
          // 3. Verify payment server-side before granting access
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })

          if (verifyRes.ok) {
            router.push(`/payment/success?paperId=${paperId}&returnUrl=${encodeURIComponent(pathname)}`)
          } else {
            alert('Payment verification failed. Please contact support.')
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      })

      rzp.open()
    } catch (err) {
      console.error(err)
      alert('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  // Unauthenticated state — prompt sign in
  if (!user) {
    return (
      <Button className={className} onClick={() => router.push('/login')}>
        Sign in to unlock — ₹{price / 100}
      </Button>
    )
  }

  return (
    <Button
      className={className}
      onClick={handleBuy}
      disabled={loading || !scriptLoaded}
    >
      {loading ? (
        <>
          <Loader2 className="size-4 mr-2 animate-spin" />
          Opening payment…
        </>
      ) : (
        `Unlock Answers — ₹${price / 100}`
      )}
    </Button>
  )
}
