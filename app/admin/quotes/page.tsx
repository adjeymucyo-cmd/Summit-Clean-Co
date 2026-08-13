import { getAllQuotes } from '@/lib/supabase/data'
import { QuoteManager } from '@/components/admin/crud-actions'

export const metadata = {
  title: 'Quotes | Summit Clean Co. Admin',
  description: 'Review and manage incoming quote requests.',
}

export default async function AdminQuotesPage() {
  const quotes = await getAllQuotes()

  return (
    <main>
      <div className="rounded-2xl border-2 border-[#DCE5E1] bg-gradient-to-br from-white via-[#F5F7F2] to-white p-6 sm:p-8 lg:p-10 shadow-md">
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-[#0F5B4F] to-[#1f7768]"></div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#0F5B4F]">Messages</p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#14221F]">Quote Requests</h1>
          <p className="text-sm text-[#60716D] mt-1">Manage and respond to customer quote requests</p>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-xl border border-[#DCE5E1] bg-white p-3 sm:p-4 text-center">
            <p className="text-xs uppercase text-[#60716D] font-bold tracking-wide">Total</p>
            <p className="text-2xl sm:text-3xl font-bold text-[#0F5B4F] mt-1">{quotes.length}</p>
          </div>
          <div className="rounded-xl border border-[#DCE5E1] bg-white p-3 sm:p-4 text-center">
            <p className="text-xs uppercase text-[#60716D] font-bold tracking-wide">New</p>
            <p className="text-2xl sm:text-3xl font-bold text-[#0F5B4F] mt-1">{quotes.filter(q => q.status === 'new').length}</p>
          </div>
          <div className="rounded-xl border border-[#DCE5E1] bg-white p-3 sm:p-4 text-center">
            <p className="text-xs uppercase text-[#60716D] font-bold tracking-wide">Completed</p>
            <p className="text-2xl sm:text-3xl font-bold text-[#0F5B4F] mt-1">{quotes.filter(q => q.status === 'completed').length}</p>
          </div>
        </div>

        <div className="mt-8">
          <QuoteManager initialQuotes={quotes} />
        </div>
      </div>
    </main>
  )
}
