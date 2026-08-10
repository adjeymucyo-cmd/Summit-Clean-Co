import { ShieldCheck, Sparkles, TrendingUp, HeartHandshake } from 'lucide-react'
import { AnimatedSection } from '@/components/site/animated-section'

const values = [
  { title: 'Professional Service', description: 'Clear communication and respectful service from first contact to final clean.', icon: ShieldCheck },
  { title: 'Reliability', description: 'Customers need a cleaning company they can count on.', icon: TrendingUp },
  { title: 'Attention to Detail', description: 'We focus on the details that make a space feel truly clean.', icon: Sparkles },
  { title: 'Customer Satisfaction', description: 'Customer expectations and priorities come first.', icon: HeartHandshake },
]

export const metadata = {
  title: 'About | Summit Clean Co.',
  description: 'Learn about Summit Clean Co. and our premium residential and commercial cleaning service.',
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <AnimatedSection className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0F5B4F]">About</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#14221F] sm:text-5xl">Professional cleaning with a personal touch.</h1>
          <p className="mt-6 text-lg leading-8 text-[#60716D]">Summit Clean Co. helps homes and businesses across Abbotsford and the Fraser Valley enjoy cleaner, healthier, better-feeling spaces.</p>
        </AnimatedSection>
        <AnimatedSection className="overflow-hidden rounded-[2rem]">
          <img src="/images/residential-custom.jpg" alt="Cleaning professional at work" className="h-[360px] w-full object-cover" />
        </AnimatedSection>
      </div>
      <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {values.map((value, index) => {
          const Icon = value.icon
          return (
            <AnimatedSection key={value.title} delay={index * 0.06}>
              <article className="rounded-[1.5rem] border border-[#DCE5E1] bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(15,91,79,0.08)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#DFEEE8] text-[#0F5B4F]">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-[#0F5B4F]">0{index + 1}</p>
              <h2 className="mt-3 text-xl font-semibold text-[#14221F]">{value.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#60716D]">{value.description}</p>
            </article>
            </AnimatedSection>
          )
        })}
      </div>
    </main>
  )
}
