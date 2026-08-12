'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import type { ContactMessageRow } from '@/lib/types'

/**
 * COMPREHENSIVE CONTACT MESSAGE HANDLER
 * This handles the complete flow:
 * 1. Save message to database
 * 2. Verify it was saved
 * 3. Return detailed feedback
 */

export async function createContactMessageWithDiagnostics(input: {
  name: string
  email: string
  phone?: string
  message: string
}) {
  console.log('[CONTACT] Starting message creation:', {
    name: input.name,
    email: input.email,
    hasPhone: !!input.phone,
    messageLength: input.message.length,
  })

  // Step 1: Get Supabase client
  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    console.error('[CONTACT] Supabase client not initialized - check environment variables')
    return {
      success: false,
      error: 'Supabase is not configured. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are in .env.local',
      stage: 'initialization',
    }
  }

  // Step 2: Prepare data
  const messageData = {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() || null,
    message: input.message.trim(),
    status: 'new' as const,
  }

  console.log('[CONTACT] Prepared data:', messageData)

  // Step 3: Insert into database
  try {
    const { data, error } = await supabase.from('contact_messages').insert([messageData]).select()

    if (error) {
      console.error('[CONTACT] Database insert error:', error)
      return {
        success: false,
        error: error.message,
        stage: 'insert',
        details: error.details,
      }
    }

    console.log('[CONTACT] Message inserted successfully:', data)

    // Step 4: Verify insertion
    if (!data || data.length === 0) {
      console.warn('[CONTACT] No data returned from insert')
      return {
        success: false,
        error: 'Message was not created. Database returned no data.',
        stage: 'verification',
      }
    }

    const createdMessage = data[0]
    console.log('[CONTACT] Verified message creation:', {
      id: createdMessage.id,
      status: createdMessage.status,
      createdAt: createdMessage.created_at,
    })

    return {
      success: true,
      messageId: createdMessage.id,
      message: 'Your message has been received. We will respond shortly.',
    }
  } catch (error) {
    console.error('[CONTACT] Unexpected error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      stage: 'exception',
    }
  }
}

/**
 * ENHANCED REPLY HANDLER WITH FULL LOGGING
 * Sends admin reply to customer email with detailed error reporting
 */
export async function replyToContactMessageWithDiagnostics(
  id: string,
  replyText: string,
  customerEmail?: string,
  customerName?: string,
  originalMessage?: string
) {
  console.log('[REPLY] Starting reply process:', {
    messageId: id,
    replyLength: replyText.length,
    hasCustomerEmail: !!customerEmail,
    hasCustomerName: !!customerName,
  })

  const serviceRoleClient = createServiceRoleClient()
  if (!serviceRoleClient) {
    console.error('[REPLY] Service role client not configured')
    return {
      success: false,
      error: 'Admin client is not configured. Check SUPABASE_SERVICE_ROLE_KEY in .env.local',
      stage: 'initialization',
    }
  }

  try {
    // Step 1: Save reply to database
    console.log('[REPLY] Updating message with reply...')
    const { error: updateError } = await serviceRoleClient
      .from('contact_messages')
      .update({
        reply_text: replyText,
        status: 'replied',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) {
      console.error('[REPLY] Database update error:', updateError)
      return {
        success: false,
        error: `Failed to save reply to database: ${updateError.message}`,
        stage: 'database_update',
      }
    }

    console.log('[REPLY] Reply saved to database successfully')

    // Step 2: Verify the update
    const { data: verifyData, error: verifyError } = await serviceRoleClient
      .from('contact_messages')
      .select('id, reply_text, status')
      .eq('id', id)
      .single()

    if (verifyError || !verifyData) {
      console.warn('[REPLY] Could not verify reply was saved:', verifyError)
    } else {
      console.log('[REPLY] Verified reply in database:', {
        status: verifyData.status,
        hasReplyText: !!verifyData.reply_text,
      })
    }

    // Step 3: Send email if customer details provided
    let emailStatus = 'skipped'
    if (customerEmail && customerName && originalMessage) {
      console.log('[REPLY] Attempting to send email to:', customerEmail)

      try {
        const { sendReplyEmail } = await import('@/lib/email')
        const emailResult = await sendReplyEmail(
          customerEmail,
          customerName,
          originalMessage,
          replyText
        )

        if (emailResult.success) {
          console.log('[REPLY] Email sent successfully:', emailResult)
          emailStatus = 'sent'
        } else {
          console.warn('[REPLY] Email sending failed:', emailResult.error)
          emailStatus = `failed: ${emailResult.error}`
        }
      } catch (emailError) {
        console.error('[REPLY] Email service error:', emailError)
        emailStatus = `error: ${emailError instanceof Error ? emailError.message : 'Unknown error'}`
      }
    } else {
      console.warn('[REPLY] Customer details incomplete, skipping email', {
        hasEmail: !!customerEmail,
        hasName: !!customerName,
        hasMessage: !!originalMessage,
      })
    }

    return {
      success: true,
      message: 'Reply saved successfully',
      emailStatus,
      databaseStage: 'update_complete',
    }
  } catch (error) {
    console.error('[REPLY] Unexpected error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected error',
      stage: 'exception',
    }
  }
}

/**
 * DIAGNOSTIC FUNCTION
 * Check if everything is configured correctly
 */
export async function diagnosticCheck() {
  const diagnostics: Record<string, any> = {}

  // Check environment variables
  diagnostics.environment = {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasResendApiKey: !!process.env.RESEND_API_KEY,
    hasFromEmail: !!process.env.FROM_EMAIL,
  }

  // Try to create clients
  try {
    const serverClient = await createServerSupabaseClient()
    diagnostics.serverClient = { initialized: !!serverClient }
  } catch (error) {
    diagnostics.serverClient = { error: error instanceof Error ? error.message : 'Unknown error' }
  }

  try {
    const serviceClient = createServiceRoleClient()
    diagnostics.serviceClient = { initialized: !!serviceClient }
  } catch (error) {
    diagnostics.serviceClient = { error: error instanceof Error ? error.message : 'Unknown error' }
  }

  // Try to fetch existing messages
  try {
    const serverClient = await createServerSupabaseClient()
    if (serverClient) {
      const { data, error } = await serverClient.from('contact_messages').select('count').limit(1)
      diagnostics.database = {
        canQuery: !error,
        error: error?.message,
      }
    }
  } catch (error) {
    diagnostics.database = { error: error instanceof Error ? error.message : 'Unknown error' }
  }

  console.log('[DIAGNOSTIC]', JSON.stringify(diagnostics, null, 2))
  return diagnostics
}
