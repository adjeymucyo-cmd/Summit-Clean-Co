import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Summit Clean Co. | Professional Cleaning Services in Abbotsford',
  description: 'Professional residential and commercial cleaning services in Abbotsford and the Fraser Valley.',
  metadataBase: new URL('https://summitclean.example'),
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#F5F7F2] text-[#14221F]">{children}</div>
}
