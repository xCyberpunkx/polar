'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Button, SliderInput } from '@/components/ui'

const WORDS = ['calm', 'anxious', 'energized', 'tired', 'hopeful', 'overwhelmed', 'neutral', 'happy', 'sad', 'restless', 'focused', 'foggy', 'irritable', 'content', 'numb']

export function PulseForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [reflection, setReflection] = useState('')

  const [form, setForm] = useState({
    mood: 5,
    energy: 5,
    sleep: 7,
    medsTaken: null as boolean | null,
    word: '',
    note: '',
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
        setStep(5) // reflection step
      } else {
        router.push('/')
        router.refresh()
      }
    } catch (e) {
      setLoading(false)
    }
  }

  return (
    <Card>
      {/* Progress bar */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>
            {step <= totalSteps ? `Step ${step} of ${totalSteps}` : 'Complete'}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>
            {step <= totalSteps ? `${Math.round((step / totalSteps) * 100)}%` : '100%'}
          </span>
        </div>
        <div style={{ height: '3px', background: 'var(--border-2)', borderRadius: '2px' }}>
          <div
            style={{
              height: '100%',
              width: `${Math.min(100, (step / totalSteps) * 100)}%`,
              background: 'var(--accent)',
              borderRadius: '2px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Step 1: Mood & Energy */}
      {step === 1 && (
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>How are you feeling?</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '24px' }}>Rate your mood and energy right now.</p>

          <SliderInput
            label="Mood"
            value={form.mood}
            onChange={(v) => setForm({ ...form, mood: v })}
            color="#6366f1"
          />
          <SliderInput
            label="Energy"
            value={form.energy}
            onChange={(v) => setForm({ ...form, energy: v })}
            color="#22c55e"
          />

          <Button onClick={() => setStep(2)} style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
            Continue →
          </Button>
        </div>
      )}

      {/* Step 2: Sleep */}
      {step === 2 && (
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>How did you sleep?</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '24px' }}>Hours of sleep last night.</p>

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '48px', fontWeight: '600', fontFamily: 'var(--font-geist-mono)', color: 'var(--text)' }}>
              {form.sleep}h
            </div>
            {form.sleep < 6 && <div style={{ fontSize: '12px', color: 'var(--warning)', marginTop: '4px' }}>⚠ Low sleep is a key trigger</div>}
            {form.sleep >= 7 && form.sleep <= 9 && <div style={{ fontSize: '12px', color: 'var(--success)', marginTop: '4px' }}>✓ Good sleep range</div>}
          </div>

          <input
            type="range"
            min={0}
            max={12}
            step={0.5}
            value={form.sleep}
            onChange={(e) => setForm({ ...form, sleep: Number(e.target.value) })}
            style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer', marginBottom: '20px' }}
          />

          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center' }}>← Back</Button>
            <Button onClick={() => setStep(3)} style={{ flex: 2, justifyContent: 'center' }}>Continue →</Button>
          </div>
        </div>
      )}

      {/* Step 3: Meds */}
      {step === 3 && (
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>Medication taken today?</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '24px' }}>No judgment — just tracking.</p>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button
              onClick={() => setForm({ ...form, medsTaken: true })}
              style={{
                flex: 1,
                padding: '20px',
                borderRadius: 'var(--radius)',
                border: `2px solid ${form.medsTaken === true ? 'var(--success)' : 'var(--border)'}`,
                background: form.medsTaken === true ? '#052e16' : 'var(--surface-2)',
                color: form.medsTaken === true ? 'var(--success)' : 'var(--text-2)',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'inherit',
              }}
            >
              ✓ Yes
            </button>
            <button
              onClick={() => setForm({ ...form, medsTaken: false })}
              style={{
                flex: 1,
                padding: '20px',
                borderRadius: 'var(--radius)',
                border: `2px solid ${form.medsTaken === false ? 'var(--danger)' : 'var(--border)'}`,
                background: form.medsTaken === false ? '#450a0a' : 'var(--surface-2)',
                color: form.medsTaken === false ? 'var(--danger)' : 'var(--text-2)',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'inherit',
              }}
            >
              ✗ No
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" onClick={() => setStep(2)} style={{ flex: 1, justifyContent: 'center' }}>← Back</Button>
            <Button
              onClick={() => setStep(4)}
              disabled={form.medsTaken === null}
              style={{ flex: 2, justifyContent: 'center' }}
            >
              Continue →
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Word + Note */}
      {step === 4 && (
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>One word for today</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '16px' }}>Pick one or type your own.</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {WORDS.map((w) => (
              <button
                key={w}
                onClick={() => setForm({ ...form, word: w })}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: `1px solid ${form.word === w ? 'var(--accent)' : 'var(--border)'}`,
                  background: form.word === w ? '#1e1b4b' : 'var(--surface-2)',
                  color: form.word === w ? 'var(--accent)' : 'var(--text-2)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  fontFamily: 'inherit',
                }}
              >
                {w}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Or type your own word..."
            value={WORDS.includes(form.word) ? '' : form.word}
            onChange={(e) => setForm({ ...form, word: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 14px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text)',
              fontSize: '14px',
              fontFamily: 'inherit',
              marginBottom: '12px',
              outline: 'none',
            }}
          />

          <textarea
            placeholder="Anything to add? (optional)"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            rows={3}
            style={{
              width: '100%',
              padding: '10px 14px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text)',
              fontSize: '14px',
              fontFamily: 'inherit',
              marginBottom: '16px',
              outline: 'none',
              resize: 'none',
            }}
          />

          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" onClick={() => setStep(3)} style={{ flex: 1, justifyContent: 'center' }}>← Back</Button>
            <Button
              onClick={handleSubmit}
              disabled={!form.word || loading}
              style={{ flex: 2, justifyContent: 'center' }}
            >
              {loading ? 'Saving...' : 'Save check-in ✓'}
            </Button>
          </div>
        </div>
      )}

      {/* Step 5: AI Reflection */}
      {step === 5 && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '28px', marginBottom: '16px' }}>✨</div>
          <div style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text)', marginBottom: '20px' }}>
            Check-in saved
          </div>
          {reflection && (
            <div
              style={{
                padding: '16px 20px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '15px',
                color: 'var(--text-2)',
                fontStyle: 'italic',
                lineHeight: '1.6',
                marginBottom: '24px',
              }}
            >
              "{reflection}"
            </div>
          )}
          <Button onClick={() => { router.push('/'); router.refresh() }} style={{ width: '100%', justifyContent: 'center' }}>
            Back to Dashboard
          </Button>
        </div>
      )}
    </Card>
  )
}
