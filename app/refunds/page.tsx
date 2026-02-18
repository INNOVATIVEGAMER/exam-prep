import type { Metadata } from 'next'
import { RotateCcw } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cancellation and Refund Policy — ExamPrep',
  description: 'Cancellation and refund policy for ExamPrep purchases.',
}

export default function RefundsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
          <RotateCcw className="size-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Cancellation and Refund Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: February 2026</p>
      </div>

      <div className="prose prose-sm prose-zinc max-w-none space-y-8 text-sm text-foreground">

        <section className="space-y-3">
          <h2 className="text-base font-semibold">1. Nature of Our Product</h2>
          <p className="text-muted-foreground leading-relaxed">
            ExamPrep sells access to digital content — specifically, worked solutions and
            answer keys for MAKAUT engineering exam papers. Because the content is delivered
            digitally and is immediately accessible upon purchase, our refund policy reflects
            the nature of this digital delivery.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">2. No Cancellations After Access is Granted</h2>
          <p className="text-muted-foreground leading-relaxed">
            Once a purchase is completed and access to the answer solutions has been granted,
            the transaction <span className="font-medium text-foreground">cannot be cancelled</span>. This
            is because the digital content is consumed at the moment of access — there is no
            way to &quot;return&quot; a digital product that has already been viewed.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We encourage you to review the freely available question paper and confirm it is
            the correct paper for your subject and semester before purchasing the solutions.
            All questions are visible to all users without purchase.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">3. When a Refund May Be Issued</h2>
          <p className="text-muted-foreground leading-relaxed">
            We will issue a full refund in the following circumstances:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Payment deducted but access not granted:</span>{' '}
              If your payment was successfully debited from your account but you were not given
              access to the solutions due to a technical error on our end, you are entitled to
              either immediate access or a full refund at your choice.
            </li>
            <li>
              <span className="font-medium text-foreground">Duplicate charge:</span>{' '}
              If you were charged more than once for the same paper due to a payment processing
              error, we will refund the duplicate amount in full.
            </li>
            <li>
              <span className="font-medium text-foreground">Content significantly different from described:</span>{' '}
              If the solutions provided are materially incorrect or the paper is not as described,
              you may raise a refund request with specific details.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">4. How to Request a Refund</h2>
          <p className="text-muted-foreground leading-relaxed">
            To request a refund, please raise a{' '}
            <a href="/support" className="underline underline-offset-2 hover:text-foreground transition-colors">support ticket</a> within
            7 days of the transaction with the following details:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Your registered email address</li>
            <li>The Razorpay transaction/payment ID (visible in your payment confirmation)</li>
            <li>The paper you purchased</li>
            <li>The reason for the refund request</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            We will review and respond to all refund requests within 3 business days.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">5. Refund Processing Time</h2>
          <p className="text-muted-foreground leading-relaxed">
            Approved refunds are processed through Razorpay and typically reflect in your
            original payment method within 5–7 business days, depending on your bank or
            payment provider. We will notify you by email once the refund has been initiated.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">6. No Subscription — No Recurring Charges</h2>
          <p className="text-muted-foreground leading-relaxed">
            ExamPrep does not offer subscription plans. Every purchase is a one-time payment
            for a specific paper. There are no recurring charges, auto-renewals, or hidden fees.
            You will never be charged without explicitly initiating a purchase on the platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">7. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            For any questions about our refund policy or to initiate a refund request, please
            visit our{' '}
            <a href="/contact" className="underline underline-offset-2 hover:text-foreground transition-colors">Contact page</a> or
            raise a <a href="/support" className="underline underline-offset-2 hover:text-foreground transition-colors">support ticket</a> directly.
          </p>
        </section>

      </div>
    </div>
  )
}
