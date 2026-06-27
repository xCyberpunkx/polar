'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts'

interface Props {
  data: {
    date: string
    mood: number
    energy: number
    sleep: number
    medsTaken: boolean
    word: string
  }[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0]?.payload
    return (
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-2)',
        borderRadius: '6px',
        padding: '12px 16px',
        fontSize: '12px',
        minWidth: '160px',
      }}>
        <div style={{ color: 'var(--text-2)', marginBottom: '8px', fontWeight: '500' }}>{label}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ color: '#6366f1', fontFamily: 'var(--font-geist-mono)' }}>Mood: {d?.mood}/10</div>
          <div style={{ color: '#22c55e', fontFamily: 'var(--font-geist-mono)' }}>Energy: {d?.energy}/10</div>
          <div style={{ color: 'var(--text-3)', fontFamily: 'var(--font-geist-mono)' }}>Sleep: {d?.sleep}h</div>
          <div style={{ color: d?.medsTaken ? '#22c55e' : '#ef4444' }}>
            Meds: {d?.medsTaken ? 'Taken' : 'Missed'}
          </div>
          {d?.word && <div style={{ color: 'var(--text-2)', fontStyle: 'italic' }}>"{d.word}"</div>}
        </div>
      </div>
    )
  }
  return null
}

export function TimelineChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <ReferenceLine y={5} stroke="var(--border-2)" strokeDasharray="4 2" label={{ value: 'mid', fill: 'var(--text-3)', fontSize: 10 }} />
        <XAxis
          dataKey="date"
          tick={{ fill: 'var(--text-3)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          interval={Math.floor(data.length / 8)}
        />
        <YAxis
          domain={[1, 10]}
          tick={{ fill: 'var(--text-3)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          ticks={[1, 3, 5, 7, 10]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="mood" stroke="#6366f1" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        <Line type="monotone" dataKey="energy" stroke="#22c55e" strokeWidth={1.5} dot={false} strokeDasharray="4 2" activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
