'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function createContactMessage(input: { name: string; email: string; phone?: string; message: string }) {
  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    return { success: false, error: 'Supabase is not configured yet.' }
  }

  const { error } = await supabase.from('contact_messages').insert({
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    message: input.message,
    status: 'new',
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function createQuoteRequest(input: Record<string, unknown>) {
  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    return { success: false, error: 'Supabase is not configured yet.' }
  }

  const normalizedInput = { ...input }
  const rawServiceId = typeof normalizedInput.service_id === 'string' ? normalizedInput.service_id.trim() : ''
  const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(rawServiceId)

  if (!isValidUuid) {
    delete normalizedInput.service_id
  }

  const { error } = await supabase.from('quote_requests').insert({
    ...normalizedInput,
    status: 'new',
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
