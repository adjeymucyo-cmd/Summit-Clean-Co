"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(31,119,104,0.18),transparent_24%),linear-gradient(180deg,#ecfaf4_0%,#dff0e6_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-[#DCE5E1] bg-white shadow-[0_30px_80px_rgba(15,91,79,0.12)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden bg-[#0F5B4F] p-8 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#EAFBF5]">
              <ShieldCheck className="h-3.5 w-3.5" /> Admin Access
            </div>
            <h1 className="mt-8 text-4xl font-semibold leading-tight">Management dashboard</h1>
            <p className="mt-4 max-w-md text-base leading-7 text-[#D8F0E7]">
              Manage services, settings, testimonials, quotes, and customer messages from one secure place.
            </p>
          </div>
          <div className="space-y-4 rounded-[1.5rem] border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E7C858] text-[#14221F]">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">Summit Clean Co.</p>
                <p className="text-xs text-[#D8F0E7]">Operations control</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-md">
            <div className="flex items-center justify-center lg:justify-start">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#DFEEE8] text-[#0F5B4F] shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-semibold text-[#14221F] lg:text-left">Admin Login</h2>
            <p className="mt-3 text-center text-sm leading-7 text-[#60716D] lg:text-left">
              Sign in to manage the website and client experience.
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 h-11 rounded-xl border-[#DCE5E1] bg-white px-3 text-[#14221F] placeholder:text-[#60716D] focus-visible:ring-[#0F5B4F]/20"
                  placeholder="admin@email.com"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-11 rounded-xl border-[#DCE5E1] bg-white pr-11 text-[#14221F] placeholder:text-[#60716D] focus-visible:ring-[#0F5B4F]/20"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#60716D] transition hover:text-[#0F5B4F]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && <p className="rounded-xl bg-[#fef3f2] p-3 text-sm text-[#b42318]">{error}</p>}

              <Button type="submit" className="h-11 w-full rounded-full bg-[#0F5B4F] text-white hover:bg-[#093D35]" disabled={loading}>
                {loading ? 'Signing in…' : 'Log in'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
