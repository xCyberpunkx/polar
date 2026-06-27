import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { calculatePatterns } from '@/lib/patterns'
import { PageHeader, Card, Badge } from '@/components/ui'

export default async function PatternsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const patterns = await calculatePatterns(userId)

  const typeConfig = {
    warning: { label: 'Warning', badge: 'warning' as const, icon: '⚠' },
    insight: { label: 'Insight', badge: 'insight' as const, icon: '💡' },
    positive: { label: 'Positive', badge: 'success' as const, icon: '✓' },
  }

  return (
    <div style={{ maxWidth: '680px' }}>
      <PageHeader
        title="Patterns"
        description="Automatically detected from your check-in history. Updates monthly."
      />

      {patterns.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-3)' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📊</div>
            <div style={{ fontSize: '15px', marginBottom: '8px', color: 'var(--text-2)' }}>No patterns yet</div>
            <div style={{ fontSize: '13px' }}>You need at least 14 days of check-ins to detect patterns.</div>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {patterns.map((p) => {
            const config = typeConfig[p.type]
            return (
              <Card key={p.id}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px' }}>{config.icon}</span>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)' }}>{p.title}</span>
                  </div>
                  <Badge type={config.badge}>{config.label}</Badge>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: '1.6', marginBottom: '12px' }}>
                  {p.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>Confidence</span>
                  <div style={{ flex: 1, height: '3px', background: 'var(--border-2)', borderRadius: '2px' }}>
                    <div
                      style={{
                        width: `${p.confidence}%`,
                        height: '100%',
                        background: p.type === 'positive' ? 'var(--success)' : p.type === 'warning' ? 'var(--warning)' : 'var(--accent)',
                        borderRadius: '2px',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-3)', fontFamily: 'var(--font-geist-mono)' }}>{p.confidence}%</span>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
