'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Edit3, Mail, Save, Upload } from 'lucide-react'
import { FileUpload } from '@/components/site/file-upload'
import { insertService, deleteService, insertServiceArea, updateServiceArea, insertTestimonial, updateTestimonial, deleteTestimonial, updateQuoteStatus, updateQuoteNotes, updateQuoteDetails, uploadServiceAreaImage, uploadServiceImage } from '@/lib/supabase/admin-actions'

export function ServiceManager({ initialServices }: { initialServices: Array<{ id: string; name: string; slug: string; short_description?: string | null; description?: string | null; image_url?: string | null; display_order?: number | null; is_active?: boolean | null }> }) {
  const [services, setServices] = useState(initialServices)
  const [pending, startTransition] = useTransition()
  const [form, setForm] = useState({ name: '', slug: '', short_description: '', description: '', image_url: '', display_order: '99', is_active: 'true' as 'true' | 'false' })
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [lastDeletedService, setLastDeletedService] = useState<{ id: string; name: string; slug: string; short_description?: string | null; description?: string | null; image_url?: string | null; display_order?: number | null; is_active?: boolean | null } | null>(null)

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
        let imageUrl: string | undefined
        if (file) {
          const uploadResult = await uploadServiceImage(file)
          if (!uploadResult.success) {
            alert(uploadResult.error || 'Unable to upload image.')
            return
          }
          imageUrl = uploadResult.url
        }

        const result = await insertService({
          name: form.name,
          slug: form.slug,
          short_description: form.short_description || undefined,
          description: form.description || undefined,
          image_url: imageUrl || form.image_url || undefined,
          display_order: Number(form.display_order),
          is_active: form.is_active === 'true',
        })
        if (result.success) {
          setServices((current) => [...current, { id: `${Date.now()}`, name: form.name, slug: form.slug, short_description: form.short_description, description: form.description, image_url: imageUrl ?? form.image_url ?? null, display_order: Number(form.display_order), is_active: form.is_active === 'true' }])
          setForm({ name: '', slug: '', short_description: '', description: '', image_url: '', display_order: '99', is_active: 'true' })
          setFile(null)
          setPreviewUrl(null)
        }
      }

      if (action === 'delete' && id) {
        if (!confirm('Are you sure you want to delete this service? This action is permanent.')) {
          return
        }

        const deleted = services.find((item) => item.id === id)
        if (!deleted) return

        const result = await deleteService(id)
        if (result.success) {
          setLastDeletedService(deleted)
          setServices((current) => current.filter((item) => item.id !== id))
        }
      }
    })
  }

  const undoDelete = () => {
    if (!lastDeletedService) return
    startTransition(async () => {
      const result = await insertService({
        name: lastDeletedService.name,
        slug: lastDeletedService.slug,
        short_description: lastDeletedService.short_description || undefined,
        description: lastDeletedService.description || undefined,
        image_url: lastDeletedService.image_url || undefined,
        display_order: lastDeletedService.display_order || 99,
        is_active: lastDeletedService.is_active ?? true,
      })
      if (result.success) {
        setServices((current) => [...current, lastDeletedService])
        setLastDeletedService(null)
      }
    })
  }

  return (
    <div className="space-y-6">
      {lastDeletedService && (
        <div className="rounded-[1.5rem] border border-[#DCE5E1] bg-[#FFF9E9] p-5 text-sm text-[#7A5A0E] shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Service <span className="font-semibold">{lastDeletedService.name}</span> was deleted. You can undo this in a few minutes.
            </p>
            <button
              type="button"
              onClick={undoDelete}
              className="rounded-full bg-[#0F5B4F] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#093D35]"
            >
              Undo Delete
            </button>
          </div>
        </div>
      )}
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
          <div className="md:col-span-2">
            <Label>Upload photo</Label>
            <div className="mt-2">
              <FileUpload
                onFileSelect={(file) => setFile(file)}
                onPreviewChange={(url) => setPreviewUrl(url)}
                previewUrl={previewUrl}
                maxSizeMB={5}
                accept="image/*"
              />
            </div>
            <p className="mt-2 text-xs text-[#60716D]">Upload a photo from your device for this service.</p>
          </div>
          <div>
            <Label>Display order</Label>
            <Input type="number" value={form.display_order} onChange={(event) => setForm((current) => ({ ...current, display_order: event.target.value }))} />
          </div>
          <div>
            <Label>Status</Label>
            <div className="mt-2 flex items-center gap-3">
              <label className="inline-flex items-center gap-2 rounded-full border border-[#DCE5E1] bg-white px-3 py-2 text-sm text-[#14221F] hover:border-[#0F5B4F]">
                <input
                  type="radio"
                  name="service-status"
                  value="true"
                  checked={form.is_active === 'true'}
                  onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.value as 'true' | 'false' }))}
                  className="h-4 w-4 accent-[#0F5B4F]"
                />
                Active
              </label>
              <label className="inline-flex items-center gap-2 rounded-full border border-[#DCE5E1] bg-white px-3 py-2 text-sm text-[#14221F] hover:border-[#0F5B4F]">
                <input
                  type="radio"
                  name="service-status"
                  value="false"
                  checked={form.is_active === 'false'}
                  onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.value as 'true' | 'false' }))}
                  className="h-4 w-4 accent-[#0F5B4F]"
                />
                Inactive
              </label>
            </div>
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

