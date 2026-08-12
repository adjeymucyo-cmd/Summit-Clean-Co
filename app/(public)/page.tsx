import Link from 'next/link'
import { ArrowRight, PhoneCall, ShieldCheck, Sparkles, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedSection } from '@/components/site/animated-section'
import { LoginStatusBanner } from '@/components/site/login-status-banner'
import { TestimonialCard } from '@/components/site/testimonial-card'
import { getServices, getTestimonials, getSiteSettings } from '@/lib/supabase/data'
import type { ServiceRow, TestimonialRow, SiteSettingRow } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { cookies } from 'next/headers'

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0F5B4F]">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#14221F] sm:text-4xl">{title}</h2>
      <p className="mt-4 text-lg leading-8 text-[#60716D]">{description}</p>
    </div>
  )
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

const homeFallbackServiceImages = [
  'https://images.pexels.com/photos/4095884/pexels-photo-4095884.jpeg?auto=compress&cs=tinysrgb&w=1200',
  '/images/residential-custom.jpg',
]

export default async function HomePage() {
  const [services, testimonials, settings] = await Promise.all([getServices(), getTestimonials(), getSiteSettings()])
  const site = Object.fromEntries((settings as SiteSettingRow[]).map((setting) => [setting.key, setting.value])) as Record<string, string>

  return (
    <main>
      <section className="relative overflow-hidden bg-[#0F5B4F] text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1630463260713-4c08da4de6fd?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-[#031B17]/95" />
        <div className="absolute left-10 top-20 h-64 w-64 rounded-full bg-[#0F5B4F]/25 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-[#0F5B4F]/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:px-8 lg:py-32">
          <div className="max-w-2xl">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#DFEEE8] sm:text-sm">Residential, office & commercial cleaning</p>
            <h1 className="mt-6 text-3xl font-semibold leading-tight sm:text-4xl lg:text-6xl">A cleaner space that feels calm, polished, and inviting.</h1>
            <p className="mt-6 text-base leading-7 text-[#DFEEE8] sm:text-lg sm:leading-8">{site.hero_description ?? 'Professional, reliable cleaning services for homes, offices, kitchens, rooms, and commercial spaces across Abbotsford and the Fraser Valley.'}</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/quote" className="inline-flex items-center justify-center rounded-full bg-[#E7C858] px-5 py-3 text-sm font-semibold text-[#14221F] shadow-lg shadow-[#E7C858]/20 transition hover:bg-[#e0c04d] sm:px-6">
                Get a Free Quote
              </Link>
              <a href="tel:+17785483365" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/20 sm:px-6">
                <PhoneCall className="h-4 w-4" />
                <span>Call 778-548-3365</span>
              </a>
            </div>
            <LoginStatusBanner />
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ['Trusted', '150+ happy local clients'],
                ['Fast', 'Booked within 24 hours'],
                ['Fresh', 'Eco-friendly cleaning products'],
              ].map(([title, value]) => (
                <div key={title} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur transition hover:border-white/30">
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-1 text-sm text-[#DFEEE8]">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
            <div className="rounded-[1.5rem] bg-[#F5F7F2] p-8 text-[#14221F]">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0F5B4F]">Why clients choose us</p>
              <ul className="mt-6 space-y-4 text-sm leading-7 text-[#60716D]">
                <li className="flex gap-3"><ShieldCheck className="mt-1 h-5 w-5 text-[#0F5B4F]" /> Trusted, detail-oriented teams with a premium standard of work.</li>
                <li className="flex gap-3"><Sparkles className="mt-1 h-5 w-5 text-[#0F5B4F]" /> Flexible scheduling for homes, offices, and commercial spaces.</li>
                <li className="flex gap-3"><MapPin className="mt-1 h-5 w-5 text-[#0F5B4F]" /> Local service across Abbotsford and the Fraser Valley.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#EFF8F1] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 rounded-[2rem] border border-[#DCE5E1] bg-white p-5 shadow-[0_14px_40px_rgba(15,91,79,0.06)] sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#0F5B4F]">How it works</p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#14221F] sm:text-3xl lg:text-4xl">Three easy steps to a spotless space.</h2>
              <p className="mt-5 text-base leading-7 text-[#60716D] sm:text-lg sm:leading-8">Book your service, let our professional team clean carefully, then enjoy a refreshed and healthier home or workplace.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['Book online', 'Fast quote and scheduling'],
                ['We clean', 'Trusted teams and premium products'],
                ['Enjoy', 'Comfortable, polished results'],
              ].map((item) => (
                <div key={item[0]} className="rounded-[1.5rem] border border-[#DCE5E1] bg-[#F7FCF8] p-6 text-sm text-[#60716D] shadow-sm">
                  <p className="font-semibold text-[#14221F]">{item[0]}</p>
                  <p className="mt-3 leading-7">{item[1]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <SectionHeading eyebrow="Services" title="Cleaning services built around your needs" description="From routine home cleaning to detailed commercial work, Summit Clean Co. helps keep your space fresh, comfortable, and ready for what comes next." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {(services as ServiceRow[]).map((service, index) => (
            <AnimatedSection key={service.id} delay={index * 0.06}>
              <article className="overflow-hidden rounded-[1.5rem] border border-[#DCE5E1] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,91,79,0.12)]">
                <img src={getServiceImage(service.name) ?? (service.image_url?.trim() ? service.image_url : homeFallbackServiceImages[index % homeFallbackServiceImages.length])} alt={service.name} className="h-48 w-full object-cover" />
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#0F5B4F]">0{index + 1}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-[#14221F]">{service.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#60716D]">{service.short_description ?? service.description}</p>
                  <div className="mt-5 pt-4 border-t border-[#DCE5E1]/60 flex items-center justify-between">
                    <Link href={`/services/${service.slug}`} className="text-sm font-semibold text-[#0F5B4F] hover:text-[#093D35] hover:underline">
                      View Details
                    </Link>
                    <Link href={`/services/${service.slug}`} className="text-[#C6A76B] hover:text-[#0F5B4F] transition-colors">
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:px-8">
          <div className="overflow-hidden rounded-[2rem]">
            <img src="/images/why-choose-us-custom.png" alt="Professional cleaning team" className="h-full min-h-[260px] w-full object-cover sm:min-h-[320px]" />
          </div>
          <AnimatedSection className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0F5B4F]">Why choose us</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#14221F] sm:text-3xl lg:text-4xl">A higher standard of clean.</h2>
            <p className="mt-6 text-base leading-7 text-[#60716D] sm:text-lg sm:leading-8">We believe a clean space should feel noticeably better. Summit Clean Co. is focused on professional service, reliability, attention to detail, and customer satisfaction.</p>
            <ul className="mt-8 space-y-4 text-sm leading-7 text-[#14221F]">
              {['Professional and dependable service', 'Detail-focused cleaning', 'Flexible residential and commercial options', 'Local service in Abbotsford and the Fraser Valley'].map((item) => (
                <li key={item} className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-[#0F5B4F]" /> {item}</li>
              ))}
            </ul>
            <Button asChild className="mt-8 w-fit rounded-full bg-[#0F5B4F] px-6 text-white hover:bg-[#093D35]">
              <Link href="/about">About Summit Clean Co.</Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <SectionHeading eyebrow="Testimonials" title="Trusted by local clients" description="Inspiration from real customer experiences and a steady commitment to quality service." />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {(testimonials as TestimonialRow[]).map((testimonial, index) => (
            <AnimatedSection key={testimonial.id} delay={index * 0.08}>
              <TestimonialCard testimonial={testimonial} />
            </AnimatedSection>
          ))}
        </div>
      </section>
    </main>
  )
}
