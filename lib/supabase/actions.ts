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

export async function confirmUserEmail(userId: string) {
  try {
    // Import here to avoid circular dependency issues
    const { createServiceRoleClient } = await import('@/lib/supabase/server')
    
    const supabase = createServiceRoleClient()
    if (!supabase) {
      return { success: false, error: 'Service role client not configured' }
    }

    // Use service role to confirm email without sending confirmation email
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      email_confirm: true,
    })

    if (error) {
      console.error('Email confirmation error:', error.message)
      // Don't fail signup if email confirmation fails
      return { success: true, warning: 'User created but email confirmation failed' }
    }

    return { success: true }
  } catch (error) {
    console.error('Unexpected error confirming email:', error)
    // Don't fail signup if email confirmation fails
    return { success: true, warning: 'User created but email confirmation encountered an error' }
  }
}

export async function signupUserWithoutRateLimit(input: {
  username: string
  full_name: string
  email: string
  phone?: string
  password: string
}) {
  try {
    const { createServiceRoleClient } = await import('@/lib/supabase/server')
    
    const supabase = createServiceRoleClient()
    if (!supabase) {
      console.error('Service role client not configured')
      return { success: false, error: 'Service role client not configured. Cannot complete signup.' }
    }

    console.log('Starting signup for:', input.email)

    // Step 1: Create user with admin API (bypasses rate limiting)
    console.log('Creating auth user...')
    const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true, // Immediately confirm email to bypass verification
      user_metadata: {
        // Store user info in auth metadata to avoid profile table schema issues
        username: input.username,
        full_name: input.full_name,
        phone: input.phone || null,
      }
    })

    if (createError || !user) {
      console.error('User creation error:', createError?.message || 'Unknown error')
      return { success: false, error: createError?.message || 'Failed to create user account' }
    }

    console.log('Auth user created successfully with ID:', user.id)
    console.log('User metadata stored in auth.users (skipping profiles table due to schema cache issue)')
    
    // Note: Skipping profile table creation to avoid PGRST204 schema cache errors
    // User data is stored in auth.users.user_metadata instead
    // Users can login daily with their email and password

    return { success: true, user }
  } catch (error) {
    console.error('Signup error:', error)
    return { success: false, error: 'An unexpected error occurred during signup: ' + (error instanceof Error ? error.message : 'Unknown error') }
  }
}
