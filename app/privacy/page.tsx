import type { Metadata } from 'next'
import { ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy — NehaNotes',
  description: 'Privacy policy for NehaNotes — how we collect, use, and protect your personal data.',
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
          <ShieldCheck className="size-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: February 2026</p>
      </div>

      <div className="prose prose-sm prose-zinc max-w-none space-y-8 text-sm text-foreground">

        <section className="space-y-3">
          <h2 className="text-base font-semibold">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            NehaNotes (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy. This Privacy
            Policy explains what personal information we collect, how we use it, and the choices
            you have in relation to that information. This policy applies to all users of our
            website and services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">2. Information We Collect</h2>
          <p className="text-muted-foreground leading-relaxed">
            We collect the following categories of information:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Account information:</span> Your email
              address and password (stored in hashed form) when you create an account.
            </li>
            <li>
              <span className="font-medium text-foreground">Usage data:</span> Pages visited,
              papers viewed, and support tickets submitted, used to improve our service.
            </li>
            <li>
              <span className="font-medium text-foreground">Support communications:</span> Messages
              you send us via our support form, including your email and the content of your query.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">3. How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>Create and manage your account</li>
            <li>Grant access to free content after you sign in</li>
            <li>Respond to support queries</li>
            <li>Send transactional emails (e.g. password resets)</li>
            <li>Improve our platform based on usage patterns</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            We do not sell, rent, or trade your personal information to any third party for
            marketing purposes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">4. Data Storage and Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            Your data is stored securely on Supabase, a managed cloud database platform with
            row-level security enabled. We use HTTPS for all data transmission. Passwords are
            never stored in plain text. We apply reasonable technical and organisational measures
            to protect your data against unauthorised access, loss, or disclosure.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            While we take security seriously, no system is completely secure. We encourage you
            to use a strong, unique password for your NehaNotes account.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">5. Cookies and Local Storage</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use browser cookies for authentication session management. We do not use
            third-party advertising cookies or tracking pixels.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">6. Third-Party Services</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use the following third-party services to operate NehaNotes:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li><span className="font-medium text-foreground">Supabase</span> — database, authentication, and backend infrastructure</li>
            <li><span className="font-medium text-foreground">Vercel</span> — website hosting and deployment</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Each of these providers has their own privacy policies governing how they handle data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">7. Data Retention</h2>
          <p className="text-muted-foreground leading-relaxed">
            We retain your account data for as long as your account is active or as needed to
            provide our services. If you request account deletion, we will remove your personal
            data within 30 days, except where we are required to retain it for legal purposes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">8. Your Rights</h2>
          <p className="text-muted-foreground leading-relaxed">
            You have the right to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and associated data</li>
            <li>Withdraw consent where processing is based on consent</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            To exercise any of these rights, please contact us via our{' '}
            <a href="/contact" className="underline underline-offset-2 hover:text-foreground transition-colors">Contact page</a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">9. Children&apos;s Privacy</h2>
          <p className="text-muted-foreground leading-relaxed">
            NehaNotes is not directed to children under the age of 13. We do not knowingly collect
            personal information from children under 13. If we become aware that we have collected
            such information, we will delete it promptly.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">10. Changes to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time. The updated version will be
            indicated by a revised date at the top of this page. Continued use of NehaNotes after
            any changes constitutes your acceptance of the updated policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold">11. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            For any privacy-related questions or requests, please reach us through our{' '}
            <a href="/contact" className="underline underline-offset-2 hover:text-foreground transition-colors">Contact page</a> or
            raise a <a href="/support" className="underline underline-offset-2 hover:text-foreground transition-colors">support ticket</a>.
          </p>
        </section>

      </div>
    </div>
  )
}
