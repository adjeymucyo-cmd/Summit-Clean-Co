"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, PhoneCall, Search } from 'lucide-react'
import { Logo } from '@/components/site/logo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { siteNavLinks } from '@/lib/nav-links'

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-[#46372f]/40 bg-[#3b291f] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Logo light />
        <form action="/services" method="get" className="hidden md:flex md:items-center md:mr-4">
          <label htmlFor="nav-search" className="sr-only">Search services</label>
          <div className="relative flex items-center">
            <input
              id="nav-search"
              name="q"
              placeholder="Search services"
              className="h-10 w-64 rounded-full border border-white/40 bg-white/0 px-4 pr-10 text-sm text-white placeholder:text-white/60 focus:outline-none"
            />
            <button type="submit" className="absolute right-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0F5B4F] text-white hover:bg-[#093D35]">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>
        <nav className="hidden items-center gap-4 md:flex">
          {siteNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn('text-sm font-medium text-[#EFE7DE] transition', pathname === link.href && 'text-[#F8D97B]')}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-full border border-[#E9E1D8] bg-transparent px-5 py-2 text-sm font-semibold text-[#EFE7DE] transition hover:bg-[#2f241e]/40"
          >
            Login
          </Link>
          <Link
            href="/quote"
            className="rounded-full bg-[#E7C858] px-5 py-2 text-sm font-semibold text-[#2b1f1a] shadow-[0_12px_36px_rgba(231,200,88,0.18)] transition hover:shadow-[0_18px_48px_rgba(231,200,88,0.28)] hover:translate-y-[-1px]"
          >
            Get a Free Quote
          </Link>
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-[#46372f]/30 bg-[#3b291f]/95 px-4 py-4 md:hidden"
          >
            <div className="flex flex-col gap-2">
                <form action="/services" method="get" className="mb-3 px-2">
                  <label htmlFor="mobile-search" className="sr-only">Search services</label>
                  <div className="flex">
                    <input
                      id="mobile-search"
                      name="q"
                      placeholder="Search services"
                      className="w-full rounded-md border border-white/40 bg-white/0 px-3 py-2 text-sm text-white placeholder:text-white/60 focus:outline-none"
                    />
                    <button type="submit" className="ml-2 inline-flex items-center justify-center rounded-md bg-[#0F5B4F] px-3 py-2 text-white">
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              {siteNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn('rounded-lg px-3 py-2 text-sm font-medium text-[#EFE7DE] transition', pathname === link.href && 'bg-[#4b3b32] text-[#F8D97B]')}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/login" onClick={() => setOpen(false)} className="rounded-full border border-[#E9E1D8] bg-transparent px-4 py-3 text-sm font-semibold text-[#EFE7DE] transition hover:bg-[#2f241e]/40">
                Login
              </Link>
              <Link href="/quote" onClick={() => setOpen(false)} className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#E7C858] px-4 py-3 text-sm font-semibold text-[#2b1f1a] shadow-sm">
                <PhoneCall className="h-4 w-4" /> Get a Free Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
