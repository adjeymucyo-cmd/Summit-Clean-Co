import { getServiceAreas } from '@/lib/supabase/data'
import { ServiceAreaManager } from '@/components/admin/crud-actions'

export const metadata = {
  title: 'Service Areas | Summit Clean Co. Admin',
  description: 'Manage service areas shown to visitors.',
}

export default async function AdminServiceAreasPage() {
  const serviceAreas = await getServiceAreas()

  return (
    <main>
      <div className="rounded-[1.5rem] border border-[#DCE5E1] bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#0F5B4F] sm:text-xs">Service Areas</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#14221F] sm:text-3xl">Local coverage</h1>
        </div>
        <div className="mt-5 sm:mt-6 lg:mt-8">
          <ServiceAreaManager initialAreas={serviceAreas} />
        </div>
      </div>
    </main>
  )
}
