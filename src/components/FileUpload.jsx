import { useCallback, useState } from 'react'
import { Upload, FileSpreadsheet, AlertCircle, BarChart2, TrendingUp, PieChart, Database } from 'lucide-react'

const features = [
  { icon: <BarChart2 size={22} />, title: 'Smart Bar Charts', desc: 'Auto-picks best category & value columns' },
  { icon: <TrendingUp size={22} />, title: 'Trend Lines', desc: 'Visualize numeric trends across rows' },
  { icon: <PieChart size={22} />, title: 'Pie Distribution', desc: 'See category breakdowns instantly' },
  { icon: <Database size={22} />, title: 'KPI Cards', desc: 'Sum, Avg, Max, Min auto-detected' },
]

export default function FileUpload({ onData }) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFile = useCallback(async (file) => {
    if (!file) return
    setError('')
    setLoading(true)
    try {
      const { parseFile } = await import('../utils/dataParser')
      const data = await parseFile(file)
      if (!data || data.length === 0) throw new Error('File is empty or has no valid data.')
      onData(data, file.name)
    } catch (e) {
      setError(e.message || 'Failed to parse file.')
      setLoading(false)
    }
  }, [onData])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }, [handleFile])

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center px-4 py-10"
      style={{ background: 'radial-gradient(ellipse at 20% 50%, #0d1f4e 0%, #020818 40%, #050d24 100%)' }}>

      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-64 sm:w-96 h-64 sm:h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #1d4ed8, transparent)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-64 sm:w-96 h-64 sm:h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)', filter: 'blur(80px)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-72 h-48 sm:h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #60a5fa, transparent)', filter: 'blur(60px)' }} />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-8 sm:mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="animate-float p-3 sm:p-4 rounded-2xl glow-strong"
            style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)' }}>
            <FileSpreadsheet size={28} color="white" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              DataViz <span style={{ color: '#60a5fa' }}>Pro</span>
            </h1>
            <p className="text-xs sm:text-sm font-medium" style={{ color: '#93c5fd' }}>AI-Powered Data Analytics</p>
          </div>
        </div>
        <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Upload any <span style={{ color: '#60a5fa' }}>Excel</span> or <span style={{ color: '#60a5fa' }}>CSV</span> file and get instant dashboards, charts & insights
        </p>
      </div>

      {/* Upload Zone */}
      <div className="relative z-10 w-full max-w-xl sm:max-w-2xl">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !loading && document.getElementById('fileInput').click()}
          className="relative rounded-2xl sm:rounded-3xl p-10 sm:p-16 text-center cursor-pointer transition-all duration-300 overflow-hidden"
          style={{
            background: dragging
              ? 'rgba(29, 78, 216, 0.25)'
              : 'rgba(14, 26, 64, 0.6)',
            border: `2px dashed ${dragging ? '#3b82f6' : 'rgba(59,130,246,0.3)'}`,
            backdropFilter: 'blur(20px)',
            boxShadow: dragging ? '0 0 40px rgba(59,130,246,0.3)' : '0 0 20px rgba(59,130,246,0.08)',
          }}>

          {/* Inner glow on drag */}
          {dragging && (
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at center, rgba(59,130,246,0.15), transparent 70%)' }} />
          )}

          <input id="fileInput" type="file" accept=".csv,.xlsx,.xls" className="hidden"
            onChange={(e) => handleFile(e.target.files[0])} />

          {loading ? (
            <div className="flex flex-col items-center gap-5">
              <div className="relative">
                <div className="w-14 h-14 rounded-full border-4 border-blue-900 border-t-blue-400 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <BarChart2 size={18} style={{ color: '#60a5fa' }} />
                </div>
              </div>
              <div>
                <p className="text-white font-semibold text-lg">Analyzing your data...</p>
                <p className="text-blue-400 text-sm mt-1">Building charts & insights</p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-5 relative inline-block">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto"
                  style={{ background: dragging ? 'rgba(59,130,246,0.3)' : 'rgba(29,78,216,0.2)', border: '1px solid rgba(59,130,246,0.3)' }}>
                  <Upload size={32} color={dragging ? '#60a5fa' : '#3b82f6'} />
                </div>
              </div>
              <p className="text-lg sm:text-xl font-bold text-white mb-2">
                {dragging ? '✨ Release to Analyze!' : 'Drop your file here'}
              </p>
              <p className="text-slate-400 text-sm mb-6">or click to browse your files</p>
              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                {['CSV', 'XLSX', 'XLS'].map((fmt) => (
                  <span key={fmt} className="px-3 py-1.5 rounded-full text-xs font-bold tracking-wide"
                    style={{ background: 'rgba(29,78,216,0.3)', border: '1px solid rgba(59,130,246,0.4)', color: '#93c5fd' }}>
                    .{fmt}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <AlertCircle size={18} color="#f87171" />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        )}
      </div>

      {/* Feature Cards */}
      <div className="relative z-10 mt-10 sm:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-xl sm:max-w-2xl">
        {features.map((f) => (
          <div key={f.title} className="rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center transition-all duration-300 hover:scale-105"
            style={{ background: 'rgba(14,26,64,0.7)', border: '1px solid rgba(59,130,246,0.15)', backdropFilter: 'blur(12px)' }}>
            <div className="flex justify-center mb-2 sm:mb-3" style={{ color: '#60a5fa' }}>{f.icon}</div>
            <div className="font-bold text-white text-xs sm:text-sm mb-1">{f.title}</div>
            <div className="text-slate-500 text-xs leading-snug hidden sm:block">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
