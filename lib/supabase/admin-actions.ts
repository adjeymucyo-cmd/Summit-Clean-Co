'use server'

import { createServiceRoleClient } from '@/lib/supabase/server'
import type { ContactMessageRow } from '@/lib/types'

export async function insertService(input: { name: string; slug: string; short_description?: string; description?: string; image_url?: string; display_order?: number; is_active?: boolean }) {
  const serviceRoleClient = createServiceRoleClient()
  if (!serviceRoleClient) {
    return { success: false, error: 'Supabase admin client is not configured.' }
  }

  const { error } = await serviceRoleClient.from('services').insert({
    name: input.name,
    slug: input.slug,
    short_description: input.short_description ?? null,
    description: input.description ?? null,
    image_url: input.image_url ?? null,
    display_order: input.display_order ?? 99,
    is_active: input.is_active ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteService(id: string) {
  const serviceRoleClient = createServiceRoleClient()
  if (!serviceRoleClient) {
    return { success: false, error: 'Supabase admin client is not configured.' }
  }

  const { error } = await serviceRoleClient.from('services').delete().eq('id', id)
  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function insertServiceArea(input: { name: string; slug: string; description?: string; image_url?: string; display_order?: number; is_active?: boolean }) {
  const serviceRoleClient = createServiceRoleClient()
  if (!serviceRoleClient) {
    return { success: false, error: 'Supabase admin client is not configured.' }
  }

  const { error } = await serviceRoleClient.from('service_areas').insert({
    name: input.name,
    slug: input.slug,
    description: input.description ?? null,
    image_url: input.image_url ?? null,
    display_order: input.display_order ?? 99,
    is_active: input.is_active ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function updateServiceArea(id: string, input: { name?: string; slug?: string; description?: string | null; image_url?: string | null; display_order?: number; is_active?: boolean }) {
  const serviceRoleClient = createServiceRoleClient()
  if (!serviceRoleClient) {
    return { success: false, error: 'Supabase admin client is not configured.' }
  }

  const { error } = await serviceRoleClient.from('service_areas').update({
    name: input.name,
    slug: input.slug,
    description: input.description ?? null,
    image_url: input.image_url ?? null,
    display_order: input.display_order ?? 99,
    is_active: input.is_active ?? true,
    updated_at: new Date().toISOString(),
  }).eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function insertTestimonial(input: { customer_name: string; location?: string; review: string; rating: number; is_published?: boolean }) {
  const serviceRoleClient = createServiceRoleClient()
  if (!serviceRoleClient) {
    return { success: false, error: 'Supabase admin client is not configured.' }
  }

  const { error } = await serviceRoleClient.from('testimonials').insert({
    customer_name: input.customer_name,
    location: input.location ?? null,
    review: input.review,
    rating: input.rating,
    is_published: input.is_published ?? false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function updateTestimonial(id: string, input: { customer_name?: string; location?: string | null; review?: string; rating?: number; is_published?: boolean }) {
  const serviceRoleClient = createServiceRoleClient()
  if (!serviceRoleClient) {
    return { success: false, error: 'Supabase admin client is not configured.' }
  }

  const { error } = await serviceRoleClient.from('testimonials').update({
    customer_name: input.customer_name,
    location: input.location ?? null,
    review: input.review,
    rating: input.rating,
    is_published: input.is_published,
    updated_at: new Date().toISOString(),
  }).eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteTestimonial(id: string) {
  const serviceRoleClient = createServiceRoleClient()
  if (!serviceRoleClient) {
    return { success: false, error: 'Supabase admin client is not configured.' }
  }

  const { error } = await serviceRoleClient.from('testimonials').delete().eq('id', id)
  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function updateSiteSetting(key: string, value: string) {
  const serviceRoleClient = createServiceRoleClient()
  if (!serviceRoleClient) {
    return { success: false, error: 'Supabase admin client is not configured.' }
  }

  const { error } = await serviceRoleClient.from('site_settings').upsert({
    key,
    value,
    updated_at: new Date().toISOString(),
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function updateAllSiteSettings(settings: Array<{ key: string; value: string | null }>) {
  const serviceRoleClient = createServiceRoleClient()
  if (!serviceRoleClient) {
    return { success: false, error: 'Supabase admin client is not configured.' }
  }

  const now = new Date().toISOString()
  const payload = settings.map(s => ({
    key: s.key,
    value: s.value ?? '',
    updated_at: now,
  }))

  const { error } = await serviceRoleClient.from('site_settings').upsert(payload)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function updateQuoteStatus(id: string, status: string) {
  const serviceRoleClient = createServiceRoleClient()
  if (!serviceRoleClient) {
    return { success: false, error: 'Supabase admin client is not configured.' }
  }

  const { error } = await serviceRoleClient.from('quote_requests').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function updateQuoteNotes(id: string, note: string) {
  const serviceRoleClient = createServiceRoleClient()
  if (!serviceRoleClient) {
    return { success: false, error: 'Supabase admin client is not configured.' }
  }

  const { error } = await serviceRoleClient.from('quote_requests').update({ admin_notes: note, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function updateQuoteDetails(id: string, details: string) {
  const serviceRoleClient = createServiceRoleClient()
  if (!serviceRoleClient) {
    return { success: false, error: 'Supabase admin client is not configured.' }
  }

  const { error } = await serviceRoleClient.from('quote_requests').update({ details, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

async function ensureServiceAreaBucketExists(client: any) {
  try {
    const { data: buckets, error } = await client.storage.listBuckets()
    if (error) {
      await client.storage.createBucket('service-area-images', { public: true })
      return
    }
    const exists = buckets?.some((bucket: any) => bucket.name === 'service-area-images')
    if (!exists) {
      await client.storage.createBucket('service-area-images', { public: true })
    }
  } catch {
    // Ignore bucket creation failures for now
  }
}

export async function uploadServiceAreaImage(file: File) {
  const serviceRoleClient = createServiceRoleClient()
  if (!serviceRoleClient) {
    return { success: false, error: 'Supabase admin client is not configured.' }
  }

  if (!file) {
    return { success: false, error: 'No file provided.' }
  }

  try {
    await ensureServiceAreaBucketExists(serviceRoleClient)

    const ext = file.name.split('.').pop() || 'jpg'
    const fileName = `service-area-${Date.now()}.${ext}`
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await serviceRoleClient.storage
      .from('service-area-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      return { success: false, error: uploadError.message }
    }

    const { data } = serviceRoleClient.storage.from('service-area-images').getPublicUrl(fileName)
    return { success: true, url: data.publicUrl }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to upload image.' }
  }
}

async function ensureServiceBucketExists(client: any) {
  try {
    const { data: buckets, error } = await client.storage.listBuckets()
    if (error) {
      await client.storage.createBucket('service-images', { public: true })
      return
    }
    const exists = buckets?.some((bucket: any) => bucket.name === 'service-images')
    if (!exists) {
      await client.storage.createBucket('service-images', { public: true })
    }
  } catch {
    // ignore
  }
}

export async function uploadServiceImage(file: File) {
  const serviceRoleClient = createServiceRoleClient()
  if (!serviceRoleClient) {
    return { success: false, error: 'Supabase admin client is not configured.' }
  }

  if (!file) {
    return { success: false, error: 'No file provided.' }
  }

  try {
    await ensureServiceBucketExists(serviceRoleClient)

    const ext = file.name.split('.').pop() || 'jpg'
    const fileName = `service-${Date.now()}.${ext}`
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await serviceRoleClient.storage
      .from('service-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      return { success: false, error: uploadError.message }
    }

    const { data } = serviceRoleClient.storage.from('service-images').getPublicUrl(fileName)
    return { success: true, url: data.publicUrl }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to upload image.' }
  }
}

export async function getContactMessages(): Promise<ContactMessageRow[]> {
  const serviceRoleClient = createServiceRoleClient()
  if (!serviceRoleClient) {
    return []
  }

  const { data, error } = await serviceRoleClient
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching contact messages:', error.message)
    return []
  }

  return (data as ContactMessageRow[]) ?? []
}

export async function updateContactMessageStatus(id: string, status: string) {
  const serviceRoleClient = createServiceRoleClient()
  if (!serviceRoleClient) {
    return { success: false, error: 'Supabase admin client is not configured.' }
  }

  const { error } = await serviceRoleClient
    .from('contact_messages')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function replyToContactMessage(
  id: string, 
  replyText: string,
  customerEmail?: string,
  customerName?: string,
  originalMessage?: string
) {
  const serviceRoleClient = createServiceRoleClient()
  if (!serviceRoleClient) {
    return { success: false, error: 'Supabase admin client is not configured.' }
  }

  // First, save the reply to the database
  const { error: updateError } = await serviceRoleClient
    .from('contact_messages')
    .update({ 
      reply_text: replyText, 
      status: 'replied', 
      updated_at: new Date().toISOString() 
    })
    .eq('id', id)

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  // Then send email if customer details are provided
  if (customerEmail && customerName && originalMessage) {
    try {
      const { sendReplyEmail } = await import('@/lib/email')
      const emailResult = await sendReplyEmail(
        customerEmail,
        customerName,
        originalMessage,
        replyText
      )
      
      if (!emailResult.success) {
        console.warn('Email sending failed:', emailResult.error)
        // Still return success since the reply was saved to database
        // The email failure is logged but doesn't block the operation
      }
    } catch (error) {
      console.warn('Email service error:', error)
      // Continue anyway - reply is saved in database
    }
  }

  return { success: true }
}

export async function deleteContactMessage(id: string) {
  const serviceRoleClient = createServiceRoleClient()
  if (!serviceRoleClient) {
    return { success: false, error: 'Supabase admin client is not configured.' }
  }

  const { error } = await serviceRoleClient
    .from('contact_messages')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

