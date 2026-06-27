import { PageHeader, Card } from '@/components/ui'
import { WRAPBuilder } from './WRAPBuilder'
import Link from 'next/link'

export default function WRAPPage() {
  return (
    <div style={{ maxWidth: '720px' }}>
      <PageHeader
        title="Wellness Recovery Action Plan"
        description="Build your personal crisis plan when you are stable, so it exists when you need it most."
      />

      <Card style={{ marginBottom: '24px', borderColor: '#3730a3', background: 'linear-gradient(135deg, #1e1b4b 0%, #111 100%)' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: '1.8' }}>
          <strong style={{ color: 'var(--text)' }}>What is a WRAP?</strong> A Wellness Recovery Action Plan is a structured document developed by mental health advocate Mary Ellen Copeland with evidence for reducing hospitalizations. You build it when you are stable. It guides your care — and tells others how to help — when you cannot think clearly.{' '}
          <Link href="/learn/crisis-planning" style={{ color: 'var(--accent)' }}>Learn more →</Link>
        </div>
      </Card>

      <WRAPBuilder />
    </div>
  )
}
