import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { Card, Stat } from '@/components/ui'
import { calculateStabilityScore, getScoreColor, getScoreLabel } from '@/lib/utils'

export default async function CaregiverPage({ params }: { params: { token: string } }) {
  const user = await prisma.user.findUnique({ where: { caregiverToken: params.token } })
  if (!user) notFound()

  const checkins = await prisma.checkin.findMany({
    where: { userId: user.id },
    orderBy: { date: 'desc' },
    take: 7,
  })

  const score = calculateStabilityScore(checkins)
  const color = getScoreColor(score)
  const label = getScoreLabel(score)
  const lastCheckin = checkins[0]
  const medsAdherence = checkins.length ? Math.round((checkins.filter((c) => c.medsTaken).length / checkins.length) * 100) : 0

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '8px' }}>POLAR — CAREGIVER VIEW</div>
        <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text)' }}>Shared wellness summary</div>
        <div style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '4px' }}>Read-only · Last 7 days</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <Card>
          <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '8px', textTransform: 'uppercase' }}>Stability Score</div>
          <div style={{ fontSize: '36px', fontWeight: '700', color, fontFamily: 'var(--font-geist-mono)' }}>{score}</div>
          <div style={{ fontSize: '12px', color, marginTop: '4px' }}>{label}</div>
        </Card>
        <Stat label="Meds Adherence" value={`${medsAdherence}%`} sub="last 7 days" color={medsAdherence >= 80 ? 'var(--success)' : 'var(--warning)'} />
      </div>

      {lastCheckin && (
        <Card>
          <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '12px', textTransform: 'uppercase' }}>Last Check-in</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div><div style={{ fontSize: '11px', color: 'var(--text-3)' }}>MOOD</div><div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--accent)', fontFamily: 'var(--font-geist-mono)' }}>{lastCheckin.mood}/10</div></div>
            <div><div style={{ fontSize: '11px', color: 'var(--text-3)' }}>ENERGY</div><div style={{ fontSize: '20px', fontWeight: '600', color: '#22c55e', fontFamily: 'var(--font-geist-mono)' }}>{lastCheckin.energy}/10</div></div>
            <div><div style={{ fontSize: '11px', color: 'var(--text-3)' }}>SLEEP</div><div style={{ fontSize: '20px', fontWeight: '600', fontFamily: 'var(--font-geist-mono)' }}>{lastCheckin.sleep}h</div></div>
          </div>
        </Card>
      )}

      <div style={{ marginTop: '24px', fontSize: '12px', color: 'var(--text-3)', textAlign: 'center' }}>
        This page shows anonymized data shared by the user. No personal details are visible.
      </div>
    </div>
  )
}
