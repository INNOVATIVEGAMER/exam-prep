import { createClient } from '@/lib/supabase/server'
import { SupportForm } from './SupportForm'
import { LifeBuoy } from 'lucide-react'

export const metadata = {
  title: 'Support | ExamPrep',
  description: 'Raise a support ticket and we\'ll get back to you.',
}

export default async function SupportPage() {
  // Pre-fill name/email if user is logged in
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const defaultName  = (user?.user_metadata?.full_name as string | undefined) ?? ''
  const defaultEmail = user?.email ?? ''

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
          <LifeBuoy className="size-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Support</h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          Facing an issue? Fill out the form below and we&apos;ll get back to you as soon as possible.
        </p>
      </div>

      <SupportForm defaultName={defaultName} defaultEmail={defaultEmail} />
    </div>
  )
}