export function ServiceAreaManager({ initialAreas }: { initialAreas: Array<{ id: string; name: string; slug: string; description?: string | null; image_url?: string | null; display_order?: number | null; is_active?: boolean | null }> }) {
  const [areas, setAreas] = useState(initialAreas)
  const [pending, startTransition] = useTransition()
  const [form, setForm] = useState({ name: '', slug: '', description: '', display_order: '99', is_active: 'true' as 'true' | 'false' })
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [editingAreaId, setEditingAreaId] = useState<string | null>(null)

  async function submit() {
    startTransition(async () => {
      // If editing an existing area, update it
      if (editingAreaId) {
        let imageUrl: string | undefined
        if (file) {
          const uploadResult = await uploadServiceAreaImage(file)
          if (!uploadResult.success) {
            alert(uploadResult.error || 'Unable to upload image.')
            return
          }
          imageUrl = uploadResult.url
        }

        const result = await updateServiceArea(editingAreaId, {
          name: form.name,
          slug: form.slug,
          description: form.description || null,
          image_url: imageUrl ?? undefined,
          display_order: Number(form.display_order),
          is_active: form.is_active === 'true',
        })

        if (result.success) {
          setAreas((current) => current.map((a) => a.id === editingAreaId ? { ...a, name: form.name, slug: form.slug, description: form.description, image_url: imageUrl ?? a.image_url, display_order: Number(form.display_order), is_active: form.is_active === 'true' } : a))
          setForm({ name: '', slug: '', description: '', display_order: '99', is_active: 'true' })
          setFile(null)
          setPreviewUrl(null)
          setEditingAreaId(null)
        }

        return
      }

      // Create new area
      let imageUrl: string | undefined
      if (file) {
        const uploadResult = await uploadServiceAreaImage(file)
        if (!uploadResult.success) {
          alert(uploadResult.error || 'Unable to upload image.')
          return
        }
        imageUrl = uploadResult.url
      }

      const result = await insertServiceArea({
        name: form.name,
        slug: form.slug,
        description: form.description || undefined,
        image_url: imageUrl,
        display_order: Number(form.display_order),
        is_active: form.is_active === 'true',
      })
      if (result.success) {
        setAreas((current) => [...current, { id: `${Date.now()}`, name: form.name, slug: form.slug, description: form.description, image_url: imageUrl ?? null, display_order: Number(form.display_order), is_active: form.is_active === 'true' }])
        setForm({ name: '', slug: '', description: '', display_order: '99', is_active: 'true' })
        setFile(null)
        setPreviewUrl(null)
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
          <div className="md:col-span-2">
            <Label>Upload photo</Label>
            <div className="mt-2">
              <FileUpload
                onFileSelect={(file) => setFile(file)}
                onPreviewChange={(url) => setPreviewUrl(url)}
                previewUrl={previewUrl}
                maxSizeMB={5}
                accept="image/*"
              />
            </div>
            <p className="mt-2 text-xs text-[#60716D]">Upload a photo from your device for this service area.</p>
          </div>
          <div><Label>Display order</Label><Input type="number" value={form.display_order} onChange={(event) => setForm((current) => ({ ...current, display_order: event.target.value }))} /></div>
          <div>
            <Label>Status</Label>
            <div className="mt-2 flex items-center gap-3">
              <label className="inline-flex items-center gap-2 rounded-full border border-[#DCE5E1] bg-white px-3 py-2 text-sm text-[#14221F] hover:border-[#0F5B4F]">
                <input
                  type="radio"
                  name="area-status"
                  value="true"
                  checked={form.is_active === 'true'}
                  onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.value as 'true' | 'false' }))}
                  className="h-4 w-4 accent-[#0F5B4F]"
                />
                Active
              </label>
              <label className="inline-flex items-center gap-2 rounded-full border border-[#DCE5E1] bg-white px-3 py-2 text-sm text-[#14221F] hover:border-[#0F5B4F]">
                <input
                  type="radio"
                  name="area-status"
                  value="false"
                  checked={form.is_active === 'false'}
                  onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.value as 'true' | 'false' }))}
                  className="h-4 w-4 accent-[#0F5B4F]"
                />
                Inactive
              </label>
            </div>
          </div>
        </div>
        <div className="mt-4"><Label>Description</Label><Textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} /></div>
        <div className="mt-4 flex gap-2">
          <Button className="rounded-full bg-[#0F5B4F] text-white hover:bg-[#093D35]" onClick={submit} disabled={pending}>{editingAreaId ? 'Save changes' : 'Add service area'}</Button>
          {editingAreaId && (
            <Button variant="outline" onClick={() => {
              setEditingAreaId(null)
              setForm({ name: '', slug: '', description: '', display_order: '99', is_active: 'true' })
              setFile(null)
              setPreviewUrl(null)
            }} disabled={pending}>Cancel</Button>
          )}
        </div>
      </div>
      <div className="space-y-4">
        {areas.map((area) => (
          <div key={area.id} className="rounded-[1.25rem] border border-[#DCE5E1] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-[#14221F]">{area.name}</p>
                <p className="mt-1 text-sm text-[#60716D]">{area.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingAreaId(area.id)
                    setForm({ name: area.name, slug: area.slug, description: area.description ?? '', display_order: String(area.display_order ?? 99), is_active: area.is_active ? 'true' : 'false' })
                    setPreviewUrl(area.image_url ?? null)
                    setFile(null)
                  }}
                  className="rounded-full border border-[#DCE5E1] bg-white p-2 text-[#0F5B4F] transition hover:border-[#0F5B4F] hover:bg-[#F5F7F2]"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>
            </div>
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
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ customer_name: '', location: '', review: '', rating: '5', is_published: 'true' as 'true' | 'false' })

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

  function startEditing(testimonial: typeof initialTestimonials[0]) {
    setEditingId(testimonial.id)
    setEditForm({
      customer_name: testimonial.customer_name,
      location: testimonial.location ?? '',
      review: testimonial.review,
      rating: String(testimonial.rating),
      is_published: testimonial.is_published ? 'true' : 'false',
    })
  }

  function cancelEditing() {
    setEditingId(null)
    setEditForm({ customer_name: '', location: '', review: '', rating: '5', is_published: 'true' })
  }

  async function saveEdit(id: string) {
    startTransition(async () => {
      const result = await updateTestimonial(id, {
        customer_name: editForm.customer_name,
        location: editForm.location || null,
        review: editForm.review,
        rating: Number(editForm.rating),
        is_published: editForm.is_published === 'true',
      })
      if (result.success) {
        setTestimonials((current) => current.map((t) => t.id === id ? { ...t, ...editForm, rating: Number(editForm.rating), is_published: editForm.is_published === 'true' } : t))
        cancelEditing()
      }
    })
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this testimonial?')) return
    startTransition(async () => {
      const result = await deleteTestimonial(id)
      if (result.success) {
        setTestimonials((current) => current.filter((t) => t.id !== id))
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
          editingId === testimonial.id ? (
            <div key={testimonial.id} className="rounded-[1.25rem] border border-[#0F5B4F] bg-white p-5 shadow-md">
              <div className="space-y-3">
                <div><Label>Customer name</Label><Input value={editForm.customer_name} onChange={(event) => setEditForm((current) => ({ ...current, customer_name: event.target.value }))} className="mt-2 rounded-full border-[#DCE5E1]" /></div>
                <div><Label>Location</Label><Input value={editForm.location} onChange={(event) => setEditForm((current) => ({ ...current, location: event.target.value }))} className="mt-2 rounded-full border-[#DCE5E1]" /></div>
                <div><Label>Rating</Label><Input type="number" min="1" max="5" value={editForm.rating} onChange={(event) => setEditForm((current) => ({ ...current, rating: event.target.value }))} className="mt-2 rounded-full border-[#DCE5E1]" /></div>
                <div><Label>Review</Label><Textarea value={editForm.review} onChange={(event) => setEditForm((current) => ({ ...current, review: event.target.value }))} rows={3} className="mt-2 rounded-xl border-[#DCE5E1]" /></div>
                <div className="flex gap-2">
                  <Button onClick={() => saveEdit(testimonial.id)} disabled={pending} className="flex-1 rounded-full bg-[#0F5B4F] text-white hover:bg-[#093D35]">Save</Button>
                  <Button onClick={cancelEditing} variant="outline" className="flex-1 rounded-full">Cancel</Button>
                </div>
              </div>
            </div>
          ) : (
            <div key={testimonial.id} className="rounded-[1.25rem] border border-[#DCE5E1] p-5 flex justify-between items-start">
              <div className="flex-1">
                <p className="font-semibold text-[#14221F]">{testimonial.customer_name}</p>
                <p className="text-xs text-[#60716D] mt-1">{testimonial.location ? `${testimonial.location} • ` : ''}{'★'.repeat(testimonial.rating)}</p>
                <p className="mt-2 text-sm leading-7 text-[#60716D]">{testimonial.review}</p>
              </div>
              <div className="ml-4 flex gap-2">
                <button
                  onClick={() => startEditing(testimonial)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0F5B4F] text-white hover:bg-[#093D35] transition"
                  disabled={pending}
                  title="Edit"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50"
                  disabled={pending}
                  title="Delete"
                >
                  ×
                </button>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  )
}

export function QuoteManager({ initialQuotes }: { initialQuotes: Array<{ id: string; full_name: string; email: string; phone?: string | null; details?: string | null; status: string; admin_notes?: string | null }> }) {
  const [quotes, setQuotes] = useState(initialQuotes)
  const [pending, startTransition] = useTransition()
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null)
  const [editingDetails, setEditingDetails] = useState('')

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

  async function updateDetails(id: string, details: string) {
    startTransition(async () => {
      const result = await updateQuoteDetails(id, details)
      if (result.success) {
        setQuotes((current) => current.map((quote) => quote.id === id ? { ...quote, details } : quote))
        setEditingQuoteId(null)
      }
    })
  }

  const getMailtoLink = (quote: { full_name: string; email: string; details?: string | null }) => {
    const subject = encodeURIComponent('Summit Clean Co. - Quote confirmation')
    const body = encodeURIComponent(
      `Hi ${quote.full_name}, Thank you for your quote request. We are confirming that we received your request and will follow up shortly. Quote details: ${quote.details ?? 'No details provided.'} Best regards, Summit Clean Co.`
    )
    return `mailto:${quote.email}?subject=${subject}&body=${body}`
  }

  const startEditing = (quote: { id: string; details?: string | null }) => {
    setEditingQuoteId(quote.id)
    setEditingDetails(quote.details ?? '')
  }

  const cancelEditing = () => {
    setEditingQuoteId(null)
    setEditingDetails('')
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
          <div className="mt-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm leading-7 text-[#60716D]">
                {quote.details ?? 'No additional details provided.'}
              </p>
              <button
                type="button"
                onClick={() => startEditing(quote)}
                className="rounded-full border border-[#DCE5E1] bg-white p-2 text-[#0F5B4F] transition hover:border-[#0F5B4F] hover:bg-[#F5F7F2]"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            </div>
            {editingQuoteId === quote.id && (
              <div className="mt-4 space-y-3 rounded-[1.5rem] border border-[#DCE5E1] bg-[#F5F7F2] p-4">
                <Label>Editable quote details</Label>
                <Textarea value={editingDetails} onChange={(event) => setEditingDetails(event.target.value)} rows={5} />
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={cancelEditing} disabled={pending}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => updateDetails(quote.id, editingDetails)} disabled={pending}>
                    <Save className="mr-2 h-4 w-4" /> Save details
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4">
            <Label>Admin notes</Label>
            <div className="mt-2 flex items-start gap-3">
              <Textarea defaultValue={quote.admin_notes ?? ''} onBlur={(event) => updateNote(quote.id, event.target.value)} className="flex-1" />
              <a href={getMailtoLink(quote)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#0F5B4F] px-4 py-3 text-white hover:bg-[#093D35] transition-colors whitespace-nowrap">
                <Mail className="h-4 w-4" />
                <span>Send confirmation</span>
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
