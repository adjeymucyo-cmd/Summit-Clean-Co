import { getSiteSettings } from '@/lib/supabase/data'
import { AdminSettingsManager } from '@/components/admin/admin-settings-manager'

export const metadata = {
  title: 'Settings | Summit Clean Co. Admin',
  description: 'Manage business content and site settings.',
}

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings()

  return (
    <main>
      <div className="rounded-[1.5rem] border border-[#DCE5E1] bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#0F5B4F] sm:text-xs">Settings</p>
        <h1 className="mt-2 text-2xl font-semibold text-[#14221F] sm:text-3xl">Business settings</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#60716D] sm:leading-7">
          Update company details, hero copy, and service area information that appears across the website.
        </p>

        <div className="mt-6 sm:mt-8">
          <AdminSettingsManager initialSettings={settings} />
        </div>
      </div>
    </main>
  )
}
