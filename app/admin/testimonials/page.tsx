import { getTestimonials } from '@/lib/supabase/data'
import { TestimonialManager } from '@/components/admin/crud-actions'

export const metadata = {
  title: 'Testimonials | Summit Clean Co. Admin',
  description: 'Review and manage testimonials.',
}

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials()

  return (
    <main className="p-8">
      <div className="rounded-[2rem] border border-[#DCE5E1] bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0F5B4F]">Testimonials</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#14221F]">Published reviews</h1>
        <div className="mt-8">
          <TestimonialManager initialTestimonials={testimonials} />
        </div>
      </div>
    </main>
  )
}
