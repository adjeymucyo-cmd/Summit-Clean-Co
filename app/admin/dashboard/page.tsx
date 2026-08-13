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
    { title: 'Total Quotes', value: overview.totalQuotes, icon: Inbox, gradient: 'from-[#0F5B4F] to-[#1f7768]', bgLight: 'bg-blue-50' },
    { title: 'New Quotes', value: overview.newQuotes, icon: BadgeCheck, gradient: 'from-[#1f7768] to-[#2a9d8f]', bgLight: 'bg-green-50' },
    { title: 'Booked', value: overview.bookedQuotes, icon: BriefcaseBusiness, gradient: 'from-[#0D3D35] to-[#0F5B4F]', bgLight: 'bg-teal-50' },
    { title: 'Completed', value: overview.completedQuotes, icon: Sparkles, gradient: 'from-[#0F5B4F] to-[#093D35]', bgLight: 'bg-cyan-50' },
    { title: 'Active Services', value: overview.activeServices, icon: Star, gradient: 'from-[#1f7768] to-[#0F5B4F]', bgLight: 'bg-emerald-50' },
    { title: 'Published Testimonials', value: overview.publishedTestimonials, icon: Star, gradient: 'from-[#0D3D35] to-[#1f7768]', bgLight: 'bg-lime-50' },
  ]

  return (
    <main className="space-y-6 sm:space-y-8">
      {/* Header Section */}
      <section className="rounded-2xl border-2 border-[#0F5B4F]/20 bg-gradient-to-br from-[#0F5B4F] via-[#1f7768] to-[#0D3D35] p-6 sm:p-8 lg:p-12 shadow-lg overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full -ml-36 -mb-36"></div>
        
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#b8e0d9]">Dashboard</p>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">Welcome back, {user.email.split('@')[0]}</h1>
          <p className="mt-4 text-base sm:text-lg leading-7 text-[#b8e0d9] max-w-2xl">You're doing great! Here's a quick overview of your business performance. Manage quotes, services, and content from here.</p>
          
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="rounded-full bg-white text-[#0F5B4F] font-semibold hover:bg-[#F5F7F2] shadow-lg transition">
              <Link href="/admin/quotes">View All Quotes</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-2 border-white text-white hover:bg-white/10 font-semibold">
              <Link href="/admin/services">Manage Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div 
              key={stat.title} 
              className="group rounded-2xl border-2 border-[#DCE5E1] bg-gradient-to-br from-white to-[#F5F7F2] p-6 shadow-md hover:shadow-xl hover:border-[#0F5B4F]/30 transition duration-300 overflow-hidden relative"
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition duration-300`}></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#60716D]">{stat.title}</p>
                  <div className={`rounded-xl bg-gradient-to-br ${stat.gradient} p-3 text-white shadow-lg`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-6 text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#0F5B4F] to-[#1f7768] bg-clip-text text-transparent">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </section>

      {/* Recent Quotes Section */}
      <section className="rounded-2xl border-2 border-[#DCE5E1] bg-gradient-to-br from-white via-[#F5F7F2] to-white p-6 sm:p-8 lg:p-10 shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F5B4F]">Recent Quote Requests</h2>
            <p className="mt-1 text-sm text-[#60716D]">Latest submissions from your customers</p>
          </div>
          <Link href="/admin/quotes" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0F5B4F] to-[#1f7768] px-6 py-2.5 text-sm font-semibold text-white hover:shadow-lg transition">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 space-y-3">
          {overview.recentQuotes.length > 0 ? (
            overview.recentQuotes.map((quote) => (
              <div 
                key={quote.id} 
                className="group flex flex-col gap-3 rounded-xl border-2 border-[#DCE5E1] bg-white p-4 sm:p-5 hover:border-[#0F5B4F] hover:shadow-md transition duration-300 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1">
                  <p className="font-bold text-[#14221F] text-base">{quote.full_name}</p>
                  <p className="mt-1 text-sm text-[#60716D]">{quote.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-[#DFEEE8] px-4 py-1.5 text-xs font-bold uppercase text-[#0F5B4F]">
                    {quote.status || 'Pending'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border-2 border-dashed border-[#DCE5E1] bg-[#F5F7F2] p-8 text-center">
              <Inbox className="mx-auto h-12 w-12 text-[#60716D]/40 mb-3" />
              <p className="text-[#60716D] font-medium">No quote requests yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Links */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/quotes" className="group rounded-2xl border-2 border-[#DCE5E1] bg-gradient-to-br from-white to-[#F5F7F2] p-6 hover:border-[#0F5B4F] hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[#14221F]">Quotes</h3>
            <div className="rounded-lg bg-[#DFEEE8] p-2 group-hover:bg-[#0F5B4F] transition">
              <Inbox className="h-4 w-4 text-[#0F5B4F] group-hover:text-white transition" />
            </div>
          </div>
          <p className="text-sm text-[#60716D]">Manage customer quote requests</p>
        </Link>
        
        <Link href="/admin/services" className="group rounded-2xl border-2 border-[#DCE5E1] bg-gradient-to-br from-white to-[#F5F7F2] p-6 hover:border-[#0F5B4F] hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[#14221F]">Services</h3>
            <div className="rounded-lg bg-[#DFEEE8] p-2 group-hover:bg-[#0F5B4F] transition">
              <Sparkles className="h-4 w-4 text-[#0F5B4F] group-hover:text-white transition" />
            </div>
          </div>
          <p className="text-sm text-[#60716D]">Configure your services</p>
        </Link>
        
        <Link href="/admin/testimonials" className="group rounded-2xl border-2 border-[#DCE5E1] bg-gradient-to-br from-white to-[#F5F7F2] p-6 hover:border-[#0F5B4F] hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[#14221F]">Testimonials</h3>
            <div className="rounded-lg bg-[#DFEEE8] p-2 group-hover:bg-[#0F5B4F] transition">
              <Star className="h-4 w-4 text-[#0F5B4F] group-hover:text-white transition" />
            </div>
          </div>
          <p className="text-sm text-[#60716D]">Manage customer reviews</p>
        </Link>
        
        <Link href="/admin/settings" className="group rounded-2xl border-2 border-[#DCE5E1] bg-gradient-to-br from-white to-[#F5F7F2] p-6 hover:border-[#0F5B4F] hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[#14221F]">Settings</h3>
            <div className="rounded-lg bg-[#DFEEE8] p-2 group-hover:bg-[#0F5B4F] transition">
              <BriefcaseBusiness className="h-4 w-4 text-[#0F5B4F] group-hover:text-white transition" />
            </div>
          </div>
          <p className="text-sm text-[#60716D]">Configure your profile</p>
        </Link>
      </section>
    </main>
  )
}
