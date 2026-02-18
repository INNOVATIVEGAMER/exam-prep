'use client'
import { useState } from 'react'
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

function mapSignupError(message: string): string {
  if (message.includes('User already registered')) {
    return 'An account with this email already exists.'
  }
  if (message.includes('Password should be at least')) {
    return 'Password must be at least 8 characters.'
  }
  if (message.includes('email rate limit') || message.includes('rate limit')) {
    return 'Too many sign-up attempts. Please wait a moment and try again.'
  }
  return message
}

export function SignupForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: name.trim() },
      },
    })

    if (authError) {
      setError(mapSignupError(authError.message))
      setLoading(false)
      return
    }

    // Sign in immediately after signup to establish a cookie-based session.
    // signUp with PKCE flow doesn't set cookies directly — signInWithPassword does.
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (signInError) {
      setError(`Account created but sign-in failed: ${signInError.message}`)
      setLoading(false)
      return
    }

    if (signInData.user) {
      await writeDeviceToken(signInData.user.id)
    }

    window.location.href = '/dashboard'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Create account</CardTitle>
        <CardDescription>
          Fill in your details to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              autoComplete="name"
            />
          </div>

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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              required
              autoComplete="new-password"
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
            disabled={
              loading ||
              !name.trim() ||
              !email.trim() ||
              !password ||
              !confirmPassword
            }
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-foreground hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
