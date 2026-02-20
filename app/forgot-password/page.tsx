import { Suspense } from 'react'
import { ForgotPasswordForm } from './ForgotPasswordForm'

export const metadata = {
  title: 'Reset Password — NehaNotes',
}

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">
          Reset your password
        </h1>
        <p className="text-center text-sm text-muted-foreground mb-8">
          Enter your email and we&apos;ll send you a reset link
        </p>
        <Suspense fallback={null}>
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </main>
  )
}
