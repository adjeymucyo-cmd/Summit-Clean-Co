import Link from 'next/link'

export function Logo({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
   <Link href="/" className="flex items-center gap-3" aria-label="Summit Clean Co. home">
      <img 
        src="/logo.png" 
        alt="Summit Clean Co. Logo" 
        className="h-11 w-auto object-contain" 
      />
      <div className="leading-tight">
        <p className={`text-sm font-semibold tracking-[0.25em] ${light ? 'text-white' : 'text-[#0F5B4F]'}`}>SUMMIT</p>
        <p className={`text-sm font-semibold tracking-[0.25em] ${light ? 'text-white' : 'text-[#0F5B4F]'}`}>CLEAN CO.</p>
        {!compact && <p className={`text-[11px] ${light ? 'text-white/80' : 'text-[#60716D]'}`}>Clean Spaces. Better Places.</p>}
      </div>
     </Link>
  )
}
