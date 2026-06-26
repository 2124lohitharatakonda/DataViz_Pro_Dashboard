import { useState, useMemo } from 'react'
import { Upload, BarChart2, FileSpreadsheet, ChevronDown } from 'lucide-react'
import KPICards from './KPICards'
import { BarChartCard, LineChartCard, PieChartCard, ScatterChartCard } from './Charts'
import DataTable from './DataTable'
import CorrelationMatrix from './CorrelationMatrix'
import { analyzeData, getKPIs, getBarData, getPieData, getLineData, getScatterData } from '../utils/dataParser'

function SelectBox({ value, onChange, options, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-slate-500 whitespace-nowrap">{label}</span>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)}
          className="appearance-none text-xs rounded-lg pl-2 pr-6 py-1.5 outline-none cursor-pointer"
          style={{ background: 'rgba(29,78,216,0.2)', border: '1px solid rgba(59,130,246,0.35)', color: '#93c5fd' }}>
          {options.map((o) => <option key={o} value={o} style={{ background: '#0a1628' }}>{o.slice(0, 18)}</option>)}
        </select>
        <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#60a5fa' }} />
      </div>
    </div>
  )
}

function SectionCard({ title, controls, children }) {
  return (
    <div className="rounded-xl sm:rounded-2xl overflow-hidden"
      style={{ background: 'rgba(8,18,52,0.8)', border: '1px solid rgba(59,130,246,0.2)', boxShadow: '0 4px 24px rgba(59,130,246,0.08)' }}>
      <div className="flex flex-wrap items-center gap-3 px-4 sm:px-5 py-3 sm:py-4"
        style={{ borderBottom: '1px solid rgba(59,130,246,0.12)', background: 'rgba(29,78,216,0.07)' }}>
        <h3 className="text-xs sm:text-sm font-bold text-white flex-1">{title}</h3>
        {controls}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  )
}

export default function Dashboard({ data, fileName, onReset }) {
  const analysis = useMemo(() => analyzeData(data), [data])
  const { columns, numericCols, categoricalCols } = analysis

  const [barCat, setBarCat] = useState(categoricalCols[0] || '')
  const [barNum, setBarNum] = useState(numericCols[0] || '')
  const [pieCat, setPieCat] = useState(categoricalCols[0] || '')
  const [scatterX, setScatterX] = useState(numericCols[0] || '')
  const [scatterY, setScatterY] = useState(numericCols[1] || numericCols[0] || '')

  const kpis = useMemo(() => getKPIs(data, numericCols), [data, numericCols])
  const barData = useMemo(() => barCat && barNum ? getBarData(data, barCat, barNum) : [], [data, barCat, barNum])
  const pieData = useMemo(() => pieCat ? getPieData(data, pieCat) : [], [data, pieCat])
  const lineData = useMemo(() => getLineData(data, numericCols), [data, numericCols])
  const scatterData = useMemo(() => scatterX && scatterY ? getScatterData(data, scatterX, scatterY) : [], [data, scatterX, scatterY])

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at top, #0d1f4e 0%, #020818 50%)' }}>

      {/* Sticky Header */}
      <div className="sticky top-0 z-20 px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap items-center gap-3"
        style={{ background: 'rgba(2,8,24,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(59,130,246,0.15)', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>

        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="p-2 rounded-xl flex-shrink-0" style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>
            <BarChart2 size={18} color="white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-black text-white">
              DataViz <span style={{ color: '#60a5fa' }}>Pro</span>
            </h1>
            <p className="text-xs text-slate-500 truncate flex items-center gap-1">
              <FileSpreadsheet size={10} />
              <span className="truncate">{fileName}</span>
            </p>
          </div>
        </div>

        {/* Stats pills */}
        <div className="hidden sm:flex gap-2">
          {[
            { label: `${data.length} rows`, color: '#3b82f6' },
            { label: `${columns.length} cols`, color: '#60a5fa' },
            { label: `${numericCols.length} numeric`, color: '#38bdf8' },
          ].map(({ label, color }) => (
            <span key={label} className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: 'rgba(29,78,216,0.2)', border: '1px solid rgba(59,130,246,0.25)', color }}>
              {label}
            </span>
          ))}
        </div>

        <button onClick={onReset}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all hover:scale-105 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', boxShadow: '0 4px 16px rgba(59,130,246,0.3)' }}>
          <Upload size={14} />
          <span className="hidden sm:inline">New File</span>
        </button>
      </div>

      {/* Content */}
      <div className="px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-screen-2xl mx-auto">

        {/* KPIs */}
        {kpis.length > 0 && <KPICards kpis={kpis} />}

        {/* Bar + Pie */}
        {(categoricalCols.length > 0 && numericCols.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {categoricalCols.length > 0 && numericCols.length > 0 && (
              <SectionCard
                title="📊 Bar Chart — Top Values"
                controls={<>
                  <SelectBox label="Category" value={barCat} onChange={setBarCat} options={categoricalCols} />
                  <SelectBox label="Value" value={barNum} onChange={setBarNum} options={numericCols} />
                </>}>
                {barData.length > 0 && <BarChartCard data={barData} />}
              </SectionCard>
            )}
            {categoricalCols.length > 0 && (
              <SectionCard
                title="🥧 Pie Chart — Distribution"
                controls={<SelectBox label="Column" value={pieCat} onChange={setPieCat} options={categoricalCols} />}>
                {pieData.length > 0 && <PieChartCard data={pieData} />}
              </SectionCard>
            )}
          </div>
        )}

        {/* Line Chart */}
        {numericCols.length > 0 && (
          <SectionCard title={`📈 Trend Analysis — ${numericCols.slice(0, 3).join(', ')} (first 30 rows)`}>
            <LineChartCard data={lineData} keys={numericCols.slice(0, 3)} />
          </SectionCard>
        )}

        {/* Scatter + Correlation */}
        {numericCols.length >= 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <SectionCard
              title="⚡ Scatter Plot"
              controls={<>
                <SelectBox label="X" value={scatterX} onChange={setScatterX} options={numericCols} />
                <SelectBox label="Y" value={scatterY} onChange={setScatterY} options={numericCols} />
              </>}>
              {scatterData.length > 0 && <ScatterChartCard data={scatterData} xLabel={scatterX} yLabel={scatterY} />}
            </SectionCard>
            <CorrelationMatrix data={data} numericCols={numericCols} />
          </div>
        )}

        {/* Data Table */}
        <DataTable data={data} columns={columns} />
      </div>
    </div>
  )
}
