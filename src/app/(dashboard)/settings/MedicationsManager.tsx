'use client'

import { useState } from 'react'
import { Card, Button } from '@/components/ui'

interface Med { id: string; name: string; dosage: string | null; frequency: string | null }

const COMMON_MEDS = [
  { name: 'Lamotrigine (Lamictal)', category: 'Mood Stabilizer' },
  { name: 'Gabapentin (Gabatrex)', category: 'Mood Stabilizer' },
  { name: 'Lithium', category: 'Mood Stabilizer' },
  { name: 'Valproate (Depakote)', category: 'Mood Stabilizer' },
  { name: 'Quetiapine (Seroquel)', category: 'Antipsychotic' },
  { name: 'Olanzapine (Zyprexa)', category: 'Antipsychotic' },
  { name: 'Aripiprazole (Abilify)', category: 'Antipsychotic' },
  { name: 'Risperidone (Risperdal)', category: 'Antipsychotic' },
  { name: 'Lurasidone (Latuda)', category: 'Antipsychotic' },
  { name: 'Fluoxetine (Prozac)', category: 'Antidepressant' },
  { name: 'Sertraline (Zoloft)', category: 'Antidepressant' },
  { name: 'Escitalopram (Lexapro)', category: 'Antidepressant' },
  { name: 'Depritine', category: 'Antidepressant' },
  { name: 'Clonazepam (Klonopin)', category: 'Anxiolytic' },
  { name: 'Lorazepam (Ativan)', category: 'Anxiolytic' },
  { name: 'Carbamazepine (Tegretol)', category: 'Mood Stabilizer' },
]

const categories = [...new Set(COMMON_MEDS.map(m => m.category))]

const inputStyle: React.CSSProperties = {
  padding: '9px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '14px',
  fontFamily: 'inherit', outline: 'none', width: '100%',
}

export function MedicationsManager({ initialMeds }: { initialMeds: Med[] }) {
  const [meds, setMeds] = useState(initialMeds)
  const [form, setForm] = useState({ name: '', dosage: '', frequency: 'Once daily' })
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(false)

  async function addMed(name?: string) {
    const medName = name || form.name
    if (!medName.trim()) return
    setLoading(true)
    const res = await fetch('/api/medications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: medName, dosage: form.dosage, frequency: form.frequency }),
    })
    const data = await res.json()
    setMeds([...meds, data])
    setForm({ name: '', dosage: '', frequency: 'Once daily' })
    setAdding(false)
    setLoading(false)
  }

  async function removeMed(id: string) {
    await fetch(`/api/medications/${id}`, { method: 'DELETE' })
    setMeds(meds.filter(m => m.id !== id))
  }

  return (
    <div>
      {/* Current meds */}
      {meds.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {meds.map(m => (
            <div key={m.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
            }}>
              <div>
                <div style={{ fontSize: '14px', color: 'var(--text)', fontWeight: '500' }}>{m.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>
                  {[m.dosage, m.frequency].filter(Boolean).join(' · ') || 'No details added'}
                </div>
              </div>
              <button onClick={() => removeMed(m.id)} style={{
                background: 'none', border: 'none', color: 'var(--text-3)',
                cursor: 'pointer', fontSize: '18px', padding: '4px', lineHeight: 1,
              }}>×</button>
            </div>
          ))}
        </div>
      )}

      {adding ? (
        <Card style={{ border: '1px solid var(--border-2)', marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', marginBottom: '16px' }}>
            Add Medication
          </div>

          {/* Quick presets by category */}
          {categories.map(cat => (
            <div key={cat} style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                {cat}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {COMMON_MEDS.filter(m => m.category === cat && !meds.some(ex => ex.name === m.name)).map(m => (
                  <button key={m.name} onClick={() => setForm(f => ({ ...f, name: m.name }))}
                    style={{
                      padding: '5px 10px', borderRadius: '20px', fontSize: '12px',
                      border: `1px solid ${form.name === m.name ? 'var(--accent)' : 'var(--border)'}`,
                      background: form.name === m.name ? 'var(--accent-dim)' : 'var(--surface-2)',
                      color: form.name === m.name ? 'var(--accent)' : 'var(--text-2)',
                      cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.1s',
                    }}>
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px', marginTop: '4px' }}>
            <input placeholder="Or type custom medication name..." value={COMMON_MEDS.some(m => m.name === form.name) ? '' : form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              style={{ ...inputStyle, marginBottom: '10px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <input placeholder="Dosage (e.g. 200mg)" value={form.dosage} onChange={e => setForm(f => ({ ...f, dosage: e.target.value }))} style={inputStyle} />
              <select value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))} style={inputStyle}>
                <option>Once daily</option>
                <option>Twice daily</option>
                <option>Three times daily</option>
                <option>At bedtime</option>
                <option>Morning</option>
                <option>As needed (PRN)</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="secondary" onClick={() => setAdding(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</Button>
              <Button onClick={() => addMed()} disabled={!form.name.trim() || loading} style={{ flex: 2, justifyContent: 'center' }}>
                {loading ? 'Saving...' : 'Add medication'}
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Button variant="secondary" onClick={() => setAdding(true)}>+ Add medication</Button>
      )}
    </div>
  )
}
