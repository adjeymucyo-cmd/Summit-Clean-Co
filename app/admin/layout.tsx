import { createServerSupabaseClient } from '@/lib/supabase/server'
import { AdminShell } from '@/components/admin/admin-shell'

async function handleLogout() {
  'use server'
  const supabase = await createServerSupabaseClient()
  if (supabase) {
    await supabase.auth.signOut()
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase?.auth.getUser() ?? { data: { user: null } }

  return <AdminShell userEmail={user?.email} logoutAction={handleLogout}>{children}</AdminShell>
}
