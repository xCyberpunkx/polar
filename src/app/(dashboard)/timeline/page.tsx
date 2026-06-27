import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { PageHeader, Card } from '@/components/ui'
import { TimelineChart } from '@/components/charts/TimelineChart'
import { formatDate } from '@/lib/utils'

export default async function TimelinePage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const checkins = await prisma.checkin.findMany({
    where: { userId },
    orderBy: { date: 'asc' },
  })

  const chartData = checkins.map((c) => ({
    date: formatDate(c.date),
    mood: c.mood,
    energy: c.energy,
    sleep: c.sleep,
    medsTaken: c.medsTaken,
    word: c.word,
  }))

  return (
    <div>
      <PageHeader
        title="Timeline"
        description={`${checkins.length} days of data recorded`}
      />

      {checkins.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-3)', fontSize: '14px' }}>
            No check-ins yet. Start your daily pulse to see your timeline.
          </div>
        </Card>
      ) : (
        <>
          <Card style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Mood Waveform — All Time
            </div>
            <TimelineChart data={chartData} />
          </Card>

          {/* Legend */}
          <Card>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {[
                { color: '#6366f1', label: 'Mood' },
                { color: '#22c55e', label: 'Energy' },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '24px', height: '2px', background: color }} />
                  <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>{label}</span>
                </div>
              ))}
              <div style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--text-3)' }}>
                Hover for details
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
