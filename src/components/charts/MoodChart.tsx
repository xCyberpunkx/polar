'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface Props {
  data: { date: string; mood: number; energy: number }[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border-2)',
          borderRadius: '6px',
          padding: '10px 14px',
          fontSize: '12px',
        }}
      >
        <div style={{ color: 'var(--text-2)', marginBottom: '6px' }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} style={{ color: p.color, fontFamily: 'var(--font-geist-mono)' }}>
            {p.dataKey}: {p.value}/10
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function MoodChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: 'var(--text-3)', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[1, 10]}
          tick={{ fill: 'var(--text-3)', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          ticks={[1, 3, 5, 7, 10]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="mood"
          stroke="#6366f1"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#6366f1' }}
        />
        <Line
          type="monotone"
          dataKey="energy"
          stroke="#22c55e"
          strokeWidth={2}
          dot={false}
          strokeDasharray="4 2"
          activeDot={{ r: 4, fill: '#22c55e' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
