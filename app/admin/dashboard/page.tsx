import Link from 'next/link'
import { ArrowRight, BadgeCheck, BriefcaseBusiness, Inbox, Sparkles, Star } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getAdminOverview } from '@/lib/supabase/data'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Dashboard | Summit Clean Co. Admin',
  description: 'Manage quotes, services, and website content.',
}

async function requireAdmin() {
  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    return null
  }
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return null
  }
  return user
}

export default async function AdminDashboardPage() {
  const user = await requireAdmin()
  const overview = await getAdminOverview()

  if (!user) {
    return (
      <main className="p-8">
        <div className="rounded-[2rem] border border-[#DCE5E1] bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-[#14221F]">Access denied</h1>
          <p className="mt-3 text-sm leading-7 text-[#60716D]">Please sign in to manage the dashboard.</p>
          <Button asChild className="mt-6 rounded-full bg-[#0F5B4F] text-white hover:bg-[#093D35]">
            <Link href="/admin/login">Go to login</Link>
          </Button>
        </div>
      </main>
    )
  }

  const stats = [
    { title: 'Total Quotes', value: overview.totalQuotes, icon: Inbox },
    { title: 'New Quotes', value: overview.newQuotes, icon: BadgeCheck },
    { title: 'Booked', value: overview.bookedQuotes, icon: BriefcaseBusiness },
    { title: 'Completed', value: overview.completedQuotes, icon: Sparkles },
    { title: 'Active Services', value: overview.activeServices, icon: Star },
    { title: 'Published Testimonials', value: overview.publishedTestimonials, icon: Star },
  ]

  return (
    <main className="space-y-6 sm:space-y-8">
      <section className="rounded-[1.5rem] border border-[#DCE5E1] bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#0F5B4F] sm:text-xs">Overview</p>
        <h1 className="mt-3 text-2xl font-semibold text-[#14221F] sm:text-3xl">Welcome back, {user.email}</h1>
        <p className="mt-3 text-sm leading-6 text-[#60716D] sm:leading-7">You can manage quote requests, services, and content from this dashboard.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="rounded-[1.25rem] border border-[#DCE5E1] bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#60716D] sm:text-sm">{stat.title}</p>
                <div className="rounded-full bg-[#DFEEE8] p-2.5 text-[#0F5B4F]">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-5 text-2xl font-semibold text-[#14221F] sm:text-3xl">{stat.value}</p>
            </div>
          )
        })}
      </section>

      <section className="rounded-[1.5rem] border border-[#DCE5E1] bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-[#14221F] sm:text-xl">Recent quote requests</h2>
          <Link href="/admin/quotes" className="inline-flex items-center text-sm font-semibold text-[#0F5B4F]">
            View all <ArrowRight className="ml-1 inline h-4 w-4" />
          </Link>
        </div>

        <div className="mt-5 space-y-3">
          {overview.recentQuotes.map((quote) => (
            <div key={quote.id} className="flex flex-col gap-2 rounded-xl border border-[#DCE5E1] p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
              <div>
                <p className="font-semibold text-[#14221F]">{quote.full_name}</p>
                <p className="text-sm text-[#60716D]">{quote.email}</p>
              </div>
              <div className="text-sm text-[#60716D]">{quote.status}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
