'use client'

import { useState } from 'react'
import { Card, Button } from '@/components/ui'

interface Med { id: string; name: string; dosage: string | null; frequency: string | null }

export function MedicationsManager({ initialMeds }: { initialMeds: Med[] }) {
  const [meds, setMeds] = useState(initialMeds)
  const [form, setForm] = useState({ name: '', dosage: '', frequency: '' })
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(false)

  async function addMed() {
    if (!form.name.trim()) return
    setLoading(true)
    const res = await fetch('/api/medications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setMeds([...meds, data])
    setForm({ name: '', dosage: '', frequency: '' })
    setAdding(false)
    setLoading(false)
  }

  async function removeMed(id: string) {
    await fetch(`/api/medications/${id}`, { method: 'DELETE' })
    setMeds(meds.filter((m) => m.id !== id))
  }

  const inputStyle: React.CSSProperties = {
    padding: '8px 12px',
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text)',
    fontSize: '13px',
    fontFamily: 'inherit',
    outline: 'none',
    width: '100%',
  }

  return (
    <div>
      {meds.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {meds.map((m) => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
              }}
            >
              <div>
                <div style={{ fontSize: '14px', color: 'var(--text)', fontWeight: '500' }}>{m.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>
                  {[m.dosage, m.frequency].filter(Boolean).join(' · ') || 'No details added'}
                </div>
              </div>
              <button
                onClick={() => removeMed(m.id)}
                style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: '16px', padding: '4px' }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {adding ? (
        <Card style={{ border: '1px solid var(--border-2)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
            <input
              placeholder="Medication name (e.g. Lamotrigine) *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input
                placeholder="Dosage (e.g. 200mg)"
                value={form.dosage}
                onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                style={inputStyle}
              />
              <input
                placeholder="Frequency (e.g. Once daily)"
                value={form.frequency}
                onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" onClick={() => setAdding(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</Button>
            <Button onClick={addMed} disabled={!form.name.trim() || loading} style={{ flex: 2, justifyContent: 'center' }}>
              {loading ? 'Saving...' : 'Add Medication'}
            </Button>
          </div>
        </Card>
      ) : (
        <Button variant="secondary" onClick={() => setAdding(true)}>+ Add medication</Button>
      )}
    </div>
  )
}
