import { useState } from 'react'
import { Table2, Search, ChevronLeft, ChevronRight } from 'lucide-react'

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
    <div className="rounded-xl sm:rounded-2xl overflow-hidden"
      style={{ background: 'rgba(8,18,52,0.8)', border: '1px solid rgba(59,130,246,0.2)', boxShadow: '0 4px 24px rgba(59,130,246,0.08)' }}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4"
        style={{ borderBottom: '1px solid rgba(59,130,246,0.15)', background: 'rgba(29,78,216,0.08)' }}>
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Table2 size={16} style={{ color: '#60a5fa' }} />
          Data Preview
          <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(59,130,246,0.2)', color: '#93c5fd' }}>
            {data.length} rows
          </span>
        </h3>
        <div className="flex items-center gap-2 rounded-lg px-3 py-2"
          style={{ background: 'rgba(14,26,64,0.8)', border: '1px solid rgba(59,130,246,0.25)' }}>
          <Search size={13} style={{ color: '#60a5fa' }} />
          <input type="text" placeholder="Search data..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            className="bg-transparent text-sm text-slate-200 outline-none placeholder-slate-600 w-32 sm:w-48" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr style={{ background: 'rgba(29,78,216,0.1)' }}>
              {columns.map((col) => (
                <th key={col} className="text-left py-2.5 px-3 sm:px-4 font-semibold whitespace-nowrap"
                  style={{ color: '#93c5fd', borderBottom: '1px solid rgba(59,130,246,0.15)' }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => (
              <tr key={i} className="transition-colors duration-150"
                style={{ borderBottom: '1px solid rgba(59,130,246,0.06)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(29,78,216,0.08)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                {columns.map((col) => (
                  <td key={col} className="py-2.5 px-3 sm:px-4 text-slate-300 whitespace-nowrap max-w-xs truncate">
                    {String(row[col] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 1 && (
        <div className="flex items-center justify-between px-4 sm:px-6 py-3"
          style={{ borderTop: '1px solid rgba(59,130,246,0.12)', background: 'rgba(29,78,216,0.05)' }}>
          <span className="text-xs text-slate-500">
            Page <span style={{ color: '#60a5fa' }}>{page + 1}</span> of {total} · {filtered.length} results
          </span>
          <div className="flex gap-1">
            {[...Array(Math.min(total, 5))].map((_, idx) => {
              const p = idx
              return (
                <button key={p} onClick={() => setPage(p)}
                  className="w-7 h-7 rounded-lg text-xs font-medium transition-all"
                  style={page === p
                    ? { background: '#1d4ed8', color: 'white' }
                    : { color: '#64748b', background: 'transparent' }}>
                  {p + 1}
                </button>
              )
            })}
            {total > 5 && <span className="text-slate-600 text-xs flex items-center px-1">...</span>}
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
              className="w-7 h-7 rounded-lg transition-all disabled:opacity-30"
              style={{ color: '#60a5fa' }}>
              <ChevronLeft size={14} className="mx-auto" />
            </button>
            <button onClick={() => setPage((p) => Math.min(total - 1, p + 1))} disabled={page === total - 1}
              className="w-7 h-7 rounded-lg transition-all disabled:opacity-30"
              style={{ color: '#60a5fa' }}>
              <ChevronRight size={14} className="mx-auto" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
