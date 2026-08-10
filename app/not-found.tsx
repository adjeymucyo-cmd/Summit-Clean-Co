import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F7F2] px-4 py-20">
      <div className="max-w-xl rounded-[2rem] border border-[#DCE5E1] bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0F5B4F]">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-[#14221F]">Page not found</h1>
        <p className="mt-4 text-lg leading-8 text-[#60716D]">We couldn’t find the page you were looking for.</p>
        <Button asChild className="mt-8 rounded-full bg-[#0F5B4F] text-white hover:bg-[#093D35]">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </main>
  )
}
