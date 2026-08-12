import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'
import type { ServiceAreaRow, ServiceRow, SiteSettingRow, TestimonialRow, QuoteRequestRow } from '@/lib/types'

const fallbackServices: ServiceRow[] = [
  {
    id: 'service-residential',
    name: 'Residential Cleaning',
    slug: 'residential-cleaning',
    short_description: 'Consistent, detail-focused home cleaning for busy households.',
    description: 'From weekly upkeep to seasonal refreshes, our residential service keeps homes feeling comfortable and cared for.',
    image_url: '/images/residential-custom.jpg',
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'service-commercial',
    name: 'Commercial Cleaning',
    slug: 'commercial-cleaning',
    short_description: 'Professional office and storefront cleaning for polished, productive spaces.',
    description: 'From desks to meeting rooms, our commercial cleaning service maintains healthy, presentable workplaces you can depend on.',
    image_url: 'https://images.pexels.com/photos/6994746/pexels-photo-6994746.jpeg?auto=compress&cs=tinysrgb&w=900',
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'service-office',
    name: 'Office Cleaning',
    slug: 'office-cleaning',
    short_description: 'A cleaner, healthier office space that helps teams stay productive.',
    description: 'Our office cleaning service focuses on desks, meeting rooms, shared spaces, and high-touch surfaces to keep your workplace safe and polished.',
    image_url: '/images/office-custom.jpg',
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const fallbackServiceAreas: ServiceAreaRow[] = [
  {
    id: 'area-downtown',
    name: 'Downtown',
    slug: 'downtown',
    description: 'Full-service residential and commercial cleaning throughout the downtown core.',
    image_url: null,
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'area-fraser-valley',
    name: 'Fraser Valley',
    slug: 'fraser-valley',
    description: 'Flexible service coverage across the broader Fraser Valley region.',
    image_url: null,
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'area-north-hills',
    name: 'North Hills',
    slug: 'north-hills',
    description: 'Trusted home cleaning for the North Hills neighborhoods.',
    image_url: null,
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'area-surrounding-communities',
    name: 'Surrounding Communities',
    slug: 'surrounding-communities',
    description: 'Additional local service coverage for nearby communities and neighborhoods.',
    image_url: null,
    is_active: true,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'area-westgate',
    name: 'Westgate',
    slug: 'westgate',
    description: 'Serving Westgate homes and businesses with dependable care.',
    image_url: null,
    is_active: true,
    display_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'area-summit-valley',
    name: 'Summit Valley',
    slug: 'summit-valley',
    description: 'Our home base — comprehensive cleaning across Summit Valley.',
    image_url: null,
    is_active: true,
    display_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'area-riverside',
    name: 'Riverside',
    slug: 'riverside',
    description: 'Reliable cleaning services across the Riverside district.',
    image_url: null,
    is_active: true,
    display_order: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'area-eastpoint',
    name: 'Eastpoint',
    slug: 'eastpoint',
    description: 'Professional cleaning coverage for the Eastpoint area.',
    image_url: null,
    is_active: true,
    display_order: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const fallbackTestimonials: TestimonialRow[] = [
  {
    id: 'testimonial-demo',
    customer_name: 'Demo Customer',
    location: 'Abbotsford',
    review: 'Demo content only. Replace with real testimonials in Supabase.',
    rating: 5,
    is_published: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const fallbackSettings: SiteSettingRow[] = [
  { key: 'company_name', value: 'Summit Clean Co.', updated_at: new Date().toISOString() },
  { key: 'business_name', value: 'Summit Clean Co.', updated_at: new Date().toISOString() },
  { key: 'phone', value: '(555) 018-2200', updated_at: new Date().toISOString() },
  { key: 'email', value: 'hello@summitcleanco.com', updated_at: new Date().toISOString() },
  { key: 'address', value: '128 Summit Ave, Suite 4, Summit Valley', updated_at: new Date().toISOString() },
  { key: 'hours', value: 'Mon–Fri 8am–6pm, Sat 9am–3pm', updated_at: new Date().toISOString() },
  { key: 'tagline', value: 'Spotless spaces, effortless living.', updated_at: new Date().toISOString() },
  { key: 'hero_heading', value: 'Clean Spaces. Better Places.', updated_at: new Date().toISOString() },
  { key: 'hero_description', value: 'Professional cleaning for homes and businesses across Abbotsford and the Fraser Valley.', updated_at: new Date().toISOString() },
  { key: 'service_area', value: 'Abbotsford & surrounding Fraser Valley areas', updated_at: new Date().toISOString() },
]

export async function getServices() {
  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    return fallbackServices
  }

  const { data, error } = await supabase.from('services').select('*').eq('is_active', true).order('display_order', { ascending: true })
  if (error) {
    return fallbackServices
  }
  return (data as ServiceRow[]) ?? fallbackServices
}

export async function getServiceBySlug(slug: string) {
  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    return fallbackServices.find(s => s.slug === slug) ?? null
  }

  const { data, error } = await supabase.from('services').select('*').eq('slug', slug).eq('is_active', true).maybeSingle()
  if (error || !data) {
    return fallbackServices.find(s => s.slug === slug) ?? null
  }
  return data as ServiceRow
}

export async function getServiceAreas() {
  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    return fallbackServiceAreas
  }

  const { data, error } = await supabase.from('service_areas').select('*').eq('is_active', true).order('display_order', { ascending: true })
  if (error) {
    return fallbackServiceAreas
  }
  return (data as ServiceAreaRow[]) ?? fallbackServiceAreas
}

export async function getTestimonials() {
  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    return fallbackTestimonials
  }

  const { data, error } = await supabase.from('testimonials').select('*').eq('is_published', true).order('created_at', { ascending: false })
  if (error) {
    return fallbackTestimonials
  }
  return (data as TestimonialRow[]) ?? fallbackTestimonials
}

export async function getSiteSettings() {
  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    return fallbackSettings
  }

  const { data, error } = await supabase.from('site_settings').select('*')
  if (error) {
    return fallbackSettings
  }

  const records = (data as SiteSettingRow[]) ?? []
  return records.length > 0 ? records : fallbackSettings
}

export async function getAllQuotes() {
  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    return [] as QuoteRequestRow[]
  }

  const { data, error } = await supabase.from('quote_requests').select('*').order('created_at', { ascending: false })
  if (error) {
    return [] as QuoteRequestRow[]
  }
  return (data as QuoteRequestRow[]) ?? []
}

