import type { Metadata } from 'next'
import { Mail, MessageSquare, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Contact Us — ExamPrep',
  description: 'Get in touch with the ExamPrep team. We\'re here to help MAKAUT engineering students.',
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="size-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Contact Us</h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          Have a question, found an issue, or need help with a purchase? We&apos;re here to help.
        </p>
      </div>

      <div className="space-y-4">

        {/* Primary CTA — Support Ticket */}
        <div className="rounded-lg border bg-card p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 shrink-0">
              <MessageSquare className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">Raise a Support Ticket</p>
              <p className="text-xs text-muted-foreground">For payment issues, access problems, or content queries</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The fastest way to get help. Describe your issue and we&apos;ll get back to you as soon as possible.
          </p>
          <Button asChild size="sm" className="w-full">
            <Link href="/support">Open Support Ticket</Link>
          </Button>
        </div>

        {/* Email */}
        <div className="rounded-lg border bg-card p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 shrink-0">
              <Mail className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">Email Us</p>
              <p className="text-xs text-muted-foreground">For general inquiries and feedback</p>
            </div>
          </div>
          <a
            href="mailto:prasadpatewar.pro@gmail.com"
            className="block text-sm font-medium underline underline-offset-2 hover:text-muted-foreground transition-colors"
          >
            prasadpatewar.pro@gmail.com
          </a>
        </div>

        {/* Response time */}
        <div className="rounded-lg border bg-muted/40 p-4 flex items-start gap-3">
          <Clock className="size-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            We typically respond within <span className="font-medium text-foreground">24–48 hours</span> on business days.
            For urgent payment issues where money was deducted but access wasn&apos;t granted,
            we aim to resolve within <span className="font-medium text-foreground">2–4 hours</span>.
          </p>
        </div>

        {/* Quick links */}
        <div className="pt-2 space-y-2">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Quick Links</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link href="/refunds" className="rounded-md border px-3 py-2 text-center hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
              Refund Policy
            </Link>
            <Link href="/shipping" className="rounded-md border px-3 py-2 text-center hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
              Delivery Policy
            </Link>
            <Link href="/terms" className="rounded-md border px-3 py-2 text-center hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
              Terms &amp; Conditions
            </Link>
            <Link href="/privacy" className="rounded-md border px-3 py-2 text-center hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
