import Link from 'next/link'
import { Logo } from '@/components/site/logo'
import { siteNavLinks } from '@/lib/nav-links'

export function Footer() {
  return (
    <footer className="border-t border-[#DCE5E1] bg-[#F5F7F2]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_0.7fr_0.7fr] lg:px-8">
        <div>
          <Logo compact />
          <p className="mt-4 max-w-md text-sm leading-7 text-[#60716D]">
            Summit Clean Co. helps homes and businesses across Abbotsford and the Fraser Valley enjoy cleaner, healthier, more comfortable spaces.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F5B4F]">Navigate</h3>
          <ul className="mt-4 space-y-3 text-sm text-[#60716D]">
            {siteNavLinks.map((link) => (
              <li key={link.href}><Link href={link.href} className="transition hover:text-[#0F5B4F]">{link.label}</Link></li>
            ))}
            <li><Link href="/quote" className="transition hover:text-[#0F5B4F]">Free Quote</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F5B4F]">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-[#60716D]">
            <li><a href="tel:+17785483365" className="hover:text-[#0F5B4F]">778-548-3365</a></li>
            <li><a href="mailto:mahordesire767@gmail.com" className="hover:text-[#0F5B4F]">mahordesire767@gmail.com</a></li>
            <li>Abbotsford, British Columbia, Canada</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#DCE5E1] px-4 py-4 text-center text-sm text-[#60716D] sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Summit Clean Co. All rights reserved.
      </div>
    </footer>
  )
}
