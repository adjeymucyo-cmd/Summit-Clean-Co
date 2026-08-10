"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F7F2] px-4 py-20">
      <div className="max-w-xl rounded-[2rem] border border-[#DCE5E1] bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0F5B4F]">Error</p>
        <h1 className="mt-4 text-4xl font-semibold text-[#14221F]">Something went wrong.</h1>
        <p className="mt-4 text-lg leading-8 text-[#60716D]">Please try again in a moment.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button onClick={() => reset()} className="rounded-full bg-[#0F5B4F] text-white hover:bg-[#093D35]">Try again</Button>
          <Button asChild variant="outline" className="rounded-full border-[#DCE5E1] text-[#14221F]">
            <Link href="/">Back home</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
