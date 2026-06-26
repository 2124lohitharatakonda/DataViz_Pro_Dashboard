import { ArrowUp, ArrowDown, Hash } from 'lucide-react'

function fmt(n) {
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return parseFloat(n.toFixed(2)).toLocaleString()
}

const THEMES = [
  { grad: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', border: 'rgba(59,130,246,0.4)', glow: 'rgba(59,130,246,0.2)', text: '#93c5fd' },
  { grad: 'linear-gradient(135deg,#1e40af,#60a5fa)', border: 'rgba(96,165,250,0.4)', glow: 'rgba(96,165,250,0.2)', text: '#bfdbfe' },
  { grad: 'linear-gradient(135deg,#1e3a8a,#2563eb)', border: 'rgba(37,99,235,0.4)', glow: 'rgba(37,99,235,0.2)', text: '#93c5fd' },
  { grad: 'linear-gradient(135deg,#0369a1,#38bdf8)', border: 'rgba(56,189,248,0.4)', glow: 'rgba(56,189,248,0.2)', text: '#bae6fd' },
  { grad: 'linear-gradient(135deg,#0c4a6e,#0ea5e9)', border: 'rgba(14,165,233,0.4)', glow: 'rgba(14,165,233,0.2)', text: '#7dd3fc' },
  { grad: 'linear-gradient(135deg,#164e63,#06b6d4)', border: 'rgba(6,182,212,0.4)', glow: 'rgba(6,182,212,0.2)', text: '#a5f3fc' },
]

export default function KPICards({ kpis }) {
  return (
    <div>
      <h2 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
        <Hash size={18} style={{ color: '#60a5fa' }} />
        <span>Key Performance Indicators</span>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {kpis.map((kpi, i) => {
          const t = THEMES[i % THEMES.length]
          return (
            <div key={kpi.col} className="rounded-xl sm:rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              style={{ background: `rgba(14,26,64,0.8)`, border: `1px solid ${t.border}`, boxShadow: `0 4px 24px ${t.glow}` }}>
              <p className="text-xs font-medium truncate mb-2" style={{ color: t.text }} title={kpi.col}>{kpi.col}</p>
              <p className="text-xl sm:text-2xl font-black mb-3"
                style={{ background: t.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {fmt(kpi.sum)}
              </p>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Avg</span>
                  <span className="font-semibold text-slate-300">{fmt(kpi.avg)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-0.5 text-green-400"><ArrowUp size={10} />Max</span>
                  <span className="font-semibold text-slate-300">{fmt(kpi.max)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-0.5 text-red-400"><ArrowDown size={10} />Min</span>
                  <span className="font-semibold text-slate-300">{fmt(kpi.min)}</span>
                </div>
                <div className="flex justify-between items-center pt-1" style={{ borderTop: '1px solid rgba(59,130,246,0.1)' }}>
                  <span className="text-slate-500">Count</span>
                  <span className="font-bold" style={{ color: t.text }}>{kpi.count}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
