'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, LayoutDashboard, LogOut, MessageSquare, Settings, Sparkles, Star, Video, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/quotes', label: 'Quotes', icon: FileText },
  { href: '/admin/services', label: 'Services', icon: Sparkles },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/service-areas', label: 'Service Areas', icon: MessageSquare },
  { href: '/admin/messages', label: 'Messages', icon: Mail },
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
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-[#DCE5E1] bg-white p-6 lg:w-72 lg:border-b-0 lg:border-r">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0F5B4F]">Admin</p>
            <h2 className="mt-2 text-xl font-semibold">Summit Clean Co.</h2>
          </div>
          <nav className="mt-8 space-y-2">
            {links.map((link) => {
              const Icon = link.icon
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${active ? 'bg-[#DFEEE8] text-[#0F5B4F]' : 'text-[#60716D] hover:bg-[#DFEEE8] hover:text-[#0F5B4F]'}`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>
          <form action={logoutAction} className="mt-8">
            <Button type="submit" variant="outline" className="w-full justify-start gap-2 rounded-xl border-[#DCE5E1] text-[#14221F]">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </form>
          <div className="mt-8 rounded-[1.25rem] border border-[#DCE5E1] bg-[#F5F7F2] p-4 text-sm text-[#60716D]">
            Signed in as {userEmail ?? 'admin'}
          </div>
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
