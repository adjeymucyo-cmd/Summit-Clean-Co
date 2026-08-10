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
    <main className="space-y-8 p-8">
      <div className="rounded-[2rem] border border-[#DCE5E1] bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0F5B4F]">Overview</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#14221F]">Welcome back, {user.email}</h1>
        <p className="mt-3 text-sm leading-7 text-[#60716D]">You can manage quote requests, services, and content from this dashboard.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="rounded-[1.5rem] border border-[#DCE5E1] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#60716D]">{stat.title}</p>
                <div className="rounded-full bg-[#DFEEE8] p-2 text-[#0F5B4F]">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-6 text-3xl font-semibold text-[#14221F]">{stat.value}</p>
            </div>
          )
        })}
      </div>
      <div className="rounded-[2rem] border border-[#DCE5E1] bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#14221F]">Recent quote requests</h2>
          <Link href="/admin/quotes" className="text-sm font-semibold text-[#0F5B4F]">View all <ArrowRight className="ml-1 inline h-4 w-4" /></Link>
        </div>
        <div className="mt-6 space-y-4">
          {overview.recentQuotes.map((quote) => (
            <div key={quote.id} className="flex flex-col justify-between gap-2 rounded-xl border border-[#DCE5E1] p-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-semibold text-[#14221F]">{quote.full_name}</p>
                <p className="text-sm text-[#60716D]">{quote.email}</p>
              </div>
              <div className="text-sm text-[#60716D]">{quote.status}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
