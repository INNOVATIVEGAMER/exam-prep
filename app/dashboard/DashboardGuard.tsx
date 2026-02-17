'use client'
import { useDeviceGuard } from '@/hooks/useDeviceGuard'

/**
 * Client-side wrapper that enforces single-device login.
 * Renders children immediately — the guard redirects if the device
 * token doesn't match the one stored in the DB.
 */
export function DashboardGuard({ children }: { children: React.ReactNode }) {
  useDeviceGuard()
  return <>{children}</>
}
