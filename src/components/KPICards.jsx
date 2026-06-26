import { TrendingUp, Hash, ArrowUp, ArrowDown } from 'lucide-react'

function fmt(n) {
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return parseFloat(n.toFixed(2)).toLocaleString()
}

const COLORS = [
  ['#6366f1', '#4f46e5'],
  ['#8b5cf6', '#7c3aed'],
  ['#06b6d4', '#0891b2'],
  ['#10b981', '#059669'],
  ['#f59e0b', '#d97706'],
  ['#ef4444', '#dc2626'],
]

export default function KPICards({ kpis }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Hash size={20} className="text-indigo-400" /> Key Performance Indicators
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => {
          const [c1, c2] = COLORS[i % COLORS.length]
          return (
            <div key={kpi.col} className="rounded-2xl p-4" style={{ background: `linear-gradient(135deg, ${c1}22, ${c2}11)`, border: `1px solid ${c1}44` }}>
              <p className="text-xs text-slate-400 truncate mb-1" title={kpi.col}>{kpi.col}</p>
              <p className="text-2xl font-bold mb-3" style={{ color: c1 }}>{fmt(kpi.sum)}</p>
              <div className="space-y-1 text-xs text-slate-400">
                <div className="flex justify-between"><span>Avg</span><span className="text-slate-200">{fmt(kpi.avg)}</span></div>
                <div className="flex justify-between items-center"><ArrowUp size={10} className="text-green-400" /><span className="text-slate-200">{fmt(kpi.max)}</span></div>
                <div className="flex justify-between items-center"><ArrowDown size={10} className="text-red-400" /><span className="text-slate-200">{fmt(kpi.min)}</span></div>
                <div className="flex justify-between"><span>Rows</span><span className="text-slate-200">{kpi.count}</span></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
