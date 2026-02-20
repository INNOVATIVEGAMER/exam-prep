import { Suspense } from 'react'
import { SignupForm } from './SignupForm'

export const metadata = {
  title: 'Sign Up — NehaNotes',
}

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">
          Create your account
        </h1>
        <p className="text-center text-sm text-muted-foreground mb-8">
          Join NehaNotes and start studying smarter
        </p>
        <Suspense fallback={null}>
          <SignupForm />
        </Suspense>
      </div>
    </main>
  )
}
