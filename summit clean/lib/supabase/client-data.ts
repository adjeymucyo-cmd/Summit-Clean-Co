import { createBrowserClient } from '@supabase/ssr'

export async function getPublicContent() {
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '')
  const [services, serviceAreas, testimonials] = await Promise.all([
    supabase.from('services').select('*').eq('is_active', true).order('display_order', { ascending: true }),
    supabase.from('service_areas').select('*').eq('is_active', true).order('display_order', { ascending: true }),
    supabase.from('testimonials').select('*').eq('is_published', true).order('created_at', { ascending: false }),
  ])

  return {
    services: services.data ?? [],
    serviceAreas: serviceAreas.data ?? [],
    testimonials: testimonials.data ?? [],
  }
}
