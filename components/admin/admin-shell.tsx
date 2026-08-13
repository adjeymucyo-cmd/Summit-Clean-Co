'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, LayoutDashboard, LogOut, MessageSquare, Settings, Sparkles, Star, Menu, X } from 'lucide-react'
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
  const [menuOpen, setMenuOpen] = useState(false)

  if (isLoginRoute) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#F5F7F2] text-[#14221F]">
      <div className="flex min-h-screen flex-col">
        {/* Header with Logo and Menu Button */}
        <header className="sticky top-0 z-40 border-b border-[#DCE5E1] bg-white/95 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#0F5B4F]">Admin</p>
                <h2 className="mt-1 text-lg font-semibold text-[#14221F]">Summit Clean Co.</h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-xs text-[#60716D] sm:block">
                  Signed in as <span className="font-medium text-[#0F5B4F]">{userEmail ?? 'admin'}</span>
                </div>
                
                {/* Menu Button */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="relative inline-flex items-center justify-center rounded-lg border-2 border-[#0F5B4F] bg-white p-3 text-[#0F5B4F] hover:bg-[#F5F7F2] hover:shadow-lg hover:border-[#1f7768] transition duration-300"
                  aria-label="Toggle menu"
                  title="Open Admin Menu"
                >
                  {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  {menuOpen && <span className="absolute top-0 right-0 inline-flex h-3 w-3 rounded-full bg-[#0F5B4F]"></span>}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Popup Menu */}
        {menuOpen && (
          <div className="fixed inset-0 z-30 bg-black/40" onClick={() => setMenuOpen(false)}>
            <div
              className="fixed right-0 top-0 bottom-0 w-full sm:w-96 rounded-l-2xl border-l-4 border-[#0F5B4F] bg-white shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Menu Header */}
              <div className="border-b-2 border-[#DCE5E1] bg-gradient-to-r from-[#0F5B4F] to-[#1f7768] px-6 py-6 text-white">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl sm:text-3xl font-bold">Menu</h3>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-white/20 transition"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <p className="text-sm text-[#b8e0d9] font-medium">Navigate admin panel</p>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 flex flex-col gap-2 overflow-y-auto p-6">
                {links.map((link) => {
                  const Icon = link.icon
                  const active = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-4 rounded-xl px-5 py-4 text-base sm:text-lg font-semibold transition duration-300 ${
                        active
                          ? 'bg-gradient-to-r from-[#DFEEE8] to-[#E8F5F1] text-[#0F5B4F] shadow-md border-l-4 border-[#0F5B4F]'
                          : 'text-[#60716D] hover:bg-[#F5F7F2] hover:text-[#0F5B4F] hover:shadow-sm'
                      }`}
                    >
                      <Icon className="h-6 w-6 shrink-0" />
                      <span>{link.label}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* Divider */}
              <div className="border-t-2 border-[#DCE5E1]"></div>

              {/* User Info */}
              <div className="px-6 py-4 text-center border-b-2 border-[#DCE5E1] bg-[#F5F7F2]">
                <p className="text-xs uppercase tracking-wider text-[#60716D] font-bold mb-1">Signed In As</p>
                <p className="text-sm sm:text-base font-semibold text-[#0F5B4F] break-all">{userEmail ?? 'admin'}</p>
              </div>

              {/* Logout Button */}
              <div className="p-6">
                <form action={logoutAction} className="w-full">
                  <Button
                    type="submit"
                    className="w-full justify-center gap-3 rounded-xl border-2 border-[#DCE5E1] bg-white text-[#14221F] hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition text-base sm:text-lg font-semibold py-3"
                    onClick={() => setMenuOpen(false)}
                  >
                    <LogOut className="h-5 w-5" /> Logout
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
