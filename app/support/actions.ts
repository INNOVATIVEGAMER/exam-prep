'use server'
import { createClient } from '@/lib/supabase/server'

export type IssueType = 'payment' | 'access' | 'account' | 'content' | 'other'

export interface SubmitTicketState {
  success: boolean
  error?: string
}

export async function submitTicket(
  _prev: SubmitTicketState,
  formData: FormData
): Promise<SubmitTicketState> {
  const name        = (formData.get('name') as string)?.trim()
  const email       = (formData.get('email') as string)?.trim()
  const issue_type  = (formData.get('issue_type') as IssueType)
  const description = (formData.get('description') as string)?.trim()

  if (!name || !email || !issue_type || !description) {
    return { success: false, error: 'All fields are required.' }
  }
  if (description.length < 20) {
    return { success: false, error: 'Please describe your issue in at least 20 characters.' }
  }

  const supabase = await createClient()

  // Attach user_id if logged in (nullable — guests can also raise tickets)
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from('support_tickets').insert({
    user_id: user?.id ?? null,
    name,
    email,
    issue_type,
    description,
  })

  if (error) {
    return { success: false, error: 'Failed to submit ticket. Please try again.' }
  }

  return { success: true }
}
