import type { Metadata } from 'next'
import { Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shipping Policy — ExamPrep',
  description: 'Shipping and delivery policy for ExamPrep — instant digital delivery of exam solutions.',
}

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Zap className="size-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Shipping Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: February 2026</p>
      </div>

      <div className="prose prose-sm prose-zinc max-w-none space-y-8 text-sm text-foreground">

        <section className="space-y-3">
          <h2 className="text-base font-semibold">1. Digital Product — No Physical Shipping</h2>
          <p className="text-muted-foreground leading-relaxed">
            ExamPrep is a fully digital platform. We do not sell or ship any physical goods.
            All content — including exam papers, worked solutions, step-by-step explanations,
            and answer keys — is delivered digitally through our website.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            There are no courier services, shipping fees, or delivery timelines associated with
            any purchase made on ExamPrep.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">2. Instant Access Upon Payment</h2>
          <p className="text-muted-foreground leading-relaxed">
            Access to purchased answer solutions is granted <span className="font-medium text-foreground">immediately</span> upon
            successful payment confirmation. There is no waiting period. The moment your payment
            is verified, the locked solutions for that paper are unlocked directly on the page
            — you do not need to refresh or navigate away.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">3. How Access is Delivered</h2>
          <p className="text-muted-foreground leading-relaxed">
            After a successful purchase:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              You are automatically redirected to a payment confirmation page and then back
              to the paper with full answers visible.
            </li>
            <li>
              Access is tied to your ExamPrep account. You can return to the paper at any
              time in the future — there is no expiry on purchased access.
            </li>
            <li>
              All purchased papers are listed in your{' '}
              <a href="/dashboard" className="underline underline-offset-2 hover:text-foreground transition-colors">Dashboard</a>{' '}
              for easy access.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">4. Lifetime Access</h2>
          <p className="text-muted-foreground leading-relaxed">
            Every purchase grants you <span className="font-medium text-foreground">lifetime access</span> to
            the solutions for that paper, as long as your account remains active and in good
            standing. You can revisit, review, and study from your purchased papers as many
            times as you need.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">5. Access Not Received After Payment?</h2>
          <p className="text-muted-foreground leading-relaxed">
            In rare cases, access may not be granted immediately due to a network interruption
            during payment processing. If this happens:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>Wait a few minutes and refresh the paper page — access is typically granted within 2–5 minutes via our automated webhook.</li>
            <li>Check your <a href="/dashboard" className="underline underline-offset-2 hover:text-foreground transition-colors">Dashboard</a> to see if the paper appears in your purchased list.</li>
            <li>
              If access is still not granted within 30 minutes of a confirmed payment, please
              raise a <a href="/support" className="underline underline-offset-2 hover:text-foreground transition-colors">support ticket</a> with
              your transaction reference ID and we will resolve it promptly.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">6. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            For any questions about accessing your purchased content, please visit our{' '}
            <a href="/contact" className="underline underline-offset-2 hover:text-foreground transition-colors">Contact page</a> or
            raise a <a href="/support" className="underline underline-offset-2 hover:text-foreground transition-colors">support ticket</a>.
          </p>
        </section>

      </div>
    </div>
  )
}
