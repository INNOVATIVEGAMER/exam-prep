'use client'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { WifiOff } from 'lucide-react'

export function OfflineBanner() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-6 text-center">
      <WifiOff className="size-12 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold">You're offline</h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-xs">
        ExamPrep requires an internet connection. Please check your network and try again.
      </p>
    </div>
  )
}
