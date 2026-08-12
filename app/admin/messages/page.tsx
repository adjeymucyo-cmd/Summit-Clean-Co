import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getContactMessages } from '@/lib/supabase/admin-actions'
import { AdminMessagesManager } from '@/components/admin/admin-messages-manager'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata = {
  title: 'Contact Messages | Summit Clean Co. Admin',
  description: 'Manage customer contact messages.',
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

export default async function AdminMessagesPage() {
  const user = await requireAdmin()
  const messages = await getContactMessages()

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
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0F5B4F]">Customer Relations</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#14221F]">Contact Messages</h1>
        <p className="mt-2 text-[#60716D] text-sm leading-relaxed max-w-2xl">
          View inquiries sent from the website contact page. Read details, change their statuses, and reply directly to the customer.
        </p>

        <div className="mt-8">
          <AdminMessagesManager initialMessages={messages} />
        </div>
      </div>
    </main>
  )
}
