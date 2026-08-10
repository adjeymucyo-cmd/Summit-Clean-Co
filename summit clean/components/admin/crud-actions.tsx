'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { insertService, deleteService, insertServiceArea, insertTestimonial, updateQuoteStatus, updateQuoteNotes } from '@/lib/supabase/data'

export function ServiceManager({ initialServices }: { initialServices: Array<{ id: string; name: string; slug: string; short_description?: string | null; description?: string | null; image_url?: string | null; display_order?: number | null; is_active?: boolean | null }> }) {
  const [services, setServices] = useState(initialServices)
  const [pending, startTransition] = useTransition()
  const [form, setForm] = useState({ name: '', slug: '', short_description: '', description: '', image_url: '', display_order: '99', is_active: 'true' as 'true' | 'false' })

  async function submit(action: 'create' | 'edit' | 'delete', id?: string) {
    const payload = new FormData()
    payload.set('_action', action)
    if (id) payload.set('id', id)
    payload.set('name', form.name)
    payload.set('slug', form.slug)
    payload.set('short_description', form.short_description)
    payload.set('description', form.description)
    payload.set('image_url', form.image_url)
    payload.set('display_order', form.display_order)
    payload.set('is_active', form.is_active)

    startTransition(async () => {
      if (action === 'create') {
        const result = await insertService({
          name: form.name,
          slug: form.slug,
          short_description: form.short_description || undefined,
          description: form.description || undefined,
          image_url: form.image_url || undefined,
          display_order: Number(form.display_order),
          is_active: form.is_active === 'true',
        })
        if (result.success) {
          setServices((current) => [...current, { id: `${Date.now()}`, name: form.name, slug: form.slug, short_description: form.short_description, description: form.description, image_url: form.image_url, display_order: Number(form.display_order), is_active: form.is_active === 'true' }])
          setForm({ name: '', slug: '', short_description: '', description: '', image_url: '', display_order: '99', is_active: 'true' })
        }
      }

      if (action === 'delete' && id) {
        const result = await deleteService(id)
        if (result.success) {
          setServices((current) => current.filter((item) => item.id !== id))
        }
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[1.5rem] border border-[#DCE5E1] bg-[#F5F7F2] p-6">
        <h3 className="text-lg font-semibold text-[#14221F]">Add new service</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          </div>
          <div>
            <Label>Slug</Label>
            <Input value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} />
          </div>
          <div>
            <Label>Short description</Label>
            <Input value={form.short_description} onChange={(event) => setForm((current) => ({ ...current, short_description: event.target.value }))} />
          </div>
          <div>
            <Label>Image URL</Label>
            <Input value={form.image_url} onChange={(event) => setForm((current) => ({ ...current, image_url: event.target.value }))} />
          </div>
          <div>
            <Label>Display order</Label>
            <Input type="number" value={form.display_order} onChange={(event) => setForm((current) => ({ ...current, display_order: event.target.value }))} />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={form.is_active} onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.value as 'true' | 'false' }))}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Select>
          </div>
        </div>
        <div className="mt-4">
          <Label>Description</Label>
          <Textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
        </div>
        <Button className="mt-4 rounded-full bg-[#0F5B4F] text-white hover:bg-[#093D35]" onClick={() => submit('create')} disabled={pending}>Add service</Button>
      </div>

      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="rounded-[1.25rem] border border-[#DCE5E1] p-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <p className="font-semibold text-[#14221F]">{service.name}</p>
                <p className="mt-1 text-sm text-[#60716D]">{service.short_description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => submit('delete', service.id)} disabled={pending}>Delete</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ServiceAreaManager({ initialAreas }: { initialAreas: Array<{ id: string; name: string; slug: string; description?: string | null; display_order?: number | null; is_active?: boolean | null }> }) {
  const [areas, setAreas] = useState(initialAreas)
  const [pending, startTransition] = useTransition()
  const [form, setForm] = useState({ name: '', slug: '', description: '', display_order: '99', is_active: 'true' as 'true' | 'false' })

  async function submit() {
    startTransition(async () => {
      const result = await insertServiceArea({
        name: form.name,
        slug: form.slug,
        description: form.description || undefined,
        display_order: Number(form.display_order),
        is_active: form.is_active === 'true',
      })
      if (result.success) {
        setAreas((current) => [...current, { id: `${Date.now()}`, name: form.name, slug: form.slug, description: form.description, display_order: Number(form.display_order), is_active: form.is_active === 'true' }])
        setForm({ name: '', slug: '', description: '', display_order: '99', is_active: 'true' })
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[1.5rem] border border-[#DCE5E1] bg-[#F5F7F2] p-6">
        <h3 className="text-lg font-semibold text-[#14221F]">Add new service area</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div><Label>Name</Label><Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} /></div>
          <div><Label>Slug</Label><Input value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} /></div>
          <div><Label>Display order</Label><Input type="number" value={form.display_order} onChange={(event) => setForm((current) => ({ ...current, display_order: event.target.value }))} /></div>
          <div><Label>Status</Label><Select value={form.is_active} onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.value as 'true' | 'false' }))}><option value="true">Active</option><option value="false">Inactive</option></Select></div>
        </div>
        <div className="mt-4"><Label>Description</Label><Textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} /></div>
        <Button className="mt-4 rounded-full bg-[#0F5B4F] text-white hover:bg-[#093D35]" onClick={submit} disabled={pending}>Add service area</Button>
      </div>
      <div className="space-y-4">
        {areas.map((area) => (
          <div key={area.id} className="rounded-[1.25rem] border border-[#DCE5E1] p-5">
            <p className="font-semibold text-[#14221F]">{area.name}</p>
            <p className="mt-1 text-sm text-[#60716D]">{area.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TestimonialManager({ initialTestimonials }: { initialTestimonials: Array<{ id: string; customer_name: string; location?: string | null; review: string; rating: number; is_published?: boolean | null }> }) {
  const [testimonials, setTestimonials] = useState(initialTestimonials)
  const [pending, startTransition] = useTransition()
  const [form, setForm] = useState({ customer_name: '', location: '', review: '', rating: '5', is_published: 'true' as 'true' | 'false' })

  async function submit() {
    startTransition(async () => {
      const result = await insertTestimonial({
        customer_name: form.customer_name,
        location: form.location || undefined,
        review: form.review,
        rating: Number(form.rating),
        is_published: form.is_published === 'true',
      })
      if (result.success) {
        setTestimonials((current) => [...current, { id: `${Date.now()}`, customer_name: form.customer_name, location: form.location, review: form.review, rating: Number(form.rating), is_published: form.is_published === 'true' }])
        setForm({ customer_name: '', location: '', review: '', rating: '5', is_published: 'true' })
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[1.5rem] border border-[#DCE5E1] bg-[#F5F7F2] p-6">
        <h3 className="text-lg font-semibold text-[#14221F]">Add new testimonial</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div><Label>Customer name</Label><Input value={form.customer_name} onChange={(event) => setForm((current) => ({ ...current, customer_name: event.target.value }))} /></div>
          <div><Label>Location</Label><Input value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} /></div>
          <div><Label>Rating</Label><Input type="number" min="1" max="5" value={form.rating} onChange={(event) => setForm((current) => ({ ...current, rating: event.target.value }))} /></div>
          <div><Label>Status</Label><select value={form.is_published} onChange={(event) => setForm((current) => ({ ...current, is_published: event.target.value as 'true' | 'false' }))} className="mt-2 flex h-10 w-full rounded-full border border-[#DCE5E1] bg-white px-3 py-2 text-sm"><option value="true">Published</option><option value="false">Draft</option></select></div>
        </div>
        <div className="mt-4"><Label>Review</Label><Textarea value={form.review} onChange={(event) => setForm((current) => ({ ...current, review: event.target.value }))} /></div>
        <Button className="mt-4 rounded-full bg-[#0F5B4F] text-white hover:bg-[#093D35]" onClick={submit} disabled={pending}>Add testimonial</Button>
      </div>
      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="rounded-[1.25rem] border border-[#DCE5E1] p-5">
            <p className="font-semibold text-[#14221F]">{testimonial.customer_name}</p>
            <p className="mt-2 text-sm leading-7 text-[#60716D]">{testimonial.review}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function QuoteManager({ initialQuotes }: { initialQuotes: Array<{ id: string; full_name: string; email: string; phone?: string | null; details?: string | null; status: string; admin_notes?: string | null }> }) {
  const [quotes, setQuotes] = useState(initialQuotes)
  const [pending, startTransition] = useTransition()

  async function updateStatus(id: string, status: string) {
    startTransition(async () => {
      const result = await updateQuoteStatus(id, status)
      if (result.success) {
        setQuotes((current) => current.map((quote) => quote.id === id ? { ...quote, status } : quote))
      }
    })
  }

  async function updateNote(id: string, note: string) {
    startTransition(async () => {
      const result = await updateQuoteNotes(id, note)
      if (result.success) {
        setQuotes((current) => current.map((quote) => quote.id === id ? { ...quote, admin_notes: note } : quote))
      }
    })
  }

  return (
    <div className="space-y-4">
      {quotes.map((quote) => (
        <div key={quote.id} className="rounded-[1.25rem] border border-[#DCE5E1] p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <p className="font-semibold text-[#14221F]">{quote.full_name}</p>
              <p className="text-sm text-[#60716D]">{quote.email}</p>
              {quote.phone && <p className="text-sm text-[#60716D]">{quote.phone}</p>}
            </div>
            <div className="flex items-center gap-2">
              <select value={quote.status} onChange={(event) => updateStatus(quote.id, event.target.value)} className="rounded-full border border-[#DCE5E1] bg-white px-3 py-2 text-sm text-[#14221F]" disabled={pending}>
                <option value="new">New</option>
                <option value="booked">Booked</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm leading-7 text-[#60716D]">{quote.details ?? 'No additional details provided.'}</div>
          <div className="mt-4">
            <Label>Admin notes</Label>
            <Textarea defaultValue={quote.admin_notes ?? ''} onBlur={(event) => updateNote(quote.id, event.target.value)} />
          </div>
        </div>
      ))}
    </div>
  )
}
