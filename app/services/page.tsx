import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AnimatedSection } from '@/components/site/animated-section'
import { ServiceCard } from '@/components/site/service-card'
import { getServices } from '@/lib/supabase/data'
import type { ServiceRow } from '@/lib/types'

export const metadata = {
  title: 'Services | Summit Clean Co.',
  description: 'Explore residential, office, and commercial cleaning services in Abbotsford and the Fraser Valley.',
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

const getServiceName = (service: ServiceRow) => {
  if (service.slug === 'office-cleaning') {
    return 'Office Cleaning'
  }
  return service.name
}

const getServiceDescription = (service: ServiceRow) => {
  if (service.slug === 'office-cleaning') {
    return service.description ?? service.short_description ?? 'Reliable office cleaning for desks, meeting rooms, and shared spaces.'
  }
  return service.description ?? service.short_description ?? ''
}

const fallbackServiceImages = [
  'https://images.pexels.com/photos/4095884/pexels-photo-4095884.jpeg?auto=compress&cs=tinysrgb&w=1200',
  '/images/residential-custom.jpg',
  'https://images.pexels.com/photos/4383868/pexels-photo-4383868.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/3958210/pexels-photo-3958210.jpeg?auto=compress&cs=tinysrgb&w=1200',
]

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const resolvedParams = await searchParams
  const q = resolvedParams?.q?.trim()?.toLowerCase() || ''

  const allServices = await getServices()
  const services = q
    ? (allServices as ServiceRow[]).filter(
        (service) =>
          service.name.toLowerCase().includes(q) ||
          (service.description ?? service.short_description ?? '')
            .toLowerCase()
            .includes(q)
      )
    : (allServices as ServiceRow[])

  return (
    <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0F5B4F]">
          {q ? `Search Results for "${q}"` : 'Services'}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#14221F] sm:text-5xl">
          {q ? 'Here is what we found.' : 'Premium residential, office, and commercial cleaning.'}
        </h1>
        <p className="mt-6 text-lg leading-8 text-[#60716D]">
          {q
            ? `Displaying ${services.length} services matching your search.`
            : 'Every service is tailored to meet your property, schedule, and standard of care, including dedicated office cleaning services.'}
        </p>
      </div>
      {services.length === 0 ? (
        <div className="mt-12 rounded-[2rem] border border-[#DCE5E1] bg-white p-12 text-center">
          <p className="text-lg text-[#60716D]">No services found matching &ldquo;{resolvedParams?.q}&rdquo;.</p>
          <Link
            href="/services"
            className="mt-6 inline-flex rounded-full bg-[#0F5B4F] px-6 py-3 text-white hover:bg-[#093D35]"
          >
            View All Services
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {services.map((service, index) => (
            <AnimatedSection key={service.id} delay={index * 0.06}>
              <ServiceCard
                id={service.id}
                name={getServiceName(service)}
                description={getServiceDescription(service)}
                image_url={getServiceImage(getServiceName(service)) ?? service.image_url}
                slug={service.slug}
                fallbackImage={fallbackServiceImages[index % fallbackServiceImages.length]}
              />
            </AnimatedSection>
          ))}
        </div>
      )}
    </main>
  )
}
