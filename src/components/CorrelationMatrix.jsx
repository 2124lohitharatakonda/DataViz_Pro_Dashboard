import { getCorrelation } from '../utils/dataParser'

function getColor(val) {
  if (val > 0.7) return '#10b981'
  if (val > 0.4) return '#6366f1'
  if (val > 0) return '#475569'
  if (val > -0.4) return '#f59e0b'
  return '#ef4444'
}

export default function CorrelationMatrix({ data, numericCols }) {
  const cols = numericCols.slice(0, 6)
  if (cols.length < 2) return null

  return (
    <div style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
      <h3 className="text-sm font-semibold text-slate-300 mb-4">🔗 Correlation Matrix</h3>
      <div className="overflow-x-auto">
        <table className="text-xs">
          <thead>
            <tr>
              <th className="w-24" />
              {cols.map((c) => <th key={c} className="px-2 py-1 text-slate-400 font-medium text-center max-w-20 truncate" style={{ maxWidth: '80px' }} title={c}>{c.slice(0, 10)}</th>)}
            </tr>
          </thead>
          <tbody>
            {cols.map((row) => (
              <tr key={row}>
                <td className="pr-3 py-1 text-slate-400 font-medium truncate" style={{ maxWidth: '96px' }} title={row}>{row.slice(0, 12)}</td>
                {cols.map((col) => {
                  const val = row === col ? 1 : getCorrelation(data, row, col)
                  return (
                    <td key={col} className="px-2 py-1 text-center rounded font-bold" style={{ color: getColor(val), background: `${getColor(val)}22`, minWidth: '60px' }}>
                      {val.toFixed(2)}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-4 mt-4 text-xs text-slate-400 flex-wrap">
        {[['#10b981', 'Strong +ve (>0.7)'], ['#6366f1', 'Moderate +ve'], ['#f59e0b', 'Moderate -ve'], ['#ef4444', 'Strong -ve']].map(([c, l]) => (
          <div key={l} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ background: c }} />
            <span>{l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
