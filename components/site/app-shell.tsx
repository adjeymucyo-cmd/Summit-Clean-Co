'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/site/navbar'
import { Footer } from '@/components/site/footer'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin') ?? false

  return (
    <div className="page-fade-in min-h-screen bg-[radial-gradient(circle_at_top,_rgba(31,119,104,0.22),transparent_24%),linear-gradient(180deg,#e8fbf0_0%,#d3f1df_100%)] text-[#0f3d35] selection:bg-[#bfe7d9] selection:text-[#0f3d35]">
      {!isAdminRoute && <Navbar />}
      {children}
      {!isAdminRoute && <Footer />}
    </div>
  )
}
