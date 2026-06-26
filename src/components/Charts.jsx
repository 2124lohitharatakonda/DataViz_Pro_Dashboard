import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const BLUES = ['#3b82f6', '#60a5fa', '#1d4ed8', '#93c5fd', '#2563eb', '#38bdf8', '#0ea5e9', '#bfdbfe']

const cardStyle = {
  background: 'rgba(8,18,52,0.8)',
  border: '1px solid rgba(59,130,246,0.2)',
  borderRadius: '16px',
  padding: '20px',
  boxShadow: '0 4px 24px rgba(59,130,246,0.08)',
}

const tooltipStyle = {
  backgroundColor: '#0a1628',
  border: '1px solid rgba(59,130,246,0.4)',
  borderRadius: '10px',
  color: '#e2e8f0',
  fontSize: '12px',
  boxShadow: '0 8px 24px rgba(59,130,246,0.2)',
}

const axisStyle = { fill: '#64748b', fontSize: 11 }
const gridStyle = { stroke: 'rgba(59,130,246,0.06)' }

function ChartCard({ title, children }) {
  return (
    <div style={cardStyle}>
      {title && <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-4">{title}</h3>}
      {children}
    </div>
  )
}

const CustomBarShape = (props) => {
  const { x, y, width, height, fill } = props
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} ry={4} />
      <rect x={x} y={y} width={width} height={4} fill={fill} style={{ filter: 'brightness(1.5)' }} rx={4} ry={4} />
    </g>
  )
}

export function BarChartCard({ data, xKey = 'name', yKey = 'value', title }) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 55 }}>
          <defs>
            {BLUES.map((c, i) => (
              <linearGradient key={i} id={`bar${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c} stopOpacity={1} />
                <stop offset="100%" stopColor={c} stopOpacity={0.5} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" {...gridStyle} vertical={false} />
          <XAxis dataKey={xKey} tick={axisStyle} angle={-35} textAnchor="end" interval={0} />
          <YAxis tick={axisStyle} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(59,130,246,0.05)' }} />
          <Bar dataKey={yKey} radius={[6, 6, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={`url(#bar${i % BLUES.length})`} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export function LineChartCard({ data, keys, title }) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            {keys.map((k, i) => (
              <linearGradient key={k} id={`line${i}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={BLUES[i * 2]} />
                <stop offset="100%" stopColor={BLUES[i * 2 + 1] || BLUES[i]} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
          <XAxis dataKey="index" tick={axisStyle} />
          <YAxis tick={axisStyle} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
          {keys.map((k, i) => (
            <Line key={k} type="monotone" dataKey={k}
              stroke={BLUES[i % BLUES.length]}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: BLUES[i % BLUES.length], stroke: '#020818', strokeWidth: 2 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

const RADIAN = Math.PI / 180
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  if (percent < 0.04) return null
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600}>
      {(percent * 100).toFixed(0)}%
    </text>
  )
}

export function PieChartCard({ data, title }) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <defs>
            {BLUES.map((c, i) => (
              <radialGradient key={i} id={`pie${i}`} cx="50%" cy="50%">
                <stop offset="0%" stopColor={c} stopOpacity={1} />
                <stop offset="100%" stopColor={c} stopOpacity={0.6} />
              </radialGradient>
            ))}
          </defs>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%"
            outerRadius="75%" innerRadius="35%"
            labelLine={false}
            label={renderLabel}
            strokeWidth={2} stroke="#020818">
            {data.map((_, i) => <Cell key={i} fill={`url(#pie${i % BLUES.length})`} />)}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 11 }} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export function ScatterChartCard({ data, xLabel, yLabel, title }) {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={260}>
        <ScatterChart margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <radialGradient id="scatterGrad" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.6} />
            </radialGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
          <XAxis dataKey="x" name={xLabel} tick={axisStyle}
            label={{ value: xLabel?.slice(0, 14), position: 'insideBottom', offset: -3, fill: '#475569', fontSize: 10 }} />
          <YAxis dataKey="y" name={yLabel} tick={axisStyle} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3', stroke: 'rgba(59,130,246,0.3)' }} />
          <Scatter data={data} fill="url(#scatterGrad)" opacity={0.8} />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
