'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle2 } from 'lucide-react'

export function LoginStatusBanner() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return

    supabase.auth.getSession().then(({ data: { session } }) => {
      setEmail(session?.user?.email ?? null)
    })

    if (searchParams?.get('login') === 'success') {
      setShowSuccess(true)
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [searchParams])

  if (!showSuccess && !email) {
    return null
  }

  return (
    <div className="mt-6 rounded-[2rem] border border-[#DCE5E1] bg-[#EFF8F1] p-5 text-sm text-[#0F5B4F] shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-[#0F5B4F]" />
          <div>
            {showSuccess ? (
              <p className="font-semibold">Login successful.</p>
            ) : null}
            <p>{email ? `Logged in as ${email}.` : 'You are signed in.'}</p>
          </div>
        </div>
        {showSuccess && email ? (
          <p className="text-xs text-[#60716D]">Welcome back, {email}.</p>
        ) : null}
      </div>
    </div>
  )
}
