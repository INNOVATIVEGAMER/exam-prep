'use client'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { writeDeviceToken } from '@/lib/device-token'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

export function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const reason = searchParams.get('reason')
  // Error passed via redirect from signup page (e.g. "already have an account")
  const redirectError = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password) return

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (authError) {
      if (authError.message.includes('Invalid login credentials')) {
        // Check server-side whether the account actually exists.
        // Supabase gives the same "Invalid login credentials" for both wrong password
        // and non-existent email, so we disambiguate via our own API route that
        // queries auth.users with the service-role key.
        const checkRes = await fetch('/api/auth/check-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        })
        const { exists } = await checkRes.json()

        if (exists === false) {
          // No account with this email — redirect to signup with the email pre-filled
          const params = new URLSearchParams({
            error: 'No account found with this email. Please create one.',
            email: email.trim(),
          })
          router.push(`/signup?${params.toString()}`)
        } else {
          // Account exists (exists=true) or check failed (exists=null) — show wrong password
          setError('Incorrect password. Please try again.')
        }
      } else if (authError.message.includes('Email not confirmed')) {
        setError('Please check your email to confirm your account first.')
      } else {
        setError(authError.message)
      }
      setLoading(false)
      return
    }

    if (data.user) {
      await writeDeviceToken(data.user.id)
    }

    window.location.href = '/dashboard'
  }

  return (
    <div className="space-y-4">
      {/* Device warning */}
      {reason === 'device' && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle className="size-4 mt-0.5 shrink-0" />
          <div>
            <p>You were signed in on another device. Please sign in again to continue.</p>
            <p className="mt-1 text-amber-700">Only one device per account is allowed at a time.</p>
          </div>
        </div>
      )}

      {/* Error passed from signup redirect */}
      {redirectError && !error && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle className="size-4 mt-0.5 shrink-0" />
          <p>{redirectError}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sign in</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                <AlertTriangle className="size-4 mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !email.trim() || !password}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="font-medium text-foreground hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
