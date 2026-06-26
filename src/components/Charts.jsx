import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6']

const cardStyle = {
  background: 'rgba(30,41,59,0.8)',
  border: '1px solid #1e293b',
  borderRadius: '16px',
  padding: '20px',
}

const tooltipStyle = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '8px',
  color: '#e2e8f0',
}

function ChartCard({ title, children }) {
  return (
    <div style={cardStyle}>
      <h3 className="text-sm font-semibold text-slate-300 mb-4">{title}</h3>
      {children}
    </div>
  )
}

export function BarChartCard({ data, xKey = 'name', yKey = 'value', title }) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey={xKey} tick={{ fill: '#94a3b8', fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey={yKey} radius={[4, 4, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export function LineChartCard({ data, keys, title }) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="index" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
          {keys.map((k, i) => (
            <Line key={k} type="monotone" dataKey={k} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export function PieChartCard({ data, title }) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            labelLine={{ stroke: '#475569' }}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export function ScatterChartCard({ data, xLabel, yLabel, title }) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="x" name={xLabel} tick={{ fill: '#94a3b8', fontSize: 11 }} label={{ value: xLabel, position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 11 }} />
          <YAxis dataKey="y" name={yLabel} tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter data={data} fill="#6366f1" opacity={0.7} />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
