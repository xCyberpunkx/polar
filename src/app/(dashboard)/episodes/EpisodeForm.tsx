'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Button, SliderInput } from '@/components/ui'

export function EpisodeForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    type: 'manic',
    startDate: '',
    endDate: '',
    trigger: '',
    whatHelped: '',
    severity: 5,
    notes: '',
  })

  async function handleSubmit() {
    if (!form.startDate) return
    setLoading(true)
    await fetch('/api/episodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setLoading(false)
    setOpen(false)
    setForm({ type: 'manic', startDate: '', endDate: '', trigger: '', whatHelped: '', severity: 5, notes: '' })
    router.refresh()
  }

  const inputStyle = {
    width: '100%',
    padding: '9px 14px',
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text)',
    fontSize: '14px',
    fontFamily: 'inherit',
    marginBottom: '12px',
    outline: 'none',
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} style={{ marginBottom: '8px' }}>
        + Log an episode
      </Button>
    )
  }

  return (
    <Card style={{ marginBottom: '16px', border: '1px solid var(--border-2)' }}>
      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '20px' }}>New Episode</div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ fontSize: '12px', color: 'var(--text-2)', display: 'block', marginBottom: '6px' }}>Type</label>
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          style={{ ...inputStyle, marginBottom: '0' }}
        >
          <option value="manic">Manic</option>
          <option value="hypomanic">Hypomanic</option>
          <option value="depressive">Depressive</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div>
          <label style={{ fontSize: '12px', color: 'var(--text-2)', display: 'block', marginBottom: '6px' }}>Start Date *</label>
          <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} style={{ ...inputStyle, marginBottom: 0 }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: 'var(--text-2)', display: 'block', marginBottom: '6px' }}>End Date (if over)</label>
          <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} style={{ ...inputStyle, marginBottom: 0 }} />
        </div>
      </div>

      <SliderInput label="Severity" value={form.severity} onChange={(v) => setForm({ ...form, severity: v })} color="var(--danger)" />

      <input type="text" placeholder="What triggered it? (optional)" value={form.trigger} onChange={(e) => setForm({ ...form, trigger: e.target.value })} style={inputStyle} />
      <input type="text" placeholder="What helped? (optional)" value={form.whatHelped} onChange={(e) => setForm({ ...form, whatHelped: e.target.value })} style={inputStyle} />
      <textarea placeholder="Additional notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'none' }} />

      <div style={{ display: 'flex', gap: '8px' }}>
        <Button variant="secondary" onClick={() => setOpen(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!form.startDate || loading} style={{ flex: 2, justifyContent: 'center' }}>
          {loading ? 'Saving...' : 'Save Episode'}
        </Button>
      </div>
    </Card>
  )
}
