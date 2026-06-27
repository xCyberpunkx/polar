'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Button } from '@/components/ui'

const COMMON = ['Alcohol', 'Cannabis', 'Caffeine (excess)', 'Tobacco', 'MDMA', 'Cocaine', 'Other']

export function SubstanceForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    substance: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    notes: '',
  })

  async function handleSubmit() {
    if (!form.substance) return
    setLoading(true)
    await fetch('/api/substances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setLoading(false)
    setOpen(false)
    setForm({ substance: '', date: new Date().toISOString().split('T')[0], amount: '', notes: '' })
    router.refresh()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 14px',
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text)',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>+ Log substance use</Button>
    )
  }

  return (
    <Card style={{ border: '1px solid var(--border-2)', marginBottom: '8px' }}>
      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>New Entry</div>

      {/* Quick select */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '8px' }}>Substance</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
          {COMMON.map((s) => (
            <button
              key={s}
              onClick={() => setForm({ ...form, substance: s })}
              style={{
                padding: '5px 12px',
                borderRadius: '20px',
                border: `1px solid ${form.substance === s ? 'var(--accent)' : 'var(--border)'}`,
                background: form.substance === s ? '#1e1b4b' : 'var(--surface-2)',
                color: form.substance === s ? 'var(--accent)' : 'var(--text-2)',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          placeholder="Or type custom..."
          value={COMMON.includes(form.substance) ? '' : form.substance}
          onChange={(e) => setForm({ ...form, substance: e.target.value })}
          style={inputStyle}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '6px' }}>Date</div>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '6px' }}>Amount (optional)</div>
          <input placeholder="e.g. 2 drinks" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} style={inputStyle} />
        </div>
      </div>

      <input
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
        style={{ ...inputStyle, marginBottom: '14px' }}
      />

      <div style={{ display: 'flex', gap: '8px' }}>
        <Button variant="secondary" onClick={() => setOpen(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!form.substance || loading} style={{ flex: 2, justifyContent: 'center' }}>
          {loading ? 'Saving...' : 'Log entry'}
        </Button>
      </div>
    </Card>
  )
}
