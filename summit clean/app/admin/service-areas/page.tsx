import { getServiceAreas } from '@/lib/supabase/data'
import { ServiceAreaManager } from '@/components/admin/crud-actions'

export const metadata = {
  title: 'Service Areas | Summit Clean Co. Admin',
  description: 'Manage service areas shown to visitors.',
}

export default async function AdminServiceAreasPage() {
  const serviceAreas = await getServiceAreas()

  return (
    <main className="p-8">
      <div className="rounded-[2rem] border border-[#DCE5E1] bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0F5B4F]">Service Areas</p>
        <h1 className="mt-2 text-3xl font-semibold text-[#14221F]">Local coverage</h1>
        <div className="mt-8">
          <ServiceAreaManager initialAreas={serviceAreas} />
        </div>
      </div>
    </main>
  )
}
