import { ContactForm } from '@/components/site/contact-form'
import { AnimatedSection } from '@/components/site/animated-section'

export const metadata = {
  title: 'Contact | Summit Clean Co.',
  description: 'Contact Summit Clean Co. for residential or commercial cleaning support in Abbotsford.',
}

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
        <AnimatedSection className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0F5B4F]">Contact</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#14221F] sm:text-4xl lg:text-5xl">Reach out to Summit Clean Co.</h1>
          <p className="mt-6 text-base leading-7 text-[#60716D] sm:text-lg sm:leading-8">We’re here to answer questions and help you plan your next clean.</p>
          <div className="mt-8 space-y-4 rounded-[1.5rem] bg-white p-5 shadow-sm sm:p-8">
            <div><p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#0F5B4F]">Phone</p><a href="tel:+17785483365" className="mt-1 block text-base text-[#14221F] sm:text-lg">778-548-3365</a></div>
            <div><p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#0F5B4F]">Email</p><a href="mailto:mahordesire767@gmail.com" className="mt-1 block text-base text-[#14221F] sm:text-lg">mahordesire767@gmail.com</a></div>
            <div><p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#0F5B4F]">Location</p><p className="mt-1 text-base text-[#14221F] sm:text-lg">Abbotsford, British Columbia, Canada</p></div>
          </div>
        </AnimatedSection>
        <AnimatedSection>
          <div className="overflow-hidden rounded-[2rem] bg-white">
            <img
              src="/images/revitalize-spring.jpg"
              alt="Cleaning professional carrying supplies"
              className="h-56 w-full object-cover sm:h-72"
            />
          </div>
          <div className="mt-8 rounded-[2rem] bg-white p-4 shadow-sm sm:p-8">
            <ContactForm />
          </div>
        </AnimatedSection>
      </div>
    </main>
  )
}
