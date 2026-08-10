'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/site/navbar'
import { Footer } from '@/components/site/footer'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin') ?? false

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,91,79,0.12),transparent_28%),linear-gradient(180deg,#f7fbf6_0%,#e9f0ea_100%)] text-[#14221F] selection:bg-[#DFEEE8] selection:text-[#0F5B4F]">
      {!isAdminRoute && <Navbar />}
      {children}
      {!isAdminRoute && <Footer />}
    </div>
  )
}
