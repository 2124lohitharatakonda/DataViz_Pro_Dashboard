import { useState } from 'react'
import { Table, Search, ChevronLeft, ChevronRight } from 'lucide-react'

export default function DataTable({ data, columns }) {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const PAGE_SIZE = 10

  const filtered = data.filter((row) =>
    columns.some((col) => String(row[col] ?? '').toLowerCase().includes(search.toLowerCase()))
  )
  const total = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <Table size={16} className="text-indigo-400" /> Data Preview ({data.length} rows)
        </h3>
        <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2 border border-slate-700">
          <Search size={14} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            className="bg-transparent text-sm text-slate-200 outline-none placeholder-slate-500 w-40"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ borderBottom: '1px solid #334155' }}>
              {columns.map((col) => (
                <th key={col} className="text-left py-2 px-3 text-slate-400 font-medium whitespace-nowrap">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #1e293b' }} className="hover:bg-slate-800/50 transition-colors">
                {columns.map((col) => (
                  <td key={col} className="py-2 px-3 text-slate-300 whitespace-nowrap max-w-xs truncate">{String(row[col] ?? '')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {total > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-slate-400">
          <span>Page {page + 1} of {total} ({filtered.length} results)</span>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
              className="p-1 rounded hover:bg-slate-700 disabled:opacity-30 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setPage((p) => Math.min(total - 1, p + 1))} disabled={page === total - 1}
              className="p-1 rounded hover:bg-slate-700 disabled:opacity-30 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
