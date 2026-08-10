import { QuoteForm } from '@/components/site/quote-form'
import { AnimatedSection } from '@/components/site/animated-section'

export const metadata = {
  title: 'Free Quote | Summit Clean Co.',
  description: 'Request a free quote for cleaning services in Abbotsford and the Fraser Valley.',
}

export default function QuotePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0F5B4F]">Free quote</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#14221F] sm:text-5xl">Tell us what needs cleaning.</h1>
        <p className="mt-6 text-lg leading-8 text-[#60716D]">Share a few details and Summit Clean Co. can follow up about your cleaning needs.</p>
      </div>
      <div className="mt-10">
        <AnimatedSection>
          <QuoteForm />
        </AnimatedSection>
      </div>
    </main>
  )
}
