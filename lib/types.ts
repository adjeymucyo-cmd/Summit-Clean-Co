export type ServiceRow = {
  id: string
  name: string
  slug: string
  short_description: string | null
  description: string | null
  image_url: string | null
  display_order: number | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ServiceAreaRow = {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  is_active: boolean
  display_order: number | null
  created_at: string
  updated_at: string
}

export type TestimonialRow = {
  id: string
  customer_name: string
  location: string | null
  review: string
  rating: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export type QuoteRequestRow = {
  id: string
  full_name: string
  email: string
  phone: string | null
  service_id: string | null
  property_type: string | null
  preferred_date: string | null
  preferred_contact: string | null
  address: string | null
  property_size: string | null
  frequency: string | null
  details: string | null
  status: string
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export type SiteSettingRow = {
  key: string
  value: string | null
  updated_at: string
}

export type ContactMessageRow = {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  status: 'new' | 'opened' | 'replied'
  reply_text: string | null
  created_at: string
  updated_at: string
}

