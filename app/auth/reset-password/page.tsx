import { Suspense } from 'react'
import { ResetPasswordForm } from './ResetPasswordForm'

export const metadata = {
  title: 'Set New Password — NehaNotes',
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">
          Set new password
        </h1>
        <p className="text-center text-sm text-muted-foreground mb-8">
          Choose a strong password for your account
        </p>
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  )
}
