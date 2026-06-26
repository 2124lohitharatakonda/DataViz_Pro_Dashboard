import { getCorrelation } from '../utils/dataParser'

function getColor(val) {
  if (val >= 0.9) return { bg: 'rgba(29,78,216,0.8)', text: '#bfdbfe' }
  if (val >= 0.7) return { bg: 'rgba(37,99,235,0.6)', text: '#93c5fd' }
  if (val >= 0.4) return { bg: 'rgba(59,130,246,0.4)', text: '#93c5fd' }
  if (val >= 0.1) return { bg: 'rgba(96,165,250,0.2)', text: '#60a5fa' }
  if (val >= -0.1) return { bg: 'rgba(100,116,139,0.2)', text: '#94a3b8' }
  if (val >= -0.4) return { bg: 'rgba(251,191,36,0.2)', text: '#fbbf24' }
  if (val >= -0.7) return { bg: 'rgba(249,115,22,0.3)', text: '#fb923c' }
  return { bg: 'rgba(239,68,68,0.4)', text: '#f87171' }
}

export default function CorrelationMatrix({ data, numericCols }) {
  const cols = numericCols.slice(0, 6)
  if (cols.length < 2) return null

  return (
    <div className="rounded-xl sm:rounded-2xl p-4 sm:p-5"
      style={{ background: 'rgba(8,18,52,0.8)', border: '1px solid rgba(59,130,246,0.2)', boxShadow: '0 4px 24px rgba(59,130,246,0.08)' }}>
      <h3 className="text-xs sm:text-sm font-bold text-white mb-4 flex items-center gap-2">
        <span style={{ color: '#60a5fa' }}>🔗</span> Correlation Matrix
      </h3>
      <div className="overflow-x-auto">
        <table className="text-xs w-full">
          <thead>
            <tr>
              <th className="w-20 sm:w-28" />
              {cols.map((c) => (
                <th key={c} className="px-1.5 py-1 font-semibold text-center"
                  style={{ color: '#60a5fa', maxWidth: 72 }} title={c}>
                  {c.slice(0, 8)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cols.map((row) => (
              <tr key={row}>
                <td className="pr-2 py-1 font-semibold truncate"
                  style={{ color: '#93c5fd', maxWidth: '7rem' }} title={row}>
                  {row.slice(0, 12)}
                </td>
                {cols.map((col) => {
                  const val = row === col ? 1 : getCorrelation(data, row, col)
                  const { bg, text } = getColor(val)
                  return (
                    <td key={col} className="px-1.5 py-1.5 text-center font-bold rounded-lg"
                      style={{ background: bg, color: text, minWidth: 52, margin: 2 }}>
                      {val === 1 ? '1.00' : val.toFixed(2)}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-3 mt-4 flex-wrap">
        {[
          ['rgba(29,78,216,0.8)', 'Strong +ve'],
          ['rgba(59,130,246,0.4)', 'Moderate +ve'],
          ['rgba(100,116,139,0.2)', 'Neutral'],
          ['rgba(249,115,22,0.3)', 'Moderate -ve'],
          ['rgba(239,68,68,0.4)', 'Strong -ve'],
        ].map(([bg, label]) => (
          <div key={label} className="flex items-center gap-1.5 text-xs text-slate-400">
            <div className="w-3 h-3 rounded" style={{ background: bg, border: '1px solid rgba(255,255,255,0.1)' }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
