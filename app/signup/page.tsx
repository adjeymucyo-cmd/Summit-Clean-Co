'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

export default function SignupPage() {
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
      setError('Supabase is not configured. Add your project URL and anon key to .env.')
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data?.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        role: 'user',
        full_name: email.split('@')[0],
      })
      if (profileError) {
        console.error('Error creating profile:', profileError.message)
      }
    }

    setLoading(false)
    router.push('/login')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F7F2] px-4 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-[#DCE5E1] bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-[#14221F]">Create an Account</h1>
        <p className="mt-3 text-sm leading-7 text-[#60716D]">Sign up to get in touch with Summit Clean Co.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 border-black bg-white" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-2">
              <Input 
                id="password" 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(event) => setPassword(event.target.value)} 
                className="pr-10 border-black bg-white" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#60716D] hover:text-[#0F5B4F]"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {error && <p className="rounded-xl bg-[#fef3f2] p-3 text-sm text-[#b42318]">{error}</p>}
          <Button type="submit" className="w-full rounded-full bg-[#0F5B4F] text-white hover:bg-[#093D35]" disabled={loading}>
            {loading ? 'Creating account…' : 'Sign Up'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-[#60716D]">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-[#0F5B4F] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  )
}
