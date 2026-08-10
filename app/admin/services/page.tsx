import { getServices } from '@/lib/supabase/data'
import { ServiceManager } from '@/components/admin/crud-actions'

export const metadata = {
  title: 'Services | Summit Clean Co. Admin',
  description: 'Manage the services displayed on the website.',
}

export default async function AdminServicesPage() {
  const services = await getServices()

  return (
    <main className="p-8">
      <div className="rounded-[2rem] border border-[#DCE5E1] bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0F5B4F]">Services</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#14221F]">Service catalog</h1>
        <div className="mt-8">
          <ServiceManager initialServices={services} />
        </div>
      </div>
    </main>
  )
}
