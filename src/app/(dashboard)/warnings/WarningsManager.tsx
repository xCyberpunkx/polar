'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Button } from '@/components/ui'

interface Warning { id: string; description: string; active: boolean }

const EXAMPLES = [
  "I start texting people at 2am",
  "I stop eating regular meals",
  "I make big plans I normally wouldn't",
  "I feel like I don't need sleep",
  "I spend money impulsively",
  "I feel everyone is against me",
  "I can't finish sentences in my head",
  "I isolate from everyone",
]

export function WarningsManager({ initialWarnings }: { initialWarnings: Warning[] }) {
  const router = useRouter()
  const [warnings, setWarnings] = useState(initialWarnings)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function addWarning(description: string) {
    if (!description.trim()) return
    setLoading(true)
    const res = await fetch('/api/warnings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description }),
    })
    const data = await res.json()
    setWarnings([...warnings, data])
    setInput('')
    setLoading(false)
  }

  async function deleteWarning(id: string) {
    await fetch(`/api/warnings/${id}`, { method: 'DELETE' })
    setWarnings(warnings.filter((w) => w.id !== id))
  }

  return (
    <div>
      {/* Existing warnings */}
      {warnings.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          {warnings.map((w) => (
            <div
              key={w.id}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'var(--warning)', fontSize: '14px' }}>⚠</span>
                <span style={{ fontSize: '14px', color: 'var(--text)' }}>{w.description}</span>
              </div>
              <button
                onClick={() => deleteWarning(w.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-3)',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: '4px',
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add custom */}
      <Card style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '12px' }}>Add your own warning sign</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="e.g. I start making big plans at midnight..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addWarning(input)}
            style={{
              flex: 1,
              padding: '9px 14px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text)',
              fontSize: '14px',
              fontFamily: 'inherit',
              outline: 'none',
            }}
          />
          <Button onClick={() => addWarning(input)} disabled={!input.trim() || loading}>
            Add
          </Button>
        </div>
      </Card>

      {/* Examples */}
      <div>
        <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Common examples — tap to add
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {EXAMPLES.filter((e) => !warnings.some((w) => w.description === e)).map((example) => (
            <button
              key={example}
              onClick={() => addWarning(example)}
              style={{
                textAlign: 'left',
                padding: '10px 14px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                color: 'var(--text-2)',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              + {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
