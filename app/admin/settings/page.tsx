import { getSiteSettings } from '@/lib/supabase/data'
import { AdminSettingsManager } from '@/components/admin/admin-settings-manager'

export const metadata = {
  title: 'Settings | Summit Clean Co. Admin',
  description: 'Manage business content and site settings.',
}

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings()

  return (
    <main className="p-8">
      <div className="rounded-[2rem] border border-[#DCE5E1] bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0F5B4F]">Settings</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#14221F]">Business settings</h1>
        <p className="mt-3 text-sm leading-7 text-[#60716D] max-w-3xl">
          Update company details, hero copy, and service area information that appears across the website.
        </p>

        <div className="mt-8">
          <AdminSettingsManager initialSettings={settings} />
        </div>
      </div>
    </main>
  )
}
