import { AnimatedSection } from '@/components/site/animated-section'
import { getServiceAreas } from '@/lib/supabase/data'
import type { ServiceAreaRow } from '@/lib/types'

export const metadata = {
  title: 'Service Areas | Summit Clean Co.',
  description: 'Summit Clean Co. serves Abbotsford and surrounding Fraser Valley communities.',
}

const areaMeta: Record<string, { image: string; description: string }> = {
  'abbotsford': {
    image: 'https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Serving homeowners and businesses across Abbotsford with dependable cleaning support.',
  },
  'downtown': {
    image: '/images/miami-fl.jpg',
    description: 'Full-service residential and commercial cleaning throughout the downtown core.',
  },
  'fraser-valley': {
    image: '/images/new-york-city.jpg',
    description: 'Flexible service coverage across the broader Fraser Valley region.',
  },
  'north-hills': {
    image: '/images/download.jpg',
    description: 'Trusted home cleaning for the North Hills neighborhoods.',
  },
  'surrounding-communities': {
    image: '/images/city.jpg',
    description: 'Additional local service coverage for nearby communities and neighborhoods.',
  },
  'westgate': {
    image: '/images/download-1.jpg',
    description: 'Serving Westgate homes and businesses with dependable care.',
  },
  'summit-valley': {
    image: '/images/download.jpg',
    description: 'Our home base — comprehensive cleaning across Summit Valley.',
  },
  'riverside': {
    image: '/images/new-york-city.jpg',
    description: 'Reliable cleaning services across the Riverside district.',
  },
  'eastpoint': {
    image: '/images/miami-vibes.jpg',
    description: 'Professional cleaning coverage for the Eastpoint area.',
  },
}

const getAreaMeta = (area: ServiceAreaRow) => {
  const meta = areaMeta[area.slug] ?? {
    image: 'https://images.pexels.com/photos/2698519/pexels-photo-2698519.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: area.description ?? 'Trusted local cleaning service across the Fraser Valley.',
  }

  return {
    image: area.image_url?.trim() ? area.image_url : meta.image,
    description: meta.description,
}

}

export default async function ServiceAreasPage() {
  const areas = await getServiceAreas()

  return (
    <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0F5B4F]">Service areas</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#14221F] sm:text-5xl">Cleaning services in Abbotsford & the Fraser Valley.</h1>
        <p className="mt-6 text-lg leading-8 text-[#60716D]">Summit Clean Co. is based in Abbotsford, British Columbia and serves surrounding Fraser Valley areas with care, consistency, and local knowledge.</p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {(areas as ServiceAreaRow[]).map((area, index) => {
          const meta = getAreaMeta(area)
          return (
            <AnimatedSection key={area.id} delay={index * 0.06}>
              <article className="overflow-hidden rounded-[1.5rem] border border-[#DCE5E1] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(15,91,79,0.08)]">
                <img src={meta.image} alt={area.name} className="h-48 w-full object-cover" />
                <div className="p-8">
                  <h2 className="text-2xl font-semibold text-[#14221F]">{area.name}</h2>
                  <p className="mt-4 text-sm leading-7 text-[#60716D]">{meta.description}</p>
                  <div className="mt-6 inline-flex rounded-full bg-[#DFEEE8] px-3 py-1 text-sm font-medium text-[#0F5B4F]">
                    {area.is_active ? 'Active service area' : 'Coming soon'}
                  </div>
                </div>
              </article>
            </AnimatedSection>
          )
        })}
      </div>
    </main>
  )
}
