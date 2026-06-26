import { useState, useMemo } from 'react'
import { Upload, Download, FileSpreadsheet, BarChart2, RefreshCw } from 'lucide-react'
import KPICards from './KPICards'
import { BarChartCard, LineChartCard, PieChartCard, ScatterChartCard } from './Charts'
import DataTable from './DataTable'
import CorrelationMatrix from './CorrelationMatrix'
import {
  analyzeData, getKPIs, getBarData, getPieData, getLineData, getScatterData
} from '../utils/dataParser'

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

  const SelectBox = ({ value, onChange, options, label }) => (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400">{label}:</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="text-xs bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-2 py-1 outline-none">
        {options.map((o) => <option key={o} value={o}>{o.slice(0, 20)}</option>)}
      </select>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: '#0f172a' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #1e293b' }}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <BarChart2 size={20} color="white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">DataViz Pro</h1>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <FileSpreadsheet size={12} /> {fileName} · {data.length} rows · {columns.length} columns
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex gap-2 text-xs text-slate-400">
            <span className="px-2 py-1 rounded-full" style={{ background: '#1e293b' }}>📊 {numericCols.length} numeric</span>
            <span className="px-2 py-1 rounded-full" style={{ background: '#1e293b' }}>🏷️ {categoricalCols.length} categorical</span>
          </div>
          <button onClick={onReset} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <Upload size={14} /> New File
          </button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* KPIs */}
        {kpis.length > 0 && <KPICards kpis={kpis} />}

        {/* Bar + Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categoricalCols.length > 0 && numericCols.length > 0 && (
            <div style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h3 className="text-sm font-semibold text-slate-300 flex-1">📊 Bar Chart</h3>
                <SelectBox label="Category" value={barCat} onChange={setBarCat} options={categoricalCols} />
                <SelectBox label="Value" value={barNum} onChange={setBarNum} options={numericCols} />
              </div>
              {barData.length > 0 && <BarChartCard data={barData} title="" />}
            </div>
          )}

          {categoricalCols.length > 0 && (
            <div style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h3 className="text-sm font-semibold text-slate-300 flex-1">🥧 Distribution</h3>
                <SelectBox label="Column" value={pieCat} onChange={setPieCat} options={categoricalCols} />
              </div>
              {pieData.length > 0 && <PieChartCard data={pieData} title="" />}
            </div>
          )}
        </div>

        {/* Line Chart */}
        {numericCols.length > 0 && (
          <LineChartCard
            data={lineData}
            keys={numericCols.slice(0, 3)}
            title={`📈 Trend — ${numericCols.slice(0, 3).join(', ')} (first 30 rows)`}
          />
        )}

        {/* Scatter + Correlation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {numericCols.length >= 2 && (
            <div style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h3 className="text-sm font-semibold text-slate-300 flex-1">⚡ Scatter Plot</h3>
                <SelectBox label="X" value={scatterX} onChange={setScatterX} options={numericCols} />
                <SelectBox label="Y" value={scatterY} onChange={setScatterY} options={numericCols} />
              </div>
              {scatterData.length > 0 && <ScatterChartCard data={scatterData} xLabel={scatterX} yLabel={scatterY} title="" />}
            </div>
          )}
          {numericCols.length >= 2 && <CorrelationMatrix data={data} numericCols={numericCols} />}
        </div>

        {/* Data Table */}
        <DataTable data={data} columns={columns} />
      </div>
    </div>
  )
}
