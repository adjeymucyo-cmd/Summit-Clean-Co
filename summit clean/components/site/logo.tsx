import Link from 'next/link'

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="Summit Clean Co. home">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#0F5B4F]/10 bg-[#0F5B4F] text-lg font-semibold text-white shadow-sm">
        S
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold tracking-[0.25em] text-[#0F5B4F]">SUMMIT</p>
        <p className="text-sm font-semibold tracking-[0.25em] text-[#0F5B4F]">CLEAN CO.</p>
        {!compact && <p className="text-[11px] text-[#60716D]">Clean Spaces. Better Places.</p>}
      </div>
    </Link>
  )
}
