'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Button, SliderInput } from '@/components/ui'

const WORDS = ['calm', 'anxious', 'energized', 'tired', 'hopeful', 'overwhelmed', 'neutral', 'happy', 'sad', 'restless', 'focused', 'foggy', 'irritable', 'content', 'numb', 'wired', 'empty', 'motivated']

export function PulseForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [reflection, setReflection] = useState('')
  const [form, setForm] = useState({
    mood: 5, energy: 5, sleep: 7, medsTaken: null as boolean | null, word: '', note: '',
  })

  const totalSteps = 4

  async function handleSubmit() {
    if (form.medsTaken === null || !form.word) return
    setLoading(true)
    try {
      const res = await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.aiReflection) {
        setReflection(data.aiReflection)
        setStep(5)
      } else {
        router.push('/')
        router.refresh()
      }
    } catch (e) {
      setLoading(false)
    }
  }

  const progress = Math.min(100, ((step - 1) / totalSteps) * 100)

  return (
    <div style={{ maxWidth: '520px' }}>
      {/* Progress */}
      {step <= totalSteps && (
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: 'var(--text-3)' }}>
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div style={{ height: '3px', background: 'var(--border-2)', borderRadius: '2px' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent)', borderRadius: '2px', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px', letterSpacing: '-0.02em' }}>How are you feeling?</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-2)', marginBottom: '32px' }}>Rate your mood and energy right now, not how you want to feel.</p>
          <SliderInput label="Mood" value={form.mood} onChange={v => setForm(f => ({ ...f, mood: v }))} color="var(--accent)" />
          <SliderInput label="Energy Level" value={form.energy} onChange={v => setForm(f => ({ ...f, energy: v }))} color="var(--success)" />
          <Button onClick={() => setStep(2)} style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }} size="lg">Continue →</Button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px', letterSpacing: '-0.02em' }}>How did you sleep?</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-2)', marginBottom: '32px' }}>Hours of sleep last night. Sleep is the most important variable in bipolar disorder.</p>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '64px', fontWeight: '700', fontFamily: 'var(--font-geist-mono)', color: 'var(--text)', lineHeight: 1 }}>
              {form.sleep}
              <span style={{ fontSize: '28px', color: 'var(--text-3)', fontWeight: '400' }}>h</span>
            </div>
            <div style={{ fontSize: '13px', marginTop: '8px', height: '20px' }}>
              {form.sleep < 5 ? <span style={{ color: 'var(--danger)' }}>Low sleep is a major trigger — note this</span>
               : form.sleep < 6 ? <span style={{ color: 'var(--warning)' }}>Below recommended range</span>
               : form.sleep >= 7 && form.sleep <= 9 ? <span style={{ color: 'var(--success)' }}>Good sleep range</span>
               : form.sleep > 10 ? <span style={{ color: 'var(--accent)' }}>Long sleep — common in depressive episodes</span>
               : <span style={{ color: 'var(--text-3)' }}>&nbsp;</span>}
            </div>
          </div>
          <input type="range" min={0} max={14} step={0.5} value={form.sleep}
            onChange={e => setForm(f => ({ ...f, sleep: Number(e.target.value) }))}
            style={{ width: '100%', marginBottom: '28px', accentColor: 'var(--accent)' }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center' }}>← Back</Button>
            <Button onClick={() => setStep(3)} style={{ flex: 2, justifyContent: 'center' }}>Continue →</Button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px', letterSpacing: '-0.02em' }}>Medication today?</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-2)', marginBottom: '32px' }}>No judgment. This is just data. Consistency with medication is the single most protective factor in bipolar disorder.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
            {[
              { value: true, label: 'Yes, taken', color: 'var(--success)', dim: 'var(--success-dim)' },
              { value: false, label: 'Not today', color: 'var(--danger)', dim: 'var(--danger-dim)' },
            ].map(({ value, label, color, dim }) => (
              <button key={String(value)} onClick={() => setForm(f => ({ ...f, medsTaken: value }))}
                style={{
                  padding: '24px 16px', borderRadius: 'var(--radius)', cursor: 'pointer',
                  border: `2px solid ${form.medsTaken === value ? color : 'var(--border)'}`,
                  background: form.medsTaken === value ? dim : 'var(--surface-2)',
                  color: form.medsTaken === value ? color : 'var(--text-2)',
                  fontSize: '15px', fontWeight: '600', fontFamily: 'inherit', transition: 'all 0.15s',
                }}>
                {label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" onClick={() => setStep(2)} style={{ flex: 1, justifyContent: 'center' }}>← Back</Button>
            <Button onClick={() => setStep(4)} disabled={form.medsTaken === null} style={{ flex: 2, justifyContent: 'center' }}>Continue →</Button>
          </div>
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px', letterSpacing: '-0.02em' }}>One word for today</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-2)', marginBottom: '20px' }}>Pick one or type your own. This becomes part of your longitudinal data.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {WORDS.map(w => (
              <button key={w} onClick={() => setForm(f => ({ ...f, word: w }))}
                style={{
                  padding: '7px 14px', borderRadius: '20px', cursor: 'pointer', fontFamily: 'inherit',
                  border: `1px solid ${form.word === w ? 'var(--accent)' : 'var(--border)'}`,
                  background: form.word === w ? 'var(--accent-dim)' : 'var(--surface-2)',
                  color: form.word === w ? 'var(--accent)' : 'var(--text-2)',
                  fontSize: '14px', transition: 'all 0.1s',
                }}>
                {w}
              </button>
            ))}
          </div>
          <input type="text" placeholder="Or type your own..."
            value={WORDS.includes(form.word) ? '' : form.word}
            onChange={e => setForm(f => ({ ...f, word: e.target.value }))}
            style={{
              width: '100%', padding: '11px 14px', background: 'var(--surface-2)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
              color: 'var(--text)', fontSize: '14px', fontFamily: 'inherit', outline: 'none', marginBottom: '12px',
            }} />
          <textarea placeholder="Anything to add? (optional — this is private)"
            value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
            rows={3} style={{
              width: '100%', padding: '11px 14px', background: 'var(--surface-2)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
              color: 'var(--text)', fontSize: '14px', fontFamily: 'inherit',
              outline: 'none', resize: 'none', marginBottom: '16px',
            }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" onClick={() => setStep(3)} style={{ flex: 1, justifyContent: 'center' }}>← Back</Button>
            <Button onClick={handleSubmit} disabled={!form.word || loading} style={{ flex: 2, justifyContent: 'center' }} size="lg">
              {loading ? 'Saving...' : 'Save pulse'}
            </Button>
          </div>
        </div>
      )}

      {/* Step 5 — AI reflection + redirect */}
      {step === 5 && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%', background: 'var(--success-dim)',
            border: '1px solid var(--success)', margin: '0 auto 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: 'var(--success)', fontSize: '22px', fontWeight: '700' }}>✓</span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text)', marginBottom: '6px', letterSpacing: '-0.02em' }}>
            Pulse recorded
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-2)', marginBottom: '24px' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          {reflection && (
            <div style={{
              padding: '18px 22px', background: 'var(--accent-dim)',
              border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
              borderRadius: 'var(--radius)', fontSize: '16px', color: 'var(--text)',
              fontStyle: 'italic', lineHeight: '1.6', marginBottom: '28px', textAlign: 'left',
            }}>
              "{reflection}"
            </div>
          )}
          <Button onClick={() => { router.push('/'); router.refresh() }} style={{ width: '100%', justifyContent: 'center' }} size="lg">
            Go to dashboard →
          </Button>
        </div>
      )}
    </div>
  )
}
