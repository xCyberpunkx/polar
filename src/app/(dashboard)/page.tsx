import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { calculateStabilityScore, getScoreColor, getScoreLabel, formatDate } from '@/lib/utils'
import { Card, Stat, PageHeader, Badge } from '@/components/ui'
import { MoodChart } from '@/components/charts/MoodChart'
import { StabilityRing } from '@/components/charts/StabilityRing'
import Link from 'next/link'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  // Ensure user exists in DB
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId },
  })

  const checkins = await prisma.checkin.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: 30,
  })

  const todayStr = new Date().toISOString().split('T')[0]
  const checkedInToday = checkins.some(
    (c) => new Date(c.date).toISOString().split('T')[0] === todayStr
  )

  const stabilityScore = calculateStabilityScore(checkins)
  const scoreColor = getScoreColor(stabilityScore)
  const scoreLabel = getScoreLabel(stabilityScore)

  // Streak calculation
  let streak = 0
  const sortedDates = checkins.map((c) => new Date(c.date).toISOString().split('T')[0]).sort().reverse()
  for (let i = 0; i < sortedDates.length; i++) {
    const expected = new Date()
    expected.setDate(expected.getDate() - i)
    const expectedStr = expected.toISOString().split('T')[0]
    if (sortedDates[i] === expectedStr) streak++
    else break
  }

  const recentCheckins = checkins.slice(0, 7)
  const avgMood = recentCheckins.length
    ? (recentCheckins.reduce((a, b) => a + b.mood, 0) / recentCheckins.length).toFixed(1)
    : '—'
  const avgSleep = recentCheckins.length
    ? (recentCheckins.reduce((a, b) => a + b.sleep, 0) / recentCheckins.length).toFixed(1)
    : '—'
  const medsAdherence = recentCheckins.length
    ? Math.round((recentCheckins.filter((c) => c.medsTaken).length / recentCheckins.length) * 100)
    : 0

  const chartData = [...checkins].reverse().slice(-30).map((c) => ({
    date: formatDate(c.date),
    mood: c.mood,
    energy: c.energy,
  }))

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`${formatDate(new Date())} · ${checkedInToday ? 'Check-in complete' : 'Daily check-in pending'}`}
      />

      {/* CTA if not checked in */}
      {!checkedInToday && (
        <Link href="/pulse" style={{ textDecoration: 'none' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #111111 100%)',
              border: '1px solid var(--accent)',
              borderRadius: 'var(--radius)',
              padding: '20px 24px',
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', marginBottom: '4px' }}>
                ⚡ Daily Pulse not recorded
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-2)' }}>
                60 seconds. Keep your streak alive.
              </div>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: '500' }}>
              Check in →
            </div>
          </div>
        </Link>
      )}

      {/* Top stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <Card style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <StabilityRing score={stabilityScore} color={scoreColor} size={60} />
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Stability
            </div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: scoreColor, fontFamily: 'var(--font-geist-mono)' }}>
              {stabilityScore}
            </div>
            <Badge type={stabilityScore >= 75 ? 'success' : stabilityScore >= 50 ? 'insight' : 'warning'}>
              {scoreLabel}
            </Badge>
          </div>
        </Card>

        <Stat label="7-Day Avg Mood" value={avgMood} sub="out of 10" color="var(--accent)" />
        <Stat label="Avg Sleep" value={`${avgSleep}h`} sub="last 7 days" />
        <Stat
          label="Streak"
          value={streak}
          sub={streak === 1 ? 'day' : 'days in a row'}
          color={streak >= 7 ? 'var(--success)' : 'var(--text)'}
        />
      </div>

      {/* Meds adherence */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <Card>
          <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Medication Adherence (7 days)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                flex: 1,
                height: '6px',
                background: 'var(--border-2)',
                borderRadius: '3px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${medsAdherence}%`,
                  height: '100%',
                  background: medsAdherence >= 80 ? 'var(--success)' : medsAdherence >= 50 ? 'var(--warning)' : 'var(--danger)',
                  borderRadius: '3px',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
            <span style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'var(--font-geist-mono)', color: 'var(--text)', minWidth: '40px' }}>
              {medsAdherence}%
            </span>
          </div>
          {medsAdherence < 80 && (
            <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '8px' }}>
              Consistency with medication is strongly linked to mood stability.
            </div>
          )}
        </Card>

        <Card>
          <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quick Actions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/episodes" style={{ textDecoration: 'none', fontSize: '13px', color: 'var(--text-2)', padding: '8px 12px', background: 'var(--surface-2)', borderRadius: '6px', border: '1px solid var(--border)' }}>
              📓 Log an episode
            </Link>
            <Link href="/patterns" style={{ textDecoration: 'none', fontSize: '13px', color: 'var(--text-2)', padding: '8px 12px', background: 'var(--surface-2)', borderRadius: '6px', border: '1px solid var(--border)' }}>
              💡 View my patterns
            </Link>
            <Link href="/report" style={{ textDecoration: 'none', fontSize: '13px', color: 'var(--text-2)', padding: '8px 12px', background: 'var(--surface-2)', borderRadius: '6px', border: '1px solid var(--border)' }}>
              📄 Generate report
            </Link>
          </div>
        </Card>
      </div>

      {/* Mood chart */}
      <Card>
        <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Mood & Energy — Last 30 Days
        </div>
        {chartData.length > 0 ? (
          <MoodChart data={chartData} />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-3)', fontSize: '14px' }}>
            Start your daily check-in to see your mood chart.
          </div>
        )}
      </Card>
    </div>
  )
}
