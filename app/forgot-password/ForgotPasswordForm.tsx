'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
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
import { AlertTriangle, CheckCircle } from 'lucide-react'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim()) return

    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm?next=/auth/reset-password`,
      }
    )

    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    setSubmitted(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Reset password</CardTitle>
        <CardDescription>
          We&apos;ll send a reset link to your email address
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              <CheckCircle className="size-4 mt-0.5 shrink-0" />
              <p>
                Check your email for a password reset link. It may take a
                minute to arrive.
              </p>
            </div>
            <Link
              href="/login"
              className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to sign in
            </Link>
          </div>
        ) : (
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

            {error && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                <AlertTriangle className="size-4 mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !email.trim()}
            >
              {loading ? 'Sending…' : 'Send Reset Link'}
            </Button>

            <Link
              href="/login"
              className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to sign in
            </Link>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
