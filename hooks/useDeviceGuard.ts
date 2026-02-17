'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'

export const DEVICE_TOKEN_KEY = 'examprep_device_token'

export function useDeviceGuard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading || !user) return

    const checkDevice = async () => {
      const localToken = localStorage.getItem(DEVICE_TOKEN_KEY)
      // No local token — user hasn't logged in via our flow yet, skip check
      if (!localToken) return

      const supabase = createClient()
      const { data } = await supabase
        .from('users')
        .select('active_device_token')
        .eq('id', user.id)
        .single()

      // DB token is null (not set yet) — clear local token, allow through
      if (!data?.active_device_token) {
        localStorage.removeItem(DEVICE_TOKEN_KEY)
        return
      }

      // Mismatch — someone else logged in on another device
      if (data.active_device_token !== localToken) {
        localStorage.removeItem(DEVICE_TOKEN_KEY)
        router.push('/login?reason=device')
      }
    }

    checkDevice()
  }, [user, loading]) // eslint-disable-line react-hooks/exhaustive-deps
}
