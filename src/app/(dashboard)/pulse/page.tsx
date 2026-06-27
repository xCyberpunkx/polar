import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { PulseForm } from '@/components/pulse/PulseForm'
import { PageHeader, Card, Badge } from '@/components/ui'
import { formatDate } from '@/lib/utils'

export default async function PulsePage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const todayStr = new Date().toISOString().split('T')[0]

  const todayCheckin = await prisma.checkin.findFirst({
    where: {
      userId,
      date: {
        gte: new Date(todayStr),
        lt: new Date(new Date(todayStr).getTime() + 86400000),
      },
    },
  })

  return (
    <div style={{ maxWidth: '560px' }}>
      <PageHeader
        title="Daily Pulse"
        description={formatDate(new Date())}
      />

      {todayCheckin ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>✓</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text)', marginBottom: '8px' }}>
              Already checked in today
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-2)', marginBottom: '16px' }}>
              Come back tomorrow. Consistency is everything.
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>MOOD</div>
                <div style={{ fontSize: '20px', fontWeight: '600', fontFamily: 'var(--font-geist-mono)', color: 'var(--accent)' }}>
                  {todayCheckin.mood}/10
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>ENERGY</div>
                <div style={{ fontSize: '20px', fontWeight: '600', fontFamily: 'var(--font-geist-mono)', color: '#22c55e' }}>
                  {todayCheckin.energy}/10
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>SLEEP</div>
                <div style={{ fontSize: '20px', fontWeight: '600', fontFamily: 'var(--font-geist-mono)', color: 'var(--text)' }}>
                  {todayCheckin.sleep}h
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>MEDS</div>
                <div style={{ fontSize: '20px', fontWeight: '600', fontFamily: 'var(--font-geist-mono)', color: todayCheckin.medsTaken ? '#22c55e' : '#ef4444' }}>
                  {todayCheckin.medsTaken ? 'Yes' : 'No'}
                </div>
              </div>
            </div>
            {todayCheckin.aiReflection && (
              <div
                style={{
                  marginTop: '20px',
                  padding: '14px 18px',
                  background: 'var(--surface-2)',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  fontSize: '14px',
                  color: 'var(--text-2)',
                  fontStyle: 'italic',
                }}
              >
                "{todayCheckin.aiReflection}"
              </div>
            )}
          </div>
        </Card>
      ) : (
        <PulseForm />
      )}
    </div>
  )
}
