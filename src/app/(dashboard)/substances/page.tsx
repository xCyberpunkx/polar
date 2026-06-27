import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { PageHeader, Card, Badge } from '@/components/ui'
import { SubstanceForm } from './SubstanceForm'
import { formatDate } from '@/lib/utils'

export default async function SubstancesPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const logs = await prisma.substanceLog.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: 60,
  })

  // Build correlation: mood avg 3 days after substance use
  const checkins = await prisma.checkin.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: 90,
  })

  // Group logs by substance for summary
  const bySubstance = logs.reduce((acc: Record<string, number>, log) => {
    acc[log.substance] = (acc[log.substance] || 0) + 1
    return acc
  }, {})

  return (
    <div style={{ maxWidth: '680px' }}>
      <PageHeader
        title="Substance Log"
        description="Private, non-judgmental tracking. Understanding patterns is the goal."
      />

      <Card style={{ marginBottom: '24px', borderColor: 'var(--border-2)' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: '1.7' }}>
          <strong style={{ color: 'var(--text)' }}>Why track this:</strong> Substances interact with mood disorders and medications in ways that are hard to see in the moment. Over time, Polar correlates your logs with your mood data to show you the actual impact — not a lecture.
        </div>
      </Card>

      <SubstanceForm />

      {/* Summary */}
      {Object.keys(bySubstance).length > 0 && (
        <div style={{ marginTop: '32px', marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Summary
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {Object.entries(bySubstance).map(([substance, count]) => (
              <div
                key={substance}
                style={{
                  padding: '8px 14px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px',
                }}
              >
                <span style={{ color: 'var(--text)' }}>{substance}</span>
                <span style={{ color: 'var(--text-3)', fontFamily: 'var(--font-geist-mono)', marginLeft: '8px' }}>×{count as number}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Log */}
      {logs.length > 0 && (
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Log ({logs.length} entries)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {logs.map((log) => (
              <div
                key={log.id}
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
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--text)', fontWeight: '500' }}>{log.substance}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>
                    {[log.amount, log.notes].filter(Boolean).join(' · ')}
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)', fontFamily: 'var(--font-geist-mono)' }}>
                  {formatDate(log.date)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
