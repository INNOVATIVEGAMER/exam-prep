import type { Metadata } from 'next'
import { FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms and Conditions — NehaNotes',
  description: 'Terms and conditions for using NehaNotes, the exam paper and solutions platform for MAKAUT engineering students.',
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
          <h2 className="text-base font-semibold">1. About NehaNotes</h2>
          <p className="text-muted-foreground leading-relaxed">
            NehaNotes (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a free online educational platform that provides access to
            question papers and detailed worked solutions for engineering students of Maulana Abul
            Kalam Azad University of Technology (MAKAUT). By accessing or using our website, you
            agree to be bound by these Terms and Conditions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">2. Eligibility</h2>
          <p className="text-muted-foreground leading-relaxed">
            You must be at least 13 years of age to use NehaNotes. By using this platform, you
            represent that you are capable of entering into a binding agreement and are not barred
            from receiving services under applicable law. The platform is intended primarily for
            current and former MAKAUT engineering students.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">3. User Accounts</h2>
          <p className="text-muted-foreground leading-relaxed">
            You must create a free account to access full solutions. You are responsible for
            maintaining the confidentiality of your login credentials and for all activity that
            occurs under your account. You must provide accurate information during registration.
            We reserve the right to suspend or terminate accounts that violate these terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">4. Free Access</h2>
          <p className="text-muted-foreground leading-relaxed">
            NehaNotes is entirely free to use. There are no payments, subscriptions, or purchases
            required. Creating an account is free and gives you full access to all question papers
            and worked solutions on the platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">5. Digital Content and Intellectual Property</h2>
          <p className="text-muted-foreground leading-relaxed">
            All content on NehaNotes — including question papers, worked solutions, explanations,
            mathematical workings, and key points — is the intellectual property of NehaNotes or
            its content contributors. Your account grants you a personal, non-transferable,
            non-exclusive licence to view the content for your own private study purposes only.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            You may not copy, reproduce, distribute, sell, sublicense, or otherwise share any
            content from this platform in any form without our prior written consent. Violation of
            this clause may result in immediate account termination.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">6. Acceptable Use</h2>
          <p className="text-muted-foreground leading-relaxed">
            You agree not to use NehaNotes to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Share content with others for commercial purposes</li>
            <li>Use automated tools, bots, or scrapers to extract content</li>
            <li>Impersonate another user or submit false information</li>
            <li>Engage in any activity that disrupts or interferes with our services</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">7. Accuracy of Content</h2>
          <p className="text-muted-foreground leading-relaxed">
            We make every effort to ensure that solutions and explanations are accurate. However,
            NehaNotes does not guarantee that all content is error-free. Content is intended as a
            study aid and should not be the sole basis for academic preparation. We are not
            responsible for outcomes in examinations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">8. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            To the maximum extent permitted by law, NehaNotes shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages arising from your use of the
            platform or from any errors in the content provided.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">9. Modifications to the Service</h2>
          <p className="text-muted-foreground leading-relaxed">
            We reserve the right to modify, suspend, or discontinue any part of the service at
            any time. We may update these Terms and Conditions periodically. Continued use of
            NehaNotes after such changes constitutes your acceptance of the revised terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">10. Governing Law</h2>
          <p className="text-muted-foreground leading-relaxed">
            These Terms and Conditions are governed by the laws of India. Any disputes arising
            from your use of NehaNotes shall be subject to the exclusive jurisdiction of the courts
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
