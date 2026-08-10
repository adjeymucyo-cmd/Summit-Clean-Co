import { AnimatedSection } from '@/components/site/animated-section'
import { getServiceAreas } from '@/lib/supabase/data'
import type { ServiceAreaRow } from '@/lib/types'

export const metadata = {
  title: 'Service Areas | Summit Clean Co.',
  description: 'Summit Clean Co. serves Abbotsford and surrounding Fraser Valley communities.',
}

export default async function ServiceAreasPage() {
  const areas = await getServiceAreas()

  return (
    <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0F5B4F]">Service areas</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#14221F] sm:text-5xl">Cleaning services in Abbotsford & the Fraser Valley.</h1>
        <p className="mt-6 text-lg leading-8 text-[#60716D]">Summit Clean Co. is based in Abbotsford, British Columbia and serves surrounding Fraser Valley areas.</p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {(areas as ServiceAreaRow[]).map((area, index) => (
          <AnimatedSection key={area.id} delay={index * 0.06}>
            <article className="rounded-[1.5rem] border border-[#DCE5E1] bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(15,91,79,0.08)]">
            <h2 className="text-2xl font-semibold text-[#14221F]">{area.name}</h2>
            <p className="mt-4 text-sm leading-7 text-[#60716D]">{area.description}</p>
            <div className="mt-6 inline-flex rounded-full bg-[#DFEEE8] px-3 py-1 text-sm font-medium text-[#0F5B4F]">
              {area.is_active ? 'Active service area' : 'Coming soon'}
            </div>
          </article>
          </AnimatedSection>
        ))}
      </div>
    </main>
  )
}
