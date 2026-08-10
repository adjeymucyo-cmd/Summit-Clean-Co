import { ContactForm } from '@/components/site/contact-form'
import { AnimatedSection } from '@/components/site/animated-section'

export const metadata = {
  title: 'Contact | Summit Clean Co.',
  description: 'Contact Summit Clean Co. for residential or commercial cleaning support in Abbotsford.',
}

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <AnimatedSection className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0F5B4F]">Contact</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#14221F] sm:text-5xl">Reach out to Summit Clean Co.</h1>
          <p className="mt-6 text-lg leading-8 text-[#60716D]">We’re here to answer questions and help you plan your next clean.</p>
          <div className="mt-8 space-y-4 rounded-[1.5rem] border border-[#DCE5E1] bg-white p-8 shadow-sm">
            <div><p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#0F5B4F]">Phone</p><a href="tel:+17785483365" className="mt-1 block text-lg text-[#14221F]">778-548-3365</a></div>
            <div><p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#0F5B4F]">Email</p><a href="mailto:mahordesire767@gmail.com" className="mt-1 block text-lg text-[#14221F]">mahordesire767@gmail.com</a></div>
            <div><p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#0F5B4F]">Location</p><p className="mt-1 text-lg text-[#14221F]">Abbotsford, British Columbia, Canada</p></div>
          </div>
        </AnimatedSection>
        <AnimatedSection>
          <ContactForm />
        </AnimatedSection>
      </div>
    </main>
  )
}
