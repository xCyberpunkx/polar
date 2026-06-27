import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { calculateStabilityScore, getScoreColor, getScoreLabel, formatDate } from '@/lib/utils'
import { Card, Stat, Badge, EmptyState } from '@/components/ui'
import { MoodChart } from '@/components/charts/MoodChart'
import { StabilityRing } from '@/components/charts/StabilityRing'
import Link from 'next/link'
import { clerkClient } from '@clerk/nextjs/server'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  await prisma.user.upsert({ where: { id: userId }, update: {}, create: { id: userId } })

  const [checkins, medications, episodes, warnings] = await Promise.all([
    prisma.checkin.findMany({ where: { userId }, orderBy: { date: 'desc' }, take: 30 }),
    prisma.medication.findMany({ where: { userId, active: true } }),
    prisma.episode.findMany({ where: { userId }, orderBy: { startDate: 'desc' }, take: 3 }),
    prisma.warning.findMany({ where: { userId, active: true } }),
  ])

  const client = await clerkClient()
  const clerkUser = await client.users.getUser(userId)
  const firstName = clerkUser.firstName || 'there'

  const todayStr = new Date().toISOString().split('T')[0]
  const checkedInToday = checkins.some(c => new Date(c.date).toISOString().split('T')[0] === todayStr)
  const todayCheckin = checkins.find(c => new Date(c.date).toISOString().split('T')[0] === todayStr)

  const stabilityScore = calculateStabilityScore(checkins)
  const scoreColor = getScoreColor(stabilityScore)
  const scoreLabel = getScoreLabel(stabilityScore)

  let streak = 0
  const sortedDates = checkins.map(c => new Date(c.date).toISOString().split('T')[0]).sort().reverse()
  for (let i = 0; i < sortedDates.length; i++) {
    const exp = new Date(); exp.setDate(exp.getDate() - i)
    if (sortedDates[i] === exp.toISOString().split('T')[0]) streak++
    else break
  }

  const recent7 = checkins.slice(0, 7)
  const avgMood = recent7.length ? (recent7.reduce((a, b) => a + b.mood, 0) / recent7.length).toFixed(1) : '—'
  const avgSleep = recent7.length ? (recent7.reduce((a, b) => a + b.sleep, 0) / recent7.length).toFixed(1) : '—'
  const medsAdherence = recent7.length ? Math.round((recent7.filter(c => c.medsTaken).length / recent7.length) * 100) : 0

  const chartData = [...checkins].reverse().map(c => ({
    date: formatDate(c.date), mood: c.mood, energy: c.energy,
  }))

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{ maxWidth: '1100px' }}>

      {/* Greeting header */}
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            {greeting}, {firstName}.
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-2)' }}>
            {formatDate(new Date())} · {checkedInToday ? 'Daily pulse recorded' : 'Daily pulse pending'}
          </p>
        </div>
        {!checkedInToday && (
          <Link href="/pulse" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '10px 18px', background: 'var(--accent)', borderRadius: 'var(--radius-sm)',
              fontSize: '14px', fontWeight: '600', color: 'white', whiteSpace: 'nowrap',
            }}>
              Record pulse →
            </div>
          </Link>
        )}
      </div>

      {/* Today's check-in card (if done) */}
      {todayCheckin && (
        <Card style={{ marginBottom: '20px', background: 'var(--accent-dim)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                Today's Pulse
              </div>
              {todayCheckin.aiReflection && (
                <div style={{ fontSize: '15px', color: 'var(--text)', fontStyle: 'italic', maxWidth: '500px' }}>
                  "{todayCheckin.aiReflection}"
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              {[
                { label: 'Mood', value: `${todayCheckin.mood}/10`, color: 'var(--accent)' },
                { label: 'Energy', value: `${todayCheckin.energy}/10`, color: 'var(--success)' },
                { label: 'Sleep', value: `${todayCheckin.sleep}h`, color: 'var(--text)' },
                { label: 'Meds', value: todayCheckin.medsTaken ? 'Taken' : 'Missed', color: todayCheckin.medsTaken ? 'var(--success)' : 'var(--danger)' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>{label}</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color, fontFamily: 'var(--font-geist-mono)' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
        <Card style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <StabilityRing score={stabilityScore} color={scoreColor} size={56} />
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Stability</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: scoreColor, fontFamily: 'var(--font-geist-mono)', lineHeight: 1 }}>{stabilityScore}</div>
            <Badge type={stabilityScore >= 75 ? 'success' : stabilityScore >= 50 ? 'insight' : 'warning'}>{scoreLabel}</Badge>
          </div>
        </Card>
        <Stat label="Avg Mood" value={avgMood} sub="7-day average" color="var(--accent)" />
        <Stat label="Avg Sleep" value={`${avgSleep}h`} sub="7-day average" />
        <Stat label="Streak" value={streak} sub={streak === 1 ? 'day' : 'days in a row'} color={streak >= 7 ? 'var(--success)' : 'var(--text)'} />
      </div>

      {/* Main content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px', marginBottom: '16px' }}>

        {/* Mood chart */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)' }}>Mood & Energy</div>
            <div style={{ display: 'flex', gap: '16px' }}>
              {[{ color: 'var(--accent)', label: 'Mood' }, { color: 'var(--success)', label: 'Energy' }].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-3)' }}>
                  <div style={{ width: '20px', height: '2px', background: color, borderRadius: '1px' }} />
                  {label}
                </div>
              ))}
            </div>
          </div>
          {chartData.length > 0 ? (
            <MoodChart data={chartData} />
          ) : (
            <EmptyState
              title="No data yet"
              description="Record your first daily pulse to start seeing your mood chart."
            />
          )}
        </Card>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Meds adherence */}
          <Card>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)', marginBottom: '14px' }}>
              Medication Adherence
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{ flex: 1, height: '6px', background: 'var(--border-2)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  width: `${medsAdherence}%`, height: '100%', borderRadius: '3px',
                  background: medsAdherence >= 80 ? 'var(--success)' : medsAdherence >= 50 ? 'var(--warning)' : 'var(--danger)',
                  transition: 'width 0.5s ease',
                }} />
              </div>
              <span style={{ fontSize: '15px', fontWeight: '700', fontFamily: 'var(--font-geist-mono)', color: 'var(--text)', minWidth: '44px' }}>
                {medsAdherence}%
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Last 7 days</div>

            {/* Medication list */}
            {medications.length > 0 && (
              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                  Current Medications
                </div>
                {medications.map(m => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text)' }}>{m.name}</span>
                    {m.dosage && <span style={{ fontSize: '12px', color: 'var(--text-3)', fontFamily: 'var(--font-geist-mono)' }}>{m.dosage}</span>}
                  </div>
                ))}
                <Link href="/settings" style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none', display: 'block', marginTop: '8px' }}>
                  Manage medications →
                </Link>
              </div>
            )}
            {medications.length === 0 && (
              <div style={{ marginTop: '12px' }}>
                <Link href="/settings" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none' }}>
                  + Add your medications
                </Link>
              </div>
            )}
          </Card>

          {/* Recent episodes */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)' }}>Recent Episodes</div>
              <Link href="/episodes" style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>View all</Link>
            </div>
            {episodes.length === 0 ? (
              <div style={{ fontSize: '13px', color: 'var(--text-3)', padding: '8px 0' }}>
                No episodes logged yet.{' '}
                <Link href="/episodes" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Log one →</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {episodes.map(ep => (
                  <div key={ep.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{
                        fontSize: '12px', fontWeight: '600', textTransform: 'capitalize',
                        color: ep.type === 'manic' || ep.type === 'hypomanic' ? 'var(--warning)' : 'var(--accent)',
                      }}>{ep.type}</span>
                      {ep.trigger && <span style={{ fontSize: '12px', color: 'var(--text-3)', marginLeft: '6px' }}>· {ep.trigger.slice(0, 20)}</span>}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--font-geist-mono)' }}>
                      {formatDate(ep.startDate)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Warning signs status */}
          {warnings.length > 0 && (
            <Card style={{ border: '1px solid var(--warning-dim)', background: 'var(--warning-dim)' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--warning)', marginBottom: '8px' }}>
                {warnings.length} Warning Sign{warnings.length > 1 ? 's' : ''} Defined
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '10px' }}>
                You have personal warning signs set up. Polar checks these weekly.
              </div>
              <Link href="/warnings" style={{ fontSize: '12px', color: 'var(--warning)', textDecoration: 'none', fontWeight: '500' }}>
                Review warning signs →
              </Link>
            </Card>
          )}
        </div>
      </div>

      {/* Onboarding checklist for new users */}
      {checkins.length === 0 && (
        <Card style={{ border: '1px solid var(--border-2)' }}>
          <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text)', marginBottom: '4px' }}>Get started with Polar</div>
          <div style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '20px' }}>Complete these steps to get the most out of the platform.</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Record your first daily pulse', href: '/pulse', done: checkedInToday },
              { label: 'Add your medications', href: '/settings', done: medications.length > 0 },
              { label: 'Define your personal warning signs', href: '/warnings', done: warnings.length > 0 },
              { label: 'Build your crisis plan (WRAP)', href: '/wrap', done: false },
              { label: 'Read about bipolar disorder', href: '/learn', done: false },
            ].map(({ label, href, done }) => (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                  background: done ? 'var(--success-dim)' : 'var(--surface-2)',
                  border: `1px solid ${done ? 'var(--success-dim)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-sm)', transition: 'all 0.15s',
                }}>
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                    background: done ? 'var(--success)' : 'var(--border-2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {done && <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>✓</span>}
                  </div>
                  <span style={{ fontSize: '14px', color: done ? 'var(--success)' : 'var(--text)', fontWeight: '500' }}>
                    {label}
                  </span>
                  {!done && <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-3)' }}>→</span>}
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
