import type { Metadata } from 'next'
import { FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms and Conditions — ExamPrep',
  description: 'Terms and conditions for using ExamPrep, the exam paper and solutions platform for MAKAUT engineering students.',
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
          <FileText className="size-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Terms and Conditions</h1>
        <p className="text-sm text-muted-foreground">Last updated: February 2026</p>
      </div>

      <div className="prose prose-sm prose-zinc max-w-none space-y-8 text-sm text-foreground">

        <section className="space-y-3">
          <h2 className="text-base font-semibold">1. About ExamPrep</h2>
          <p className="text-muted-foreground leading-relaxed">
            ExamPrep (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is an online educational platform that provides access to
            question papers and detailed worked solutions for engineering students of Maulana Abul
            Kalam Azad University of Technology (MAKAUT). By accessing or using our website, you
            agree to be bound by these Terms and Conditions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">2. Eligibility</h2>
          <p className="text-muted-foreground leading-relaxed">
            You must be at least 13 years of age to use ExamPrep. By using this platform, you
            represent that you are capable of entering into a binding agreement and are not barred
            from receiving services under applicable law. The platform is intended primarily for
            current and former MAKAUT engineering students.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">3. User Accounts</h2>
          <p className="text-muted-foreground leading-relaxed">
            You must create an account to purchase and access solutions. You are responsible for
            maintaining the confidentiality of your login credentials and for all activity that
            occurs under your account. You must provide accurate information during registration.
            We reserve the right to suspend or terminate accounts that violate these terms.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Access to purchased content is tied to your account and is for single-device use.
            Sharing your account credentials with others is prohibited. We actively monitor for
            concurrent sessions across multiple devices and may terminate sessions that appear to
            involve account sharing.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">4. Purchases and Payments</h2>
          <p className="text-muted-foreground leading-relaxed">
            Access to answer solutions is sold on a per-paper basis at a one-time price of ₹99
            (or the price displayed at the time of purchase). Once a purchase is completed, you
            receive lifetime access to the solutions for that specific paper under your account.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            All payments are processed securely through Razorpay. We do not store your payment
            card details on our servers. Prices are inclusive of applicable taxes. We reserve the
            right to change pricing at any time; however, any changes will not affect purchases
            already completed.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">5. Digital Content and Intellectual Property</h2>
          <p className="text-muted-foreground leading-relaxed">
            All content on ExamPrep — including question papers, worked solutions, explanations,
            mathematical workings, and key points — is the intellectual property of ExamPrep or
            its content contributors. Your purchase grants you a personal, non-transferable,
            non-exclusive licence to view the content for your own private study purposes only.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            You may not copy, reproduce, distribute, screenshot, record, sell, sublicense, or
            otherwise share any content from this platform in any form without our prior written
            consent. Violation of this clause may result in immediate account termination and
            legal action.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">6. Acceptable Use</h2>
          <p className="text-muted-foreground leading-relaxed">
            You agree not to use ExamPrep to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Share purchased content with others for free or for a fee</li>
            <li>Attempt to bypass payment or access protections</li>
            <li>Use automated tools, bots, or scrapers to extract content</li>
            <li>Impersonate another user or submit false information</li>
            <li>Engage in any activity that disrupts or interferes with our services</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">7. Accuracy of Content</h2>
          <p className="text-muted-foreground leading-relaxed">
            We make every effort to ensure that solutions and explanations are accurate. However,
            ExamPrep does not guarantee that all content is error-free. Content is intended as a
            study aid and should not be the sole basis for academic preparation. We are not
            responsible for outcomes in examinations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">8. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            To the maximum extent permitted by law, ExamPrep shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages arising from your use of the
            platform or from any errors in the content provided. Our total liability to you shall
            not exceed the amount paid by you for the specific purchase giving rise to the claim.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">9. Modifications to the Service</h2>
          <p className="text-muted-foreground leading-relaxed">
            We reserve the right to modify, suspend, or discontinue any part of the service at
            any time. We may update these Terms and Conditions periodically. Continued use of
            ExamPrep after such changes constitutes your acceptance of the revised terms. We will
            make reasonable efforts to notify users of significant changes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">10. Governing Law</h2>
          <p className="text-muted-foreground leading-relaxed">
            These Terms and Conditions are governed by the laws of India. Any disputes arising
            from your use of ExamPrep shall be subject to the exclusive jurisdiction of the courts
            of West Bengal, India.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">11. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions about these Terms and Conditions, please contact us through
            our <a href="/contact" className="underline underline-offset-2 hover:text-foreground transition-colors">Contact page</a> or
            raise a <a href="/support" className="underline underline-offset-2 hover:text-foreground transition-colors">support ticket</a>.
          </p>
        </section>

      </div>
    </div>
  )
}
