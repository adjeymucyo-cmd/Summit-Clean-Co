import { getServices } from '@/lib/supabase/data'
import { ServiceManager } from '@/components/admin/crud-actions'

export const metadata = {
  title: 'Services | Summit Clean Co. Admin',
  description: 'Manage the services displayed on the website.',
}

export default async function AdminServicesPage() {
  const services = await getServices()

  return (
    <main>
      <div className="rounded-[1.5rem] border border-[#DCE5E1] bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#0F5B4F] sm:text-xs">Services</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#14221F] sm:text-3xl">Service catalog</h1>
        </div>
        <div className="mt-5 sm:mt-6 lg:mt-8">
          <ServiceManager initialServices={services} />
        </div>
      </div>
    </main>
  )
}
