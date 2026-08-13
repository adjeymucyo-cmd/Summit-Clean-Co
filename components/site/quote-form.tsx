"use client"

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { createQuoteRequest } from '@/lib/supabase/actions'
import { createClient } from '@/lib/supabase/client'
import { X, CheckCircle } from 'lucide-react'

const schema = z.object({
  full_name: z.string().min(2, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email.'),
  phone: z.string().optional().or(z.literal('')),
  service_id: z.string().min(1, 'Please choose a service.'),
  property_type: z.string().min(1, 'Please choose a property type.'),
  other_property_type: z.string().optional().or(z.literal('')),
  preferred_date: z.string().optional().or(z.literal('')),
  preferred_contact: z.string().min(1, 'Please choose a contact method.'),
  address: z.string().optional().or(z.literal('')),
  property_size: z.string().optional().or(z.literal('')),
  frequency: z.string().optional().or(z.literal('')),
  details: z.string().optional().or(z.literal('')),
}).superRefine((data, ctx) => {
  if (data.property_type === 'Other' && !data.other_property_type?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['other_property_type'],
      message: 'Please describe your property type.',
    })
  }
})

type FormValues = z.infer<typeof schema>

type ServiceOption = {
  value: string
  label: string
}

export function QuoteForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([])
  const [serviceName, setServiceName] = useState<string>('')
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
    const propertyType = values.property_type === 'Other' ? values.other_property_type?.trim() || values.property_type : values.property_type
    
    // Get service name
    const selectedService = serviceOptions.find(s => s.value === values.service_id)
    setServiceName(selectedService?.label || 'N/A')
    
    const result = await createQuoteRequest({
      full_name: values.full_name,
      email: values.email,
      phone: values.phone || null,
      service_id: values.service_id || null,
      property_type: propertyType || null,
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
      setSubmittedData(values)
      return
    }
    setError(result.error ?? 'Unable to submit your request right now.')
  }

  if (submitted && submittedData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0F5B4F]/95 via-[#1f7768]/90 to-[#0D3D35]/95 backdrop-blur-md p-2 sm:p-4 overflow-hidden">
        <div className="relative w-full max-w-6xl h-screen max-h-screen rounded-3xl bg-white shadow-2xl flex flex-col overflow-hidden">
          {/* Close Button */}
          <button
            onClick={() => {
              setSubmitted(false)
              setSubmittedData(null)
            }}
            className="absolute right-4 top-4 sm:right-6 sm:top-6 z-10 inline-flex items-center justify-center rounded-full p-2 text-[#60716D] hover:bg-[#F5F7F2] transition hover:text-[#0F5B4F]"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Header */}
          <div className="border-b-4 border-[#0F5B4F] bg-gradient-to-r from-[#0F5B4F] via-[#1f7768] to-[#0D3D35] px-4 sm:px-8 py-6 sm:py-8 text-white rounded-t-3xl flex-shrink-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 rounded-full">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold">Success!</h2>
            </div>
            <p className="text-[#b8e0d9] text-sm sm:text-base">Your quote request has been successfully submitted. We'll review your information and get back to you shortly.</p>
          </div>

          {/* Content - Fixed no scroll */}
          <div className="flex-1 overflow-hidden p-4 sm:p-8">
            <div className="space-y-3 h-full flex flex-col">
              {/* Personal Information Section */}
              <div className="flex-shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-1 w-6 bg-gradient-to-r from-[#0F5B4F] to-[#1f7768]"></div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#0F5B4F]">Personal Info</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                  <div className="rounded-xl border border-[#DCE5E1] bg-gradient-to-br from-[#F5F7F2] to-[#DFEEE8] p-3">
                    <p className="text-xs uppercase tracking-wide text-[#60716D] font-bold mb-1">Name</p>
                    <p className="text-xs sm:text-sm font-semibold text-[#0F5B4F]">{submittedData.full_name}</p>
                  </div>
                  <div className="rounded-xl border border-[#DCE5E1] bg-gradient-to-br from-[#F5F7F2] to-[#DFEEE8] p-3">
                    <p className="text-xs uppercase tracking-wide text-[#60716D] font-bold mb-1">Email</p>
                    <p className="text-xs sm:text-sm font-semibold text-[#0F5B4F] truncate">{submittedData.email}</p>
                  </div>
                  <div className="rounded-xl border border-[#DCE5E1] bg-gradient-to-br from-[#F5F7F2] to-[#DFEEE8] p-3">
                    <p className="text-xs uppercase tracking-wide text-[#60716D] font-bold mb-1">Phone</p>
                    <p className="text-xs sm:text-sm font-semibold text-[#0F5B4F]">{submittedData.phone || 'N/A'}</p>
                  </div>
                  <div className="rounded-xl border border-[#DCE5E1] bg-gradient-to-br from-[#F5F7F2] to-[#DFEEE8] p-3">
                    <p className="text-xs uppercase tracking-wide text-[#60716D] font-bold mb-1">Contact</p>
                    <p className="text-xs sm:text-sm font-semibold text-[#0F5B4F] truncate">{submittedData.preferred_contact}</p>
                  </div>
                </div>
              </div>

              {/* Service Details Section */}
              <div className="flex-shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-1 w-6 bg-gradient-to-r from-[#0F5B4F] to-[#1f7768]"></div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#0F5B4F]">Service Details</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                  <div className="rounded-xl border border-[#DCE5E1] bg-gradient-to-br from-[#F5F7F2] to-[#DFEEE8] p-3">
                    <p className="text-xs uppercase tracking-wide text-[#60716D] font-bold mb-1">Service</p>
                    <p className="text-xs sm:text-sm font-semibold text-[#0F5B4F]">{serviceName}</p>
                  </div>
                  <div className="rounded-xl border border-[#DCE5E1] bg-gradient-to-br from-[#F5F7F2] to-[#DFEEE8] p-3">
                    <p className="text-xs uppercase tracking-wide text-[#60716D] font-bold mb-1">Property</p>
                    <p className="text-xs sm:text-sm font-semibold text-[#0F5B4F]">
                      {submittedData.property_type === 'Other' ? submittedData.other_property_type : submittedData.property_type}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#DCE5E1] bg-gradient-to-br from-[#F5F7F2] to-[#DFEEE8] p-3">
                    <p className="text-xs uppercase tracking-wide text-[#60716D] font-bold mb-1">Size</p>
                    <p className="text-xs sm:text-sm font-semibold text-[#0F5B4F]">{submittedData.property_size || 'N/A'}</p>
                  </div>
                  <div className="rounded-xl border border-[#DCE5E1] bg-gradient-to-br from-[#F5F7F2] to-[#DFEEE8] p-3">
                    <p className="text-xs uppercase tracking-wide text-[#60716D] font-bold mb-1">Frequency</p>
                    <p className="text-xs sm:text-sm font-semibold text-[#0F5B4F]">{submittedData.frequency || 'N/A'}</p>
                  </div>
                  <div className="rounded-xl border border-[#DCE5E1] bg-gradient-to-br from-[#F5F7F2] to-[#DFEEE8] p-3">
                    <p className="text-xs uppercase tracking-wide text-[#60716D] font-bold mb-1">Address</p>
                    <p className="text-xs sm:text-sm font-semibold text-[#0F5B4F] truncate">{submittedData.address || 'N/A'}</p>
                  </div>
                  <div className="rounded-xl border border-[#DCE5E1] bg-gradient-to-br from-[#F5F7F2] to-[#DFEEE8] p-3">
                    <p className="text-xs uppercase tracking-wide text-[#60716D] font-bold mb-1">Date</p>
                    <p className="text-xs sm:text-sm font-semibold text-[#0F5B4F]">{submittedData.preferred_date || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Additional Details - Scrollable if needed */}
              {submittedData.details && (
                <div className="flex-1 min-h-0 flex flex-col">
                  <div className="flex items-center gap-2 mb-2 flex-shrink-0">
                    <div className="h-1 w-6 bg-gradient-to-r from-[#0F5B4F] to-[#1f7768]"></div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#0F5B4F]">Details</h3>
                  </div>
                  <div className="rounded-xl border-l-4 border-[#0F5B4F] bg-gradient-to-r from-[#F0FAF8] to-[#E8F5F1] p-3 sm:p-4 overflow-y-auto">
                    <p className="text-xs sm:text-sm text-[#0F5B4F] whitespace-pre-wrap leading-relaxed font-medium">{submittedData.details}</p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              <div className="rounded-xl border-2 border-[#0F5B4F]/30 bg-gradient-to-r from-[#F0FAF8]/80 via-white to-[#E8F5F1]/80 p-3 sm:p-4 flex-shrink-0">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-[#0F5B4F] flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base text-[#0F5B4F] font-bold mb-1">Request Confirmed!</p>
                    <p className="text-xs sm:text-sm text-[#3f675e]">Our team will review your information and contact you shortly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t-2 border-[#DCE5E1] bg-[#F5F7F2] px-4 sm:px-8 py-4 sm:py-6 flex flex-col sm:flex-row gap-3 justify-center flex-shrink-0">
            <button
              onClick={() => {
                setSubmitted(false)
                setSubmittedData(null)
                window.scrollTo(0, 0)
              }}
              className="rounded-full bg-white border-2 border-[#0F5B4F] px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-bold text-[#0F5B4F] hover:bg-[#F0FAF8] hover:shadow-lg transition duration-300"
            >
              Submit Another
            </button>
            <a
              href="/"
              className="rounded-full bg-gradient-to-r from-[#0F5B4F] to-[#1f7768] px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-bold text-white hover:shadow-lg hover:from-[#093D35] hover:to-[#0F5B4F] transition duration-300 text-center"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-full rounded-none sm:rounded-2xl md:rounded-[2rem] border-none sm:border border-black bg-transparent sm:bg-[#F3FCF5] p-3 sm:p-4 md:p-6 lg:p-8 shadow-none sm:shadow-sm">
      <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 md:grid-cols-2">
        <div className="w-full">
          <Label htmlFor="full_name" className="text-xs sm:text-sm">Full name</Label>
          <Input id="full_name" {...register('full_name')} className="w-full mt-1 sm:mt-2 border border-black bg-white h-10 sm:h-11 text-sm px-3" />
          {errors.full_name && <p className="mt-1 text-xs sm:text-sm text-[#b42318]">{errors.full_name.message}</p>}
        </div>
        <div className="w-full">
          <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
          <Input id="email" type="email" {...register('email')} className="w-full mt-1 sm:mt-2 border border-black bg-white h-10 sm:h-11 text-sm px-3" />
          {errors.email && <p className="mt-1 text-xs sm:text-sm text-[#b42318]">{errors.email.message}</p>}
        </div>
        <div className="w-full">
          <Label htmlFor="phone" className="text-xs sm:text-sm">Phone</Label>
          <Input id="phone" {...register('phone')} className="w-full mt-1 sm:mt-2 border border-black bg-white h-10 sm:h-11 text-sm px-3" />
        </div>
        <div className="w-full">
          <Label htmlFor="service_id" className="text-xs sm:text-sm">Service needed</Label>
          <select
            id="service_id"
            {...register('service_id')}
            className="w-full mt-1 sm:mt-2 rounded-lg border border-black bg-white px-3 py-2 text-xs sm:text-sm outline-none h-10 sm:h-11"
          >
            <option value="">Select a service</option>
            {serviceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.service_id && <p className="mt-1 text-xs sm:text-sm text-[#b42318]">{errors.service_id.message}</p>}
        </div>
        <div className="w-full">
          <Label htmlFor="property_type" className="text-xs sm:text-sm">Property type</Label>
          <select
            id="property_type"
            {...register('property_type')}
            className="w-full mt-1 sm:mt-2 rounded-lg border border-black bg-white px-3 py-2 text-xs sm:text-sm outline-none h-10 sm:h-11"
          >
            <option value="">Select a property type</option>
            <option value="Office">Office</option>
            <option value="House">House</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Room">Room</option>
            <option value="Retail">Retail</option>
            <option value="Apartment">Apartment</option>
            <option value="Other">Other</option>
          </select>
          <p className="mt-1 text-xs text-[#60716D]">Choose "Other" to describe a custom property type.</p>
          {errors.property_type && <p className="mt-1 text-xs sm:text-sm text-[#b42318]">{errors.property_type.message}</p>}
        </div>
        {watch('property_type') === 'Other' && (
          <div className="w-full">
            <Label htmlFor="other_property_type" className="text-xs sm:text-sm">Other property type</Label>
            <Input
              id="other_property_type"
              {...register('other_property_type')}
              className="w-full mt-1 sm:mt-2 border border-black bg-white h-10 sm:h-11 text-sm px-3"
              placeholder="Describe your property type"
            />
            {errors.other_property_type && <p className="mt-1 text-xs sm:text-sm text-[#b42318]">{errors.other_property_type.message}</p>}
          </div>
        )}
        <div className="w-full">
          <Label htmlFor="preferred_date" className="text-xs sm:text-sm">Preferred date</Label>
          <Input id="preferred_date" type="date" {...register('preferred_date')} className="w-full mt-1 sm:mt-2 border border-black bg-white h-10 sm:h-11 text-sm px-3" />
        </div>
        <div className="w-full">
          <Label htmlFor="preferred_contact" className="text-xs sm:text-sm">Preferred contact</Label>
          <Input id="preferred_contact" {...register('preferred_contact')} className="w-full mt-1 sm:mt-2 border border-black bg-white h-10 sm:h-11 text-sm px-3" />
          {errors.preferred_contact && <p className="mt-1 text-xs sm:text-sm text-[#b42318]">{errors.preferred_contact.message}</p>}
        </div>
        <div className="w-full">
          <Label htmlFor="address" className="text-xs sm:text-sm">Address / area</Label>
          <Input id="address" {...register('address')} className="w-full mt-1 sm:mt-2 border border-black bg-white h-10 sm:h-11 text-sm px-3" />
        </div>
        <div className="w-full">
          <Label htmlFor="property_size" className="text-xs sm:text-sm">Approximate property size</Label>
          <Input id="property_size" {...register('property_size')} className="w-full mt-1 sm:mt-2 border border-black bg-white h-10 sm:h-11 text-sm px-3" />
        </div>
        <div className="w-full">
          <Label htmlFor="frequency" className="text-xs sm:text-sm">Frequency</Label>
          <Input id="frequency" {...register('frequency')} className="w-full mt-1 sm:mt-2 border border-black bg-white h-10 sm:h-11 text-sm px-3" />
        </div>
        <div className="w-full md:col-span-2">
          <Label htmlFor="details" className="text-xs sm:text-sm">Additional details</Label>
          <Textarea id="details" rows={3} {...register('details')} className="w-full mt-1 sm:mt-2 border border-black bg-white text-sm px-3 py-2" />
        </div>
      </div>
      {error && <p className="mt-4 sm:mt-6 rounded-xl bg-[#fef3f2] p-2 sm:p-3 text-xs sm:text-sm text-[#b42318]">{error}</p>}
      <Button type="submit" className="mt-4 sm:mt-6 w-full rounded-full bg-[#0F5B4F] px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-white hover:bg-[#093D35] sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting…' : 'Request Free Quote'}
      </Button>
    </form>
  )
}
