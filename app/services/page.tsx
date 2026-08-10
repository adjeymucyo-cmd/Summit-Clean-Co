import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedSection } from '@/components/site/animated-section'
import { getServices } from '@/lib/supabase/data'
import type { ServiceRow } from '@/lib/types'

export const metadata = {
  title: 'Services | Summit Clean Co.',
  description: 'Explore residential and commercial cleaning services in Abbotsford and the Fraser Valley.',
}

const serviceImageRules: [RegExp, string][] = [
  [/residential/, '/images/residential-custom.jpg'],
  [/commercial/, '/images/commercial-custom.jpg'],
  [/office/, '/images/office-custom.jpg'],
  [/deep/, '/images/deep-custom.jpg'],
  [/move\s*in.*move\s*out|move\s*in|move\s*out|move-?in|move-?out/, '/images/movein-custom.jpg'],
  [/window/, '/images/window-custom.jpg'],
  [/post.*construction|construction/, 'https://images.pexels.com/photos/4425835/pexels-photo-4425835.jpeg?auto=compress&cs=tinysrgb&w=900'],
  [/interior/, 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=900'],
  [/custom|flexible/, 'https://images.pexels.com/photos/7045698/pexels-photo-7045698.jpeg?auto=compress&cs=tinysrgb&w=900'],
]

const getServiceImage = (serviceName: string) => {
  const normalized = serviceName.toLowerCase().trim()
  return serviceImageRules.find(([rule]) => rule.test(normalized))?.[1]
}

const fallbackServiceImages = [
  'https://images.pexels.com/photos/4095884/pexels-photo-4095884.jpeg?auto=compress&cs=tinysrgb&w=1200',
  '/images/residential-custom.jpg',
  'https://images.pexels.com/photos/4383868/pexels-photo-4383868.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/3958210/pexels-photo-3958210.jpeg?auto=compress&cs=tinysrgb&w=1200',
]

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0F5B4F]">Services</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#14221F] sm:text-5xl">Premium cleaning for every space.</h1>
        <p className="mt-6 text-lg leading-8 text-[#60716D]">Every service is tailored to meet your property, schedule, and standard of care.</p>
      </div>
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {(services as ServiceRow[]).map((service, index) => (
          <AnimatedSection key={service.id} delay={index * 0.06}>
            <article className="overflow-hidden rounded-[2rem] border border-[#DCE5E1] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,91,79,0.12)]">
            <img
              src={getServiceImage(service.name) ?? (service.image_url?.trim() ? service.image_url : fallbackServiceImages[index % fallbackServiceImages.length])}
              alt={service.name}
              className="h-64 w-full object-cover"
            />
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-[#14221F]">{service.name}</h2>
              <p className="mt-4 text-base leading-8 text-[#60716D]">{service.description ?? service.short_description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-[#DFEEE8] px-3 py-1 text-sm font-medium text-[#0F5B4F]">Flexible scheduling</span>
                <span className="rounded-full bg-[#DFEEE8] px-3 py-1 text-sm font-medium text-[#0F5B4F]">Professional results</span>
              </div>
              <Button asChild className="mt-8 inline-flex rounded-full bg-[#0F5B4F] px-6 text-white hover:bg-[#093D35] whitespace-nowrap">
                <Link href="/quote" className="inline-flex items-center gap-2 whitespace-nowrap">Request this service <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </article>
          </AnimatedSection>
        ))}
      </div>
    </main>
  )
}
