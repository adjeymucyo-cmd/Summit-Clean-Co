import { ShieldCheck, Sparkles, TrendingUp, HeartHandshake } from 'lucide-react'
import { AnimatedSection } from '@/components/site/animated-section'
import { getAboutVideoSettings } from '@/lib/supabase/video-actions'
import { AboutVideoPlayer } from '@/components/site/about-video-player'

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

export default async function AboutPage() {
  const videoSettings = await getAboutVideoSettings()

  return (
    <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <AnimatedSection className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0F5B4F]">About</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#14221F] sm:text-5xl">Summit Clean Co. delivers reliable cleaning for homes and workplaces across the Fraser Valley.</h1>
          <div className="space-y-6 text-lg leading-8 text-[#60716D]">
            <p>Our goal is simple: make every space feel fresh, healthy, and easy to enjoy. Whether you need a one-time deep clean, regular home maintenance, or office sanitization, we focus on the results that matter most to you.</p>
            <p>How it works: you tell us the service you need, we tailor a cleaning plan to your property type and schedule, and our professional team arrives with the right products and attention to detail. We handle kitchens, bathrooms, offices, shared spaces, and every area in between.</p>
            <p>Why choose Summit Clean Co.? Because we combine local experience, friendly communication, and consistent quality. Our cleaners are trained, vetted, and prepared to treat your home or business respectfully, with extra care for the areas that make the biggest difference.</p>
            <p>Customers need to know that we value your time and safety. We use effective cleaning products, focus on high-touch surfaces, and work efficiently so you can return to a polished space without hassle. From first contact to the final walkthrough, we keep the process easy and professional.</p>
            <p>We also believe transparency is important. You can expect clear pricing, flexible scheduling, and cleaning plans that fit your property type — from offices and kitchens to rooms, apartments, and custom spaces. Our job is to give you more comfort and confidence in the place you live or work.</p>
          </div>
        </AnimatedSection>
        <AnimatedSection className="overflow-hidden rounded-[2rem]">
          <img src="/images/residential-custom.jpg" alt="Cleaning professional at work" className="h-[360px] w-full object-cover" />
        </AnimatedSection>
      </div>

      {/* Video Storytelling Section */}
      {videoSettings.is_published && videoSettings.video_url && (
        <AboutVideoPlayer 
          videoUrl={videoSettings.video_url} 
          thumbnailUrl={videoSettings.thumbnail_url} 
          title={videoSettings.title} 
          description={videoSettings.description} 
        />
      )}

      {/* Core Values Section */}
      <div className="mt-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0F5B4F]">Our Values</p>
          <h2 className="mt-3 text-3xl font-semibold text-[#14221F]">What guides our cleaning service</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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
      </div>
    </main>
  )
}
