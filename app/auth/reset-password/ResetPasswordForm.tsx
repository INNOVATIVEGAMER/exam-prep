'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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

export function ResetPasswordForm() {
  const router = useRouter()

  const [sessionReady, setSessionReady] = useState(false)
  const [sessionError, setSessionError] = useState(false)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // The server-side confirm route handler already exchanged the code for a session.
  // We just verify a recovery session exists before showing the form.
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        setSessionError(true)
      } else {
        setSessionReady(true)
      }
    }

    checkSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/login'), 2000)
  }

  if (sessionError) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            <AlertTriangle className="size-4 mt-0.5 shrink-0" />
            <p>
              This link has expired or is invalid. Please request a new one.
            </p>
          </div>
          <Link
            href="/forgot-password"
            className="block text-center text-sm font-medium text-foreground hover:underline"
          >
            Request a new reset link →
          </Link>
        </CardContent>
      </Card>
    )
  }

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            <CheckCircle className="size-4 mt-0.5 shrink-0" />
            <p>Password updated! Redirecting to sign in…</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!sessionReady) {
    return (
      <div className="rounded-xl border bg-card p-6 space-y-4 animate-pulse">
        <div className="h-4 bg-muted rounded w-1/3" />
        <div className="h-9 bg-muted rounded" />
        <div className="h-9 bg-muted rounded" />
        <div className="h-9 bg-muted rounded" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Set new password</CardTitle>
        <CardDescription>Choose a strong password for your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your new password"
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
            disabled={loading || !newPassword || !confirmPassword}
          >
            {loading ? 'Updating…' : 'Update Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
