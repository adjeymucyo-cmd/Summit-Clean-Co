import { getAllQuotes } from '@/lib/supabase/data'
import { QuoteManager } from '@/components/admin/crud-actions'

export const metadata = {
  title: 'Quotes | Summit Clean Co. Admin',
  description: 'Review and manage incoming quote requests.',
}

export default async function AdminQuotesPage() {
  const quotes = await getAllQuotes()

  return (
    <main className="p-8">
      <div className="rounded-[2rem] border border-[#DCE5E1] bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0F5B4F]">Quotes</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#14221F]">Quote requests</h1>
          </div>
        </div>
        <div className="mt-8">
          <QuoteManager initialQuotes={quotes} />
        </div>
      </div>
    </main>
  )
}