export async function getAdminOverview() {
  const quotes = await getAllQuotes()
  const services = await getServices()
  const testimonials = await getTestimonials()

  return {
    totalQuotes: quotes.length,
    newQuotes: quotes.filter((quote) => quote.status === 'new').length,
    bookedQuotes: quotes.filter((quote) => quote.status === 'booked').length,
    completedQuotes: quotes.filter((quote) => quote.status === 'completed').length,
    activeServices: services.filter((service) => service.is_active).length,
    publishedTestimonials: testimonials.filter((testimonial) => testimonial.is_published).length,
    recentQuotes: quotes.slice(0, 5),
  }
}

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

  const { error } = await supabase.from('quote_requests').insert({
    ...input,
    status: 'new',
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

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

export async function updateService(input: { id: string; name: string; slug: string; short_description?: string; description?: string; image_url?: string; display_order?: number; is_active?: boolean }) {
  const serviceRoleClient = createServiceRoleClient()
  if (!serviceRoleClient) {
    return { success: false, error: 'Supabase admin client is not configured.' }
  }

  const { error } = await serviceRoleClient.from('services').update({
    name: input.name,
    slug: input.slug,
    short_description: input.short_description ?? null,
    description: input.description ?? null,
    image_url: input.image_url ?? null,
    display_order: input.display_order ?? 99,
    is_active: input.is_active ?? true,
    updated_at: new Date().toISOString(),
  }).eq('id', input.id)

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
