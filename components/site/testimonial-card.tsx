'use client'

import { useState, useTransition, useEffect } from 'react'
import { Edit2, Trash2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { updateTestimonial, deleteTestimonial } from '@/lib/supabase/admin-actions'
import { createClient } from '@/lib/supabase/client'
import type { TestimonialRow } from '@/lib/types'

interface TestimonialCardProps {
  testimonial: TestimonialRow
  onUpdate?: (testimonial: TestimonialRow) => void
  onDelete?: (id: string) => void
}

export function TestimonialCard({ testimonial, onUpdate, onDelete }: TestimonialCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [pending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    customer_name: testimonial.customer_name,
    location: testimonial.location ?? '',
    review: testimonial.review,
    rating: testimonial.rating,
  })

  useEffect(() => {
    const checkAdmin = async () => {
      const supabase = createClient()
      if (!supabase) return
      
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.email === 'admin@summitclean.com') {
        setIsAdmin(true)
      }
    }
    
    checkAdmin()
  }, [])

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateTestimonial(testimonial.id, {
        customer_name: formData.customer_name,
        location: formData.location || null,
        review: formData.review,
        rating: formData.rating,
      })
      if (result.success) {
        onUpdate?.({ ...testimonial, ...formData })
        setIsEditing(false)
      }
    })
  }

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return
    startTransition(async () => {
      const result = await deleteTestimonial(testimonial.id)
      if (result.success) {
        onDelete?.(testimonial.id)
      }
    })
  }

  if (isEditing && isAdmin) {
    return (
      <div className="rounded-[1.5rem] border border-[#0F5B4F] bg-white p-6 shadow-md">
        <div className="space-y-4">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-[#0F5B4F]">Customer Name</Label>
            <Input
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              className="mt-2 rounded-xl border-[#DCE5E1]"
            />
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-[#0F5B4F]">Location</Label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="mt-2 rounded-xl border-[#DCE5E1]"
            />
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-[#0F5B4F]">Rating</Label>
            <select
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              className="mt-2 flex h-10 w-full rounded-xl border border-[#DCE5E1] bg-white px-3 py-2 text-sm"
            >
              <option value="1">1 star</option>
              <option value="2">2 stars</option>
              <option value="3">3 stars</option>
              <option value="4">4 stars</option>
              <option value="5">5 stars</option>
            </select>
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-[#0F5B4F]">Review</Label>
            <Textarea
              value={formData.review}
              onChange={(e) => setFormData({ ...formData, review: e.target.value })}
              rows={4}
              className="mt-2 rounded-xl border-[#DCE5E1]"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={pending}
              className="flex-1 rounded-full bg-[#0F5B4F] text-white hover:bg-[#093D35]"
            >
              <Check className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button
              onClick={() => setIsEditing(false)}
              variant="outline"
              className="flex-1 rounded-full"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative rounded-[1.5rem] border border-[#DCE5E1] bg-[#F5F7F2] p-8 transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(15,91,79,0.08)]">
      {isAdmin && (
        <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0F5B4F] text-white hover:bg-[#093D35] transition"
            title="Edit testimonial"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={pending}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50"
            title="Delete testimonial"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
      <div className="flex gap-1 text-[#C6A76B]">{'★'.repeat(testimonial.rating)}</div>
      <p className="mt-4 text-sm leading-7 text-[#60716D]">"{formData.review}"</p>
      <div className="mt-6">
        <p className="font-semibold text-[#14221F]">{formData.customer_name}</p>
        <p className="text-sm text-[#60716D]">{formData.location ?? 'Fraser Valley'}</p>
      </div>
    </div>
  )
}
