"use client"

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createQuoteRequest } from '@/lib/supabase/actions'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  full_name: z.string().min(2, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email.'),
  phone: z.string().optional().or(z.literal('')),
  service_id: z.string().min(1, 'Please choose a service.'),
  property_type: z.string().optional(),
  preferred_date: z.string().optional().or(z.literal('')),
  preferred_contact: z.string().min(1, 'Please choose a contact method.'),
  address: z.string().optional().or(z.literal('')),
  property_size: z.string().optional().or(z.literal('')),
  frequency: z.string().optional().or(z.literal('')),
  details: z.string().optional().or(z.literal('')),
})

type FormValues = z.infer<typeof schema>

type ServiceOption = {
  value: string
  label: string
}

export function QuoteForm() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([])
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    async function loadServices() {
      const supabase = createClient()
      if (!supabase) {
        setServiceOptions([])
        return
      }

      const { data, error } = await supabase.from('services').select('id,name').eq('is_active', true).order('display_order', { ascending: true })
      if (!error && data) {
        setServiceOptions(data.map((service: { id: string; name: string }) => ({ value: service.id, label: service.name })))
      }
    }

    loadServices()
  }, [])

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    setError(null)
    const result = await createQuoteRequest({
      full_name: values.full_name,
      email: values.email,
      phone: values.phone || null,
      service_id: values.service_id || null,
      property_type: values.property_type || null,
      preferred_date: values.preferred_date || null,
      preferred_contact: values.preferred_contact || null,
      address: values.address || null,
      property_size: values.property_size || null,
      frequency: values.frequency || null,
      details: values.details || null,
    })
    setIsSubmitting(false)
    if (result.success) {
      setSubmitted(true)
      return
    }
    setError(result.error ?? 'Unable to submit your request right now.')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-[2rem] border border-[#DCE5E1] bg-white p-8 shadow-sm">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="full_name">Full name</Label>
          <Input id="full_name" {...register('full_name')} className="mt-2" />
          {errors.full_name && <p className="mt-2 text-sm text-[#b42318]">{errors.full_name.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} className="mt-2" />
          {errors.email && <p className="mt-2 text-sm text-[#b42318]">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register('phone')} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="service_id">Service needed</Label>
          <Select onValueChange={(value) => setValue('service_id', value)} value={watch('service_id')}>
            <SelectTrigger className="mt-2 w-full"><SelectValue placeholder="Select a service" /></SelectTrigger>
            <SelectContent>
              {serviceOptions.length > 0 ? serviceOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>) : <SelectItem value="" disabled>No services available</SelectItem>}
            </SelectContent>
          </Select>
          {errors.service_id && <p className="mt-2 text-sm text-[#b42318]">{errors.service_id.message}</p>}
        </div>
        <div>
          <Label htmlFor="property_type">Property type</Label>
          <Input id="property_type" {...register('property_type')} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="preferred_date">Preferred date</Label>
          <Input id="preferred_date" type="date" {...register('preferred_date')} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="preferred_contact">Preferred contact</Label>
          <Input id="preferred_contact" {...register('preferred_contact')} className="mt-2" />
          {errors.preferred_contact && <p className="mt-2 text-sm text-[#b42318]">{errors.preferred_contact.message}</p>}
        </div>
        <div>
          <Label htmlFor="address">Address / area</Label>
          <Input id="address" {...register('address')} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="property_size">Approximate property size</Label>
          <Input id="property_size" {...register('property_size')} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="frequency">Frequency</Label>
          <Input id="frequency" {...register('frequency')} className="mt-2" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="details">Additional details</Label>
          <Textarea id="details" rows={5} {...register('details')} className="mt-2" />
        </div>
      </div>
      {submitted && <p className="mt-6 rounded-xl bg-[#DFEEE8] p-3 text-sm text-[#0F5B4F]">Thanks! Your quote request has been received. We’ll get back to you soon.</p>}
      {error && <p className="mt-6 rounded-xl bg-[#fef3f2] p-3 text-sm text-[#b42318]">{error}</p>}
      <Button type="submit" className="mt-8 rounded-full bg-[#0F5B4F] px-6 text-white hover:bg-[#093D35]" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting…' : 'Request Free Quote'}
      </Button>
    </form>
  )
}
