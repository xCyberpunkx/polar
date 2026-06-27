import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { AIChatClient } from './AIChatClient'

export default async function ChatPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const [checkins, medications] = await Promise.all([
    prisma.checkin.findMany({ where: { userId }, orderBy: { date: 'desc' }, take: 1 }),
    prisma.medication.findMany({ where: { userId, active: true } }),
  ])

  const hasData = checkins.length > 0

  return (
    <div style={{ height: 'calc(100vh - 72px)', display: 'flex', flexDirection: 'column', maxWidth: '780px' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px', flexShrink: 0 }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: '4px' }}>
          AI Companion
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-2)' }}>
          {hasData
            ? `I have access to your tracking data — ${checkins.length} check-in${checkins.length !== 1 ? 's' : ''}, ${medications.length} medication${medications.length !== 1 ? 's' : ''} logged.`
            : 'Start your daily pulse to give me context about how you\'re doing.'}
        </p>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '4px 10px', background: 'var(--success-dim)',
          border: '1px solid var(--success-dim)', borderRadius: '20px',
          fontSize: '11px', color: 'var(--success)', fontWeight: '600',
          marginTop: '8px',
        }}>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
          Powered by Gemini · Knows your history
        </div>
      </div>

      <AIChatClient hasData={hasData} />

      {/* Disclaimer */}
      <div style={{ flexShrink: 0, padding: '10px 0 0', fontSize: '11px', color: 'var(--text-3)', textAlign: 'center' }}>
        Not a therapist or doctor. For crisis support, visit{' '}
        <a href="/crisis" style={{ color: 'var(--danger)', textDecoration: 'none' }}>Crisis Resources</a>.
      </div>
    </div>
  )
}
