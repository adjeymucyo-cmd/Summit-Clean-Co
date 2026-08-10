'use server'

import { createServiceRoleClient } from '@/lib/supabase/server'

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

export async function insertServiceArea(input: { name: string; slug: string; description?: string; display_order?: number; is_active?: boolean }) {
  const serviceRoleClient = createServiceRoleClient()
  if (!serviceRoleClient) {
    return { success: false, error: 'Supabase admin client is not configured.' }
  }

  const { error } = await serviceRoleClient.from('service_areas').insert({
    name: input.name,
    slug: input.slug,
    description: input.description ?? null,
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
