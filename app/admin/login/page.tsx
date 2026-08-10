"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    if (!supabase) {
      setError('Supabase is not configured. Add your project URL and anon key to the environment variables before logging in.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError('Invalid login credentials. Please check your email and password and try again.')
      return
    }

    router.push('/admin/dashboard')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F7F2] px-4 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-[#DCE5E1] bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-[#14221F]">Admin Login</h1>
        <p className="mt-3 text-sm leading-7 text-[#60716D]">Use Supabase Auth to access the management dashboard.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2" />
          </div>
          {error && <p className="rounded-xl bg-[#fef3f2] p-3 text-sm text-[#b42318]">{error}</p>}
          <Button type="submit" className="w-full rounded-full bg-[#0F5B4F] text-white hover:bg-[#093D35]" disabled={loading}>
            {loading ? 'Signing in…' : 'Log in'}
          </Button>
        </form>
      </div>
    </main>
  )
}
