'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, LayoutDashboard, LogOut, MessageSquare, Settings, Sparkles, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/quotes', label: 'Quotes', icon: FileText },
  { href: '/admin/services', label: 'Services', icon: Sparkles },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/service-areas', label: 'Service Areas', icon: MessageSquare },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminShell({
  children,
  userEmail,
  logoutAction,
}: {
  children: React.ReactNode
  userEmail?: string | null
  logoutAction: () => Promise<void>
}) {
  const pathname = usePathname()
  const isLoginRoute = pathname === '/admin/login'

  if (isLoginRoute) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#F5F7F2] text-[#14221F]">
      <div className="flex min-h-screen flex-col">
        <aside className="sticky top-0 z-30 border-b border-[#DCE5E1] bg-white/95 backdrop-blur-sm lg:static lg:w-full lg:border-b-0 lg:border-r lg:bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-start lg:justify-start">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#0F5B4F]">Admin</p>
                <h2 className="mt-2 text-lg font-semibold text-[#14221F] lg:text-xl">Summit Clean Co.</h2>
              </div>

              <div className="hidden text-xs text-[#60716D] lg:block">
                Signed in as <span className="font-medium text-[#0F5B4F]">{userEmail ?? 'admin'}</span>
              </div>
            </div>

            <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:mt-6 lg:flex-col lg:overflow-visible">
              {links.map((link) => {
                const Icon = link.icon
                const active = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex min-w-fit items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition lg:px-3 lg:py-3 ${active ? 'bg-[#DFEEE8] text-[#0F5B4F] shadow-sm' : 'text-[#60716D] hover:bg-[#DFEEE8] hover:text-[#0F5B4F]'}`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            <div className="mt-4 flex items-center justify-between gap-3 lg:mt-8">
              <form action={logoutAction} className="w-full lg:w-auto">
                <Button type="submit" variant="outline" className="w-full justify-center gap-2 rounded-xl border-[#DCE5E1] text-[#14221F] lg:w-auto lg:justify-start">
                  <LogOut className="h-4 w-4" /> Logout
                </Button>
              </form>
            </div>

            <div className="mt-4 rounded-[1rem] border border-[#DCE5E1] bg-[#F5F7F2] p-3 text-xs text-[#60716D] lg:hidden">
              {userEmail ?? 'admin'}
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
