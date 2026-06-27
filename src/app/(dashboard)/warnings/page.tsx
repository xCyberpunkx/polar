import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { PageHeader, Card, Badge } from '@/components/ui'
import { WarningsManager } from './WarningsManager'

export default async function WarningsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const warnings = await prisma.warning.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  })

  return (
    <div style={{ maxWidth: '600px' }}>
      <PageHeader
        title="Warning Signs"
        description="Define your personal early warning signs. During your stable periods, document what happens before an episode starts."
      />

      <Card style={{ marginBottom: '24px', borderColor: 'var(--border-2)' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: '1.7' }}>
          <strong style={{ color: 'var(--text)' }}>How this works:</strong> You define the signs you personally experience before an episode — things only you would notice. Every week, Polar asks if any of these are happening. If 3 or more are checked, you and your trusted contact get a gentle alert.
        </div>
      </Card>

      <WarningsManager initialWarnings={warnings} />
    </div>
  )
}
