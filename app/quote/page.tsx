import { QuoteForm } from '@/components/site/quote-form'
import { AnimatedSection } from '@/components/site/animated-section'

export const metadata = {
  title: 'Free Quote | Summit Clean Co.',
  description: 'Request a free quote for cleaning services in Abbotsford and the Fraser Valley.',
}

export default function QuotePage() {
  return (
    <main className="bg-[#e8fbf0] min-h-screen px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#bce2d5] bg-white p-10 shadow-[0_20px_50px_rgba(31,119,104,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f7768]">Free quote</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#0f3d35] sm:text-5xl">Tell us what needs cleaning.</h1>
        <p className="mt-6 text-lg leading-8 text-[#3f675e]">Share a few details and Summit Clean Co. can follow up about your cleaning needs.</p>
        <div className="mt-10">
          <AnimatedSection>
            <div className="rounded-[2rem] border border-[#DCE5E1] bg-white p-8 shadow-sm">
              <QuoteForm />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </main>
  )
}
