'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Edit3, Mail, Save, Upload, Trash2, Inbox } from 'lucide-react'
import { FileUpload } from '@/components/site/file-upload'
import { insertService, deleteService, updateService, insertServiceArea, updateServiceArea, insertTestimonial, updateTestimonial, deleteTestimonial, updateQuoteStatus, updateQuoteNotes, updateQuoteDetails, uploadServiceAreaImage, uploadServiceImage, deleteQuoteRequest, deleteServiceArea } from '@/lib/supabase/admin-actions'

export function ServiceManager({ initialServices }: { initialServices: Array<{ id: string; name: string; slug: string; short_description?: string | null; description?: string | null; image_url?: string | null; display_order?: number | null; is_active?: boolean | null }> }) {
  const [services, setServices] = useState(initialServices)
  const [pending, startTransition] = useTransition()
  const [form, setForm] = useState({ name: '', slug: '', short_description: '', description: '', image_url: '', display_order: '99', is_active: 'true' as 'true' | 'false' })
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [lastDeletedService, setLastDeletedService] = useState<{ id: string; name: string; slug: string; short_description?: string | null; description?: string | null; image_url?: string | null; display_order?: number | null; is_active?: boolean | null } | null>(null)
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', short_description: '', description: '' })

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

  const startEditing = (service: { id: string; name: string; short_description?: string | null; description?: string | null }) => {
    setEditingServiceId(service.id)
    setEditForm({
      name: service.name,
      short_description: service.short_description ?? '',
      description: service.description ?? '',
    })
  }

  const cancelEditing = () => {
    setEditingServiceId(null)
    setEditForm({ name: '', short_description: '', description: '' })
  }

  const saveServiceEdit = (serviceId: string) => {
    startTransition(async () => {
      const result = await updateService(serviceId, {
        name: editForm.name,
        short_description: editForm.short_description || null,
        description: editForm.description || null,
      })
      if (result.success) {
        setServices((current) =>
          current.map((s) =>
            s.id === serviceId
              ? { ...s, name: editForm.name, short_description: editForm.short_description, description: editForm.description }
              : s
          )
        )
        cancelEditing()
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
              <div className="flex-1">
                <p className="font-semibold text-[#14221F]">{service.name}</p>
                <p className="mt-1 text-sm text-[#60716D]">{service.short_description}</p>
              </div>
              <div className="flex flex-wrap gap-2 sm:whitespace-nowrap">
                <Button variant="outline" size="sm" onClick={() => startEditing(service)} disabled={pending} className="gap-2">
                  <Edit3 className="h-4 w-4" /> Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => submit('delete', service.id)} disabled={pending}>Delete</Button>
              </div>
            </div>
            {editingServiceId === service.id && (
              <div className="mt-4 space-y-3 rounded-[1.5rem] border border-[#DCE5E1] bg-[#F5F7F2] p-4">
                <Label>Edit service details</Label>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Name</Label>
                    <Input value={editForm.name} onChange={(e) => setEditForm((current) => ({ ...current, name: e.target.value }))} placeholder="Service name" />
                  </div>
                  <div>
                    <Label className="text-xs">Short description</Label>
                    <Input value={editForm.short_description} onChange={(e) => setEditForm((current) => ({ ...current, short_description: e.target.value }))} placeholder="Short description" />
                  </div>
                  <div>
                    <Label className="text-xs">Full description</Label>
                    <Textarea value={editForm.description} onChange={(e) => setEditForm((current) => ({ ...current, description: e.target.value }))} rows={4} placeholder="Full service description..." />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={cancelEditing} disabled={pending}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => saveServiceEdit(service.id)} disabled={pending}>
                    <Save className="mr-2 h-4 w-4" /> Save details
                  </Button>
                </div>
              </div>
            )}
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

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this service area?')) return
    startTransition(async () => {
      const result = await deleteServiceArea(id)
      if (result.success) {
        setAreas((current) => current.filter((a) => a.id !== id))
      } else {
        alert(result.error || 'Failed to delete service area.')
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
                  title="Edit service area"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(area.id)}
                  disabled={pending}
                  className="rounded-full border border-red-200 bg-white p-2 text-red-600 transition hover:border-red-500 hover:bg-red-50"
                  title="Delete service area"
                >
                  <Trash2 className="h-4 w-4" />
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

export function QuoteManager({ initialQuotes }: { initialQuotes: Array<{ id: string; full_name: string; email: string; phone?: string | null; details?: string | null; status: string; admin_notes?: string | null; service_id?: string | null; property_type?: string | null; preferred_date?: string | null; preferred_contact?: string | null; address?: string | null; property_size?: string | null; frequency?: string | null; created_at?: string }> }) {
  const [quotes, setQuotes] = useState(initialQuotes)
  const [pending, startTransition] = useTransition()
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  const selectedQuote = quotes.find(q => q.id === selectedQuoteId)

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

  async function deleteQuote(id: string) {
    if (!confirm('Are you sure you want to delete this quote request?')) return
    startTransition(async () => {
      const result = await deleteQuoteRequest(id)
      if (result.success) {
        setQuotes((current) => current.filter((quote) => quote.id !== id))
        setSelectedQuoteId(null)
      } else {
        alert(result.error || 'Failed to delete quote request.')
      }
    })
  }

  const sendReply = () => {
    if (!selectedQuote || !replyText.trim()) return

    const subject = encodeURIComponent('Re: Your Quote Request - Summit Clean Co.')
    const body = encodeURIComponent(replyText)
    const mailtoLink = `mailto:${selectedQuote.email}?subject=${subject}&body=${body}`
    
    window.location.href = mailtoLink
    setReplyText('')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'booked':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const isNew = (quote: typeof quotes[0]) => quote.status === 'new'

  if (selectedQuote) {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl my-8">
          {/* Close Button */}
          <button
            onClick={() => {
              setSelectedQuoteId(null)
              setReplyText('')
            }}
            className="absolute right-6 top-6 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
          >
            ✕
          </button>

          {/* Header */}
          <div className="border-b-4 border-[#0F5B4F] bg-gradient-to-r from-[#0F5B4F] via-[#1f7768] to-[#0D3D35] px-4 sm:px-8 py-6 text-white rounded-t-3xl">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">{selectedQuote.full_name}</h2>
                <p className="text-[#b8e0d9] text-xs sm:text-sm mt-1">Quote Request Details & Credentials</p>
              </div>
              <span className={`inline-flex items-center rounded-full border-2 px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusColor(selectedQuote.status)} flex-shrink-0`}>
                {selectedQuote.status}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-8 space-y-6 max-h-[calc(100vh-380px)] overflow-y-auto">
            
            {/* Customer Credentials */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-1.5 w-8 bg-gradient-to-r from-[#0F5B4F] to-[#1f7768]"></div>
                <h3 className="text-lg font-bold text-[#0F5B4F] uppercase tracking-wide">Customer Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl border-2 border-[#DCE5E1] bg-gradient-to-br from-[#F5F7F2] to-white p-3 sm:p-4">
                  <p className="text-xs uppercase text-[#60716D] font-bold tracking-wider mb-1">Full Name</p>
                  <p className="text-base font-semibold text-[#0F5B4F]">{selectedQuote.full_name}</p>
                </div>
                <div className="rounded-xl border-2 border-[#DCE5E1] bg-gradient-to-br from-[#F5F7F2] to-white p-3 sm:p-4">
                  <p className="text-xs uppercase text-[#60716D] font-bold tracking-wider mb-1">Email Address</p>
                  <p className="text-base font-semibold text-[#0F5B4F] break-all">{selectedQuote.email}</p>
                </div>
                <div className="rounded-xl border-2 border-[#DCE5E1] bg-gradient-to-br from-[#F5F7F2] to-white p-3 sm:p-4">
                  <p className="text-xs uppercase text-[#60716D] font-bold tracking-wider mb-1">Phone Number</p>
                  <p className="text-base font-semibold text-[#0F5B4F]">{selectedQuote.phone || 'Not provided'}</p>
                </div>
                <div className="rounded-xl border-2 border-[#DCE5E1] bg-gradient-to-br from-[#F5F7F2] to-white p-3 sm:p-4">
                  <p className="text-xs uppercase text-[#60716D] font-bold tracking-wider mb-1">Preferred Contact</p>
                  <p className="text-base font-semibold text-[#0F5B4F]">{selectedQuote.preferred_contact || 'Not specified'}</p>
                </div>
                <div className="rounded-xl border-2 border-[#DCE5E1] bg-gradient-to-br from-[#F5F7F2] to-white p-3 sm:p-4">
                  <p className="text-xs uppercase text-[#60716D] font-bold tracking-wider mb-1">Address / Area</p>
                  <p className="text-base font-semibold text-[#0F5B4F]">{selectedQuote.address || 'Not provided'}</p>
                </div>
                <div className="rounded-xl border-2 border-[#DCE5E1] bg-gradient-to-br from-[#F5F7F2] to-white p-3 sm:p-4">
                  <p className="text-xs uppercase text-[#60716D] font-bold tracking-wider mb-1">Request Date</p>
                  <p className="text-base font-semibold text-[#0F5B4F]">{selectedQuote.created_at ? new Date(selectedQuote.created_at).toLocaleDateString() : 'Not available'}</p>
                </div>
              </div>
            </div>

            {/* Service Requirements */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-1.5 w-8 bg-gradient-to-r from-[#0F5B4F] to-[#1f7768]"></div>
                <h3 className="text-lg font-bold text-[#0F5B4F] uppercase tracking-wide">Service Requirements</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl border-2 border-[#DCE5E1] bg-gradient-to-br from-[#F5F7F2] to-white p-3 sm:p-4">
                  <p className="text-xs uppercase text-[#60716D] font-bold tracking-wider mb-1">Service Type</p>
                  <p className="text-base font-semibold text-[#0F5B4F]">{selectedQuote.service_id || 'Not selected'}</p>
                </div>
                <div className="rounded-xl border-2 border-[#DCE5E1] bg-gradient-to-br from-[#F5F7F2] to-white p-3 sm:p-4">
                  <p className="text-xs uppercase text-[#60716D] font-bold tracking-wider mb-1">Property Type</p>
                  <p className="text-base font-semibold text-[#0F5B4F]">{selectedQuote.property_type || 'Not specified'}</p>
                </div>
                <div className="rounded-xl border-2 border-[#DCE5E1] bg-gradient-to-br from-[#F5F7F2] to-white p-3 sm:p-4">
                  <p className="text-xs uppercase text-[#60716D] font-bold tracking-wider mb-1">Property Size</p>
                  <p className="text-base font-semibold text-[#0F5B4F]">{selectedQuote.property_size || 'Not provided'}</p>
                </div>
                <div className="rounded-xl border-2 border-[#DCE5E1] bg-gradient-to-br from-[#F5F7F2] to-white p-3 sm:p-4">
                  <p className="text-xs uppercase text-[#60716D] font-bold tracking-wider mb-1">Frequency</p>
                  <p className="text-base font-semibold text-[#0F5B4F]">{selectedQuote.frequency || 'Not specified'}</p>
                </div>
                <div className="rounded-xl border-2 border-[#DCE5E1] bg-gradient-to-br from-[#F5F7F2] to-white p-3 sm:p-4 md:col-span-2">
                  <p className="text-xs uppercase text-[#60716D] font-bold tracking-wider mb-1">Preferred Date</p>
                  <p className="text-base font-semibold text-[#0F5B4F]">{selectedQuote.preferred_date || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Customer Message */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-1.5 w-8 bg-gradient-to-r from-[#0F5B4F] to-[#1f7768]"></div>
                <h3 className="text-lg font-bold text-[#0F5B4F] uppercase tracking-wide">Customer Message</h3>
              </div>
              <div className="rounded-xl border-l-4 border-[#0F5B4F] bg-gradient-to-r from-[#F0FAF8] to-white p-4">
                <p className="text-[#14221F] leading-6 whitespace-pre-wrap text-sm">
                  {selectedQuote.details || 'No additional details provided.'}
                </p>
              </div>
            </div>

            {/* Admin Notes */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-1.5 w-8 bg-gradient-to-r from-[#0F5B4F] to-[#1f7768]"></div>
                <h3 className="text-lg font-bold text-[#0F5B4F] uppercase tracking-wide">Admin Notes</h3>
              </div>
              <Textarea
                defaultValue={selectedQuote.admin_notes ?? ''}
                onBlur={(event) => updateNote(selectedQuote.id, event.target.value)}
                placeholder="Add your internal notes here..."
                rows={2}
                className="rounded-xl border-2 border-[#DCE5E1] text-sm"
              />
            </div>

            {/* Status Update */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-1.5 w-8 bg-gradient-to-r from-[#0F5B4F] to-[#1f7768]"></div>
                <h3 className="text-lg font-bold text-[#0F5B4F] uppercase tracking-wide">Update Status</h3>
              </div>
              <select
                value={selectedQuote.status}
                onChange={(event) => updateStatus(selectedQuote.id, event.target.value)}
                className="w-full rounded-xl border-2 border-[#DCE5E1] bg-white px-3 py-2 text-sm font-semibold text-[#14221F] hover:border-[#0F5B4F] transition"
                disabled={pending}
              >
                <option value="new">📩 New</option>
                <option value="booked">📅 Booked</option>
                <option value="completed">✓ Completed</option>
              </select>
            </div>

            {/* Compose Reply */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-1.5 w-8 bg-gradient-to-r from-[#0F5B4F] to-[#1f7768]"></div>
                <h3 className="text-lg sm:text-xl font-bold text-[#0F5B4F] uppercase tracking-wide">Compose Reply</h3>
              </div>
              <div className="space-y-2">
                <Textarea
                  value={replyText}
                  onChange={(event) => setReplyText(event.target.value)}
                  placeholder="Write your response to the customer here..."
                  rows={4}
                  className="rounded-2xl border-2 border-[#DCE5E1] text-sm"
                />
                <p className="text-xs text-[#60716D]">To: <span className="font-semibold text-[#0F5B4F]">{selectedQuote.email}</span></p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t-4 border-[#0F5B4F] bg-gradient-to-r from-[#F5F7F2] to-white px-4 sm:px-6 py-4 flex flex-wrap gap-2 justify-end rounded-b-3xl">
            <button
              onClick={() => deleteQuote(selectedQuote.id)}
              disabled={pending}
              className="rounded-full border-2 border-red-300 bg-red-50 px-4 py-2 text-xs sm:text-sm font-semibold text-red-600 hover:border-red-500 hover:bg-red-100 transition"
            >
              Delete
            </button>
            <button
              onClick={() => {
                setSelectedQuoteId(null)
                setReplyText('')
              }}
              className="rounded-full border-2 border-[#DCE5E1] bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-[#14221F] hover:bg-[#F5F7F2] transition"
            >
              Close
            </button>
            <button
              onClick={sendReply}
              disabled={pending || !replyText.trim()}
              className="rounded-full bg-gradient-to-r from-[#0F5B4F] to-[#1f7768] px-5 py-2 text-xs sm:text-sm font-semibold text-white hover:shadow-lg hover:from-[#093D35] hover:to-[#0F5B4F] transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Send Reply</span>
              <span className="sm:hidden">Send</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // List View
  return (
    <div className="space-y-4">
      {quotes.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[#DCE5E1] bg-[#F5F7F2] p-12 text-center">
          <Inbox className="mx-auto h-16 w-16 text-[#60716D]/30 mb-4" />
          <p className="text-[#60716D] font-medium text-lg">No quote requests yet</p>
          <p className="text-[#60716D] text-sm mt-1">Customer quotes will appear here</p>
        </div>
      ) : (
        quotes.map((quote) => {
          const isNew = quote.status === 'new'
          return (
            <button
              key={quote.id}
              onClick={() => setSelectedQuoteId(quote.id)}
              className={`w-full text-left group rounded-2xl border-2 transition duration-300 p-5 sm:p-6 ${
                isNew
                  ? 'border-[#0F5B4F]/60 bg-gradient-to-r from-[#F0FAF8] to-white hover:border-[#0F5B4F] hover:shadow-lg'
                  : 'border-[#DCE5E1] bg-white hover:border-[#0F5B4F] hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    {isNew && (
                      <div className="flex-shrink-0">
                        <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse"></div>
                      </div>
                    )}
                    <h3 className="text-lg sm:text-xl font-bold text-[#14221F] truncate">{quote.full_name}</h3>
                  </div>
                  <p className="text-sm text-[#60716D] truncate">{quote.email}</p>
                  <p className="text-xs text-[#60716D] mt-1">{quote.address || 'Address not provided'}</p>
                </div>

                <div className="flex-shrink-0 text-right">
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusColor(quote.status)}`}>
                    {quote.status}
                  </span>
                </div>
              </div>

              {/* Message Preview */}
              <div className="mt-3 text-sm text-[#60716D] line-clamp-2 group-hover:text-[#14221F] transition">
                {quote.details || 'No additional details provided.'}
              </div>

              {/* Click to View Indicator */}
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0F5B4F]">
                Click to view full details & reply →
              </div>
            </button>
          )
        })
      )}
    </div>
  )
}
