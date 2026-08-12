import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getAboutVideoSettings } from '@/lib/supabase/video-actions'
import { AboutVideoManager } from '@/components/admin/about-video-manager'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'About Video | Summit Clean Co. Admin',
  description: 'Manage video storytelling section on the About page.',
}

async function requireAdmin() {
  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    return null
  }
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return null
  }
  return user
}

export default async function AdminAboutVideoPage() {
  const user = await requireAdmin()
  const initialSettings = await getAboutVideoSettings()

  if (!user) {
    return (
      <main className="p-8">
        <div className="rounded-[2rem] border border-[#DCE5E1] bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-[#14221F]">Access denied</h1>
          <p className="mt-3 text-sm leading-7 text-[#60716D]">Please sign in to manage the dashboard.</p>
          <Button asChild className="mt-6 rounded-full bg-[#0F5B4F] text-white hover:bg-[#093D35]">
            <Link href="/admin/login">Go to login</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="p-8">
      <div className="rounded-[2rem] border border-[#DCE5E1] bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0F5B4F]">About Page Video</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#14221F]">Video Storytelling</h1>
        <p className="mt-2 text-[#60716D] text-sm leading-relaxed max-w-2xl">
          Use a video to make Summit Clean Co. feel authentic and professional. The video will appear in an elegant, custom-designed section on the public About page.
        </p>

        <div className="mt-8">
          <AboutVideoManager initialSettings={initialSettings} />
        </div>
      </div>
    </main>
  )
}
