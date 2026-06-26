import { useCallback, useState } from 'react'
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react'

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
    } finally {
      setLoading(false)
    }
  }, [onData])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }, [handleFile])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-2xl" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <FileSpreadsheet size={32} color="white" />
          </div>
          <h1 className="text-4xl font-bold text-white">DataViz Pro</h1>
        </div>
        <p className="text-slate-400 text-lg">Upload your Excel or CSV file and get instant dashboards & insights</p>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className="w-full max-w-2xl rounded-3xl border-2 border-dashed p-16 text-center cursor-pointer transition-all duration-300"
        style={{
          borderColor: dragging ? '#6366f1' : '#334155',
          background: dragging ? 'rgba(99,102,241,0.1)' : 'rgba(30,41,59,0.6)',
          backdropFilter: 'blur(10px)',
        }}
        onClick={() => document.getElementById('fileInput').click()}
      >
        <input
          id="fileInput"
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-300 text-lg">Analyzing your data...</p>
          </div>
        ) : (
          <>
            <Upload size={56} className="mx-auto mb-6" color={dragging ? '#6366f1' : '#475569'} />
            <p className="text-xl font-semibold text-slate-200 mb-2">
              {dragging ? 'Drop it here!' : 'Drag & Drop your file here'}
            </p>
            <p className="text-slate-400 mb-6">or click to browse</p>
            <div className="flex items-center justify-center gap-3">
              {['CSV', 'XLSX', 'XLS'].map((fmt) => (
                <span key={fmt} className="px-3 py-1 rounded-full text-xs font-medium text-indigo-300" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
                  {fmt}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-400 bg-red-900/20 border border-red-800 rounded-xl px-4 py-3">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-12 grid grid-cols-3 gap-6 max-w-2xl w-full">
        {[
          { icon: '📊', title: 'Auto Charts', desc: 'Bar, Line, Pie, Scatter — auto-generated' },
          { icon: '🔢', title: 'KPI Cards', desc: 'Sum, Avg, Max, Min for all numeric cols' },
          { icon: '🔗', title: 'Correlation', desc: 'Detect relationships between columns' },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl p-5 text-center" style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid #1e293b' }}>
            <div className="text-3xl mb-2">{f.icon}</div>
            <div className="font-semibold text-white mb-1">{f.title}</div>
            <div className="text-slate-400 text-sm">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
