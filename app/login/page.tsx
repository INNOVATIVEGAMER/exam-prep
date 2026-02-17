import { Suspense } from 'react'
import { LoginForm } from './LoginForm'
import { BookOpen } from 'lucide-react'

export const metadata = {
  title: 'Sign In — ExamPrep',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary">
              <BookOpen className="size-6" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Sign in to ExamPrep</h1>
          <p className="text-sm text-muted-foreground">
            Access exam papers and solutions for JISCE students
          </p>
        </div>

        {/* Suspense boundary required because LoginForm uses useSearchParams */}
        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm />
        </Suspense>

        <p className="text-center text-xs text-muted-foreground">
          By signing in you agree to our terms of service.
        </p>
      </div>
    </div>
  )
}

function LoginFormSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-4 animate-pulse">
      <div className="h-4 bg-muted rounded w-1/3" />
      <div className="h-9 bg-muted rounded" />
      <div className="h-4 bg-muted rounded w-1/4 mx-auto" />
      <div className="h-9 bg-muted rounded" />
      <div className="h-9 bg-muted rounded" />
    </div>
  )
}
