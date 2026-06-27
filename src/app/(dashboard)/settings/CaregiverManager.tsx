'use client'

import { useState } from 'react'
import { Card, Button } from '@/components/ui'

export function CaregiverManager({ token }: { token: string | null }) {
  const [currentToken, setCurrentToken] = useState(token)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const caregiverUrl = currentToken
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/caregiver/${currentToken}`
    : null

  async function generateToken() {
    setLoading(true)
    const res = await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ generateCaregiverToken: true }),
    })
    const data = await res.json()
    setCurrentToken(data.caregiverToken)
    setLoading(false)
  }

  async function copyLink() {
    if (!caregiverUrl) return
    await navigator.clipboard.writeText(caregiverUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      {currentToken ? (
        <div>
          <div style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '12px' }}>
            Share this link with a trusted person. They will see your stability score, medication adherence, and last check-in — nothing else.
          </div>
          <div
            style={{
              padding: '10px 14px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: '12px',
              color: 'var(--text-3)',
              fontFamily: 'var(--font-geist-mono)',
              wordBreak: 'break-all',
              marginBottom: '12px',
            }}
          >
            {caregiverUrl}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button onClick={copyLink} style={{ flex: 1, justifyContent: 'center' }}>
              {copied ? '✓ Copied!' : 'Copy link'}
            </Button>
            <Button variant="danger" onClick={generateToken} disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
              Regenerate
            </Button>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '10px' }}>
            Regenerating the link will invalidate the old one.
          </div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '16px' }}>
            No caregiver link generated yet. Create one to share a read-only view of your wellness data.
          </div>
          <Button onClick={generateToken} disabled={loading}>
            {loading ? 'Generating...' : 'Generate caregiver link'}
          </Button>
        </div>
      )}
    </Card>
  )
}
