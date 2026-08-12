'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signupUserWithoutRateLimit } from '@/lib/supabase/actions'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    // Validate inputs
    if (!username.trim()) {
      setError('Username is required')
      setLoading(false)
      return
    }

    if (!email.trim()) {
      setError('Email is required')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    // Use server action to bypass email rate limiting
    // This uses service role client which has no rate limits
    const result = await signupUserWithoutRateLimit({
      username: username.trim(),
      full_name: fullName.trim() || username.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      password,
    })

    if (!result.success) {
      setError(result.error || 'Failed to create account')
      setLoading(false)
      return
    }

    // Auto-login after successful signup
    const supabase = createClient()
    if (supabase) {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) {
        console.error('Auto-login error:', signInError.message)
      }
    }

    setLoading(false)
    // Redirect to home after successful signup and auto-login
    router.push('/?login=success')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F7F2] px-4 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-[#DCE5E1] bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-[#14221F]">Create an Account</h1>
        <p className="mt-3 text-sm leading-7 text-[#60716D]">Sign up to get in touch with Summit Clean Co.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" type="text" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Choose a username" className="mt-2 border-black bg-white" required />
          </div>
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Your full name" className="mt-2 border-black bg-white" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="your@email.com" className="mt-2 border-black bg-white" required />
          </div>
          <div>
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input id="phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+1 (555) 123-4567" className="mt-2 border-black bg-white" />
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
            {loading ? 'Creating account and logging in…' : 'Sign Up'}
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
