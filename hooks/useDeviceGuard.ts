'use client'
import { useEffect, useRef, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { DEVICE_TOKEN_KEY } from '@/lib/device-token'

const POLL_INTERVAL_MS = 15_000 // 15 seconds

/**
 * Device guard hook that enforces single-device login via polling.
 *
 * Every POLL_INTERVAL_MS, and whenever the tab regains focus, this hook
 * fetches the user's active_device_token from the DB and compares it
 * against the token stored in localStorage. If they differ, the user
 * is signed out and redirected to /login?reason=device.
 *
 * Architecture — single exit point:
 *   Poll interval  ─┐
 *   Tab visibility ─┼─▶ checkTokenFromDb() ─▶ validateToken() ─▶ kick()
 *   Mount check    ─┘
 *
 * kickingRef ensures kick() fires exactly once.
 */
export function useDeviceGuard() {
  const { user, loading } = useAuth()
  const kickingRef = useRef(false)

  /** Single exit point. Exactly-once via kickingRef. */
  const kick = useCallback(() => {
    if (kickingRef.current) return
    kickingRef.current = true
    localStorage.removeItem(DEVICE_TOKEN_KEY)
    const supabase = createClient()
    sessionStorage.setItem('logout_reason', 'device')
    supabase.auth.signOut()
  }, [])

  /**
   * Compare a DB token value against localStorage.
   * Calls kick() on any mismatch.
   */
  const validateToken = useCallback((dbToken: string | null | undefined) => {
    if (kickingRef.current) return
    const localToken = localStorage.getItem(DEVICE_TOKEN_KEY)
    if (!localToken) return           // not our session to guard
    if (!dbToken) { kick(); return }  // token cleared in DB — force re-login
    if (dbToken !== localToken) kick()
  }, [kick])

  /** Fetch DB token then validate. */
  const checkTokenFromDb = useCallback(async (userId: string) => {
    if (kickingRef.current) return

    const supabase = createClient()
    const { data, error } = await supabase
      .from('users')
      .select('active_device_token')
      .eq('id', userId)
      .single()

    if (error) return // network error — let next poll handle it
    validateToken(data?.active_device_token)
  }, [validateToken])

  useEffect(() => {
    if (loading || !user) return

    // Reset on mount so re-login after kick works cleanly
    kickingRef.current = false

    // 1. Check immediately on mount
    checkTokenFromDb(user.id)

    // 2. Poll on interval
    const intervalId = setInterval(() => {
      checkTokenFromDb(user.id)
    }, POLL_INTERVAL_MS)

    // 3. Re-check when tab regains focus — catches backgrounded tabs
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkTokenFromDb(user.id)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [user, loading, checkTokenFromDb])
}
