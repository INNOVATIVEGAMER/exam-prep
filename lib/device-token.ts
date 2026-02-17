import { createClient } from '@/lib/supabase/client'

export const DEVICE_TOKEN_KEY = 'examprep_device_token'

export function generateDeviceToken(): string {
  // 32 bytes of random hex
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('')
}

export async function writeDeviceToken(userId: string): Promise<void> {
  const token = generateDeviceToken()
  const supabase = createClient()

  const { error } = await supabase
    .from('users')
    .update({ active_device_token: token })
    .eq('id', userId)

  if (!error) {
    localStorage.setItem(DEVICE_TOKEN_KEY, token)
  }
}
