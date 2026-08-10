"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { createContactMessage } from '@/lib/supabase/actions'

const schema = z.object({
  name: z.string().min(2, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email.'),
  phone: z.string().optional().or(z.literal('')),
  message: z.string().min(10, 'Please share a few details.'),
})

type FormValues = z.infer<typeof schema>

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    setError(null)
    const result = await createContactMessage({
      name: values.name,
      email: values.email,
      phone: values.phone || undefined,
      message: values.message,
    })
    setIsSubmitting(false)
    if (result.success) {
      setSubmitted(true)
      return
    }
    setError(result.error ?? 'Unable to send your message right now.')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-[1.5rem] border border-[#DCE5E1] border-l-4 border-l-[#1f7768] bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-[#14221F]">Send us a message</h2>
      <p className="mt-2 text-sm text-[#60716D]">We’ll reply as soon as possible.</p>
      <div className="mt-6 grid gap-5">
        <div>
          <Label htmlFor="name">Name</Label>
          <div className="mt-2">
            <Input
              id="name"
              {...register('name')}
              className="h-10 w-full rounded-md !border !border-[#1f7768] bg-white px-3 py-2 text-[#0f3d35] placeholder:text-[#6b9286] focus-visible:border-[#E7C858] focus-visible:ring-2 focus-visible:ring-[#E7C858]/20 transition-colors duration-150"
            />
          </div>
          {errors.name && <p className="mt-2 text-sm text-[#b42318]">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <div className="mt-2">
            <Input
              id="email"
              type="email"
              {...register('email')}
              className="h-10 w-full rounded-md !border !border-[#1f7768] bg-white px-3 py-2 text-[#0f3d35] placeholder:text-[#6b9286] focus-visible:border-[#E7C858] focus-visible:ring-2 focus-visible:ring-[#E7C858]/20 transition-colors duration-150"
            />
          </div>
          {errors.email && <p className="mt-2 text-sm text-[#b42318]">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <div className="mt-2">
            <Input
              id="phone"
              {...register('phone')}
              className="h-10 w-full rounded-md !border !border-[#1f7768] bg-white px-3 py-2 text-[#0f3d35] placeholder:text-[#6b9286] focus-visible:border-[#E7C858] focus-visible:ring-2 focus-visible:ring-[#E7C858]/20 transition-colors duration-150"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="message">Message</Label>
          <div className="mt-2">
            <Textarea
              id="message"
              rows={5}
              {...register('message')}
              className="min-h-[120px] w-full rounded-md !border !border-[#1f7768] bg-white px-3 py-2 text-[#0f3d35] placeholder:text-[#6b9286] focus-visible:border-[#E7C858] focus-visible:ring-2 focus-visible:ring-[#E7C858]/20 transition-colors duration-150"
            />
          </div>
          {errors.message && <p className="mt-2 text-sm text-[#b42318]">{errors.message.message}</p>}
        </div>
      </div>
      {submitted && <p className="mt-6 rounded-xl bg-[#DFEEE8] p-3 text-sm text-[#0F5B4F]">Thanks! Your message has been received.</p>}
      {error && <p className="mt-6 rounded-xl bg-[#fef3f2] p-3 text-sm text-[#b42318]">{error}</p>}
      <Button type="submit" className="mt-8 rounded-full bg-[#0F5B4F] px-6 text-white hover:bg-[#093D35]" disabled={isSubmitting}>
        {isSubmitting ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  )
}
