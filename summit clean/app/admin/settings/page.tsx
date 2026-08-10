import { getSiteSettings } from '@/lib/supabase/data'

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
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {settings.map((setting) => (
            <div key={setting.key} className="rounded-[1.25rem] border border-[#DCE5E1] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F5B4F]">{setting.key}</p>
              <p className="mt-3 text-sm leading-7 text-[#60716D]">{setting.value ?? 'No value yet.'}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
