import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Clock, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getServiceBySlug } from '@/lib/supabase/data'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

// 3-paragraph descriptions mapping
const detailedDescriptions: Record<string, string[]> = {
  'residential-cleaning': [
    'Our residential cleaning service is designed to transform your living spaces into a sanctuary of cleanliness and comfort. We understand that your home is your personal retreat, which is why our professional cleaners treat every room with the utmost care, attention, and detail. From dusting hard-to-reach ceiling fans to polishing your floors, we ensure your entire home is spotless.',
    "We specialize in customized plans tailored to your household's unique schedule and requirements. Whether you need a weekly upkeep, bi-weekly deep cleaning, or a monthly touch-up, our team delivers consistent results. We pay special attention to high-traffic areas like kitchens and bathrooms, sanitizing countertops, scrubbing tiles, and leaving every surface sparkling.",
    'At Summit Clean Co., we use environmentally safe and highly effective cleaning products that protect your family and pets. Our detail-focused cleaners are fully trained, background-checked, and insured, giving you total peace of mind. Let us handle the chores so you can spend your valuable free time doing what you love in a clean, healthy environment.'
  ],
  'commercial-cleaning': [
    "A clean and organized business environment is essential for making a great first impression on clients and partners. Our commercial cleaning services are tailored to meet the unique standards of corporate headquarters, retail stores, and commercial buildings. We work diligently behind the scenes to maintain a spotless space that reflects your brand's professionalism.",
    'Our cleaning routines cover everything from floor maintenance and window washing to desk sanitization and breakroom detailing. We understand that high-traffic commercial spaces require heavy-duty sanitization and thorough trash management. Our team utilizes commercial-grade equipment to ensure that dust, grime, and allergens are completely removed.',
    'We offer flexible scheduling options, including after-hours and weekend cleaning, to minimize disruption to your business operations. Our professional staff is reliable, efficient, and dedicated to delivering consistent cleaning quality. Partner with us to provide your staff and visitors with a safe, healthy, and pristine environment.'
  ],
  'deep-cleaning': [
    'When standard weekly cleaning is not enough, our deep cleaning service provides an intensive, top-to-bottom reset for your home or office. This service targets accumulated grime, hidden dust, and neglected areas that are not covered in routine cleanings. It is the perfect solution for seasonal spring cleaning, preparing for special events, or restoring a property\'s original shine.',
    'Our detailed deep-cleaning checklist includes hand-washing baseboards, scrubbing oven interiors, cleaning behind heavy appliances, and detailed grout scrubbing. We meticulously clean every corner, including window tracks, door frames, light fixtures, and vents. Our cleaners take the time required to remove tough stains, soap scum, and buildup from all surfaces.',
    'A thorough deep clean not only sanitizes your space but also improves indoor air quality by removing deeply embedded dust and allergens. We recommend scheduling a deep cleaning twice a year to maintain a healthy living or working environment. Experience a level of clean that makes your space feel brand new again.'
  ],
  'move-in-move-out': [
    'Moving is one of life\'s most stressful transitions, but our move-in and move-out cleaning service takes the cleaning burden off your shoulders. Whether you are a tenant trying to secure your full security deposit refund or a homeowner preparing a property for sale, we ensure the space is flawless. We clean every nook and cranny so the next occupants step into a fresh, inviting home.',
    'Our comprehensive move cleaning checklist includes deep-cleaning the insides of all cabinets, drawers, closets, refrigerators, and ovens. We remove all traces of dust, cobwebs, and residue left behind by packers and movers. We sanitize every kitchen counter, scrub every bathroom fixture, and thoroughly vacuum and wash all flooring types.',
    'For landlords and property managers, a pristine property attracts high-quality tenants and reduces vacancy time. Our professional cleaners work efficiently to meet tight move-in deadlines, ensuring your rental property is ready for immediate occupancy. Trust us to deliver a spotless transition that makes moving easier for everyone involved.'
  ],
  'window-cleaning': [
    'Over time, dirt, pollen, and hard water stains accumulate on your windows, blocking natural light and dulling your view. Our professional window cleaning service restores the clarity and shine of your windows, inside and out. We use specialized squeegees, microfiber tools, and streak-free cleaning formulas to leave your glass crystal clear.',
    'We don\'t just clean the glass; we also wipe down window frames, scrub window sills, and clean tracks to remove bugs, cobwebs, and dirt. Whether you have single-story residential windows, large storefront windows, or complex multi-pane designs, our experienced team handles them safely and efficiently. We take care to protect your walls, landscaping, and flooring during our work.',
    'Regular professional window cleaning not only improves your home\'s curb appeal but also extends the lifespan of your windows by removing corrosive contaminants. Let the sunshine back into your rooms with our reliable, streak-free window care. Enjoy a brighter, cleaner view of the world today.'
  ],
  'office-cleaning': [
    'Office Cleaning provides thorough cleaning services designed to maintain a healthy, hygienic, and professional workplace. Our services include cleaning floors, desks, windows, restrooms, kitchens, meeting rooms, and common areas. We remove dust, dirt, stains, and waste while ensuring that the office remains fresh and well-organized. A clean office creates a comfortable environment, improves productivity, and leaves a positive impression on clients and visitors.',
    'Our cleaning protocols focus on high-touch surfaces and shared workspaces. We sanitize desks, keyboards, phones, conference tables, door handles, breakroom counters, and restrooms so your office stays safe and presentable. We work carefully around technology, documents, and sensitive business areas to preserve your productivity.',
    'With flexible scheduling for early mornings, evenings, or weekends, we keep disruption low while delivering consistent results. Trust Summit Clean Co. to keep your office space inviting, organized, and ready for staff, clients, and visitors alike.'
  ],
  'move-in-cleaning': [
    'Moving into a new home is an exciting milestone, but starting off in a space that still contains the previous occupant\'s dust and grime can be discouraging. Our specialized move-in cleaning service ensures your new house or apartment is sanitized and sparkling before your furniture arrives. We wash, scrub, and polish every surface to give you a truly fresh start.',
    'We perform a thorough sanitization of all bathrooms and kitchens, paying special attention to food prep areas, cabinet interiors, and appliances. Our team scrubs out refrigerator shelving, details oven interiors, and vacuums dust out of closets and heating vents. We ensure that any dust stirred up during recent renovations or move-out processes is completely eradicated.',
    'By having your home professionally cleaned before you unpack, you can move your belongings directly onto clean shelves and enjoy peace of mind. We help you create a healthy, clean foundation for your family\'s new chapter. Let us handle the deep prep work so you can focus on making your new house a home.'
  ],
  'interior-cleaning': [
    'Interior detailing focuses on the internal surfaces of your property that easily accumulate grime and dust over time but are often overlooked. This service goes beyond standard vacuuming and dusting to detail baseboards, door frames, inside cabinets, and light fixtures. We clean the surfaces that define the texture and freshness of your indoor spaces.',
    'Our skilled cleaners specialize in deep-cleaning kitchens and laundry rooms, including detailed washdowns of cabinet fronts, pantry shelving, and backsplashes. We hand-wipe wooden trims, remove scuff marks from walls, and restore shine to interior metal fixtures. We use gentle, surface-specific cleaners to protect your painted walls, wood accents, and stone countertops.',
    'A thorough interior clean removes allergens, eliminates pet odors, and leaves a noticeable, long-lasting freshness in every room. This service is ideal for homes after renovations, seasonal cleaning prep, or as a restorative service for busy households. Keep your home\'s interior looking polished and feeling healthy with our tailored interior care.'
  ],
  'custom-cleaning-services': [
    'Every property is unique, and sometimes standard cleaning packages do not fit your specific schedule, budget, or cleaning goals. That is why we offer fully customized cleaning services designed around your exact instructions and priorities. You tell us what areas to focus on, what to skip, and how you want things done, and we execute it perfectly.',
    'Whether you need us to focus strictly on kitchen sanitization and laundry, organize cluttered closets, prepare a guest room for visitors, or clean only the main floor of your home, we adapt to your needs. Our customized plans allow you to mix and match elements of deep cleaning, routine upkeep, and organizing. We work with you to determine the ideal frequency and duration for your custom service.',
    'Our flexible approach means you only pay for the services you actually need, without any rigid contracts or unnecessary extras. We provide all the professional equipment and eco-friendly products required, or we can use your preferred products upon request. Partner with Summit Clean Co. for cleaning care that fits your life and matches your standards.'
  ]
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

const getServiceName = (service: { slug: string; name: string }) => {
  if (service.slug === 'office-cleaning') {
    return 'Office Cleaning'
  }
  return service.name
}

const getServiceDescription = (service: { slug: string; description?: string; short_description?: string }) => {
  if (service.slug === 'office-cleaning') {
    return service.description ?? service.short_description ?? 'Office Cleaning provides thorough cleaning services designed to maintain a healthy, hygienic, and professional workplace.'
  }
  return service.short_description ?? service.description ?? ''
}

const fallbackServiceImages = [
  'https://images.pexels.com/photos/4095884/pexels-photo-4095884.jpeg?auto=compress&cs=tinysrgb&w=1200',
  '/images/residential-custom.jpg',
  'https://images.pexels.com/photos/4383868/pexels-photo-4383868.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/3958210/pexels-photo-3958210.jpeg?auto=compress&cs=tinysrgb&w=1200',
]

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  return {
    title: service ? `${getServiceName(service)} | Summit Clean Co.` : 'Service Details | Summit Clean Co.',
    description: getServiceDescription(service) || 'Professional residential and commercial cleaning services.',
  }
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  // Get 3 paragraphs description or split database description as backup
  const paragraphs = detailedDescriptions[service.slug] || [
    service.description || service.short_description || '',
    'Our professional cleaners are fully trained, vetted, and equipped with the highest quality products to handle all your service requests efficiently.',
    'We work around your schedule to deliver flexible, reliable results that keep your environment healthy, comfortable, and spotless.'
  ]

  const serviceImage = getServiceImage(service.name) ?? (service.image_url?.trim() ? service.image_url : fallbackServiceImages[0])

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Back button & Breadcrumbs */}
      <div className="mb-8 flex items-center gap-2 text-sm">
        <Link href="/services" className="inline-flex items-center gap-1.5 text-[#0F5B4F] hover:underline font-medium">
          <ArrowLeft className="h-4 w-4" /> Back to Services
        </Link>
        <span className="text-[#60716D]">&gt;</span>
        <span className="text-[#60716D]">{service.name}</span>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Left Column: Details & 3 paragraphs */}
        <div className="lg:col-span-2 space-y-8">
          <div className="overflow-hidden rounded-[2rem] border border-[#DCE5E1] shadow-sm">
            <img 
              src={serviceImage} 
              alt={service.name} 
              className="h-[350px] w-full object-cover sm:h-[450px]"
            />
          </div>
          
          <div className="prose prose-emerald max-w-none">
            <h1 className="text-3xl font-bold tracking-tight text-[#14221F] sm:text-4xl">{getServiceName(service)}</h1>
            <p className="mt-4 text-lg font-semibold text-[#0F5B4F] leading-relaxed">{getServiceDescription(service)}</p>
            
            <hr className="my-6 border-[#DCE5E1]" />
            
            <div className="space-y-6 text-base text-[#60716D] leading-8">
              {paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: CTA card */}
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-[#DCE5E1] bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-[#14221F]">Request This Service</h3>
            <p className="mt-2 text-sm text-[#60716D]">
              Get a custom, no-obligation free estimate tailored to your space and requirements.
            </p>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#0F5B4F] shrink-0" />
                <span className="text-sm font-medium text-[#14221F]">Vetted & Insured Cleaners</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-[#0F5B4F] shrink-0" />
                <span className="text-sm font-medium text-[#14221F]">100% Satisfaction Guarantee</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-[#0F5B4F] shrink-0" />
                <span className="text-sm font-medium text-[#14221F]">Flexible Scheduling Options</span>
              </div>
            </div>

            <Button asChild className="mt-8 w-full rounded-full bg-[#0F5B4F] py-6 text-white hover:bg-[#093D35]">
              <Link href={`/quote?service=${service.id}`} className="inline-flex items-center justify-center gap-2">
                Get a Free Quote <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="rounded-[2rem] bg-[#DFEEE8] p-8 border border-[#c5ded4]">
            <h4 className="font-semibold text-[#0f3d35]">Need a custom schedule?</h4>
            <p className="mt-2 text-sm text-[#3f675e] leading-6">
              We offer flexible options for weekly, bi-weekly, monthly, or one-time cleanings. Get in touch with us to build a custom plan.
            </p>
            <Link href="/contact" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F5B4F] hover:underline">
              Contact us directly <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
