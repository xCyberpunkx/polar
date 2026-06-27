import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { PageHeader, Card, Badge } from '@/components/ui'
import { EpisodeForm } from './EpisodeForm'
import { formatDate } from '@/lib/utils'

const episodeColors = {
  manic: 'warning',
  depressive: 'danger',
  mixed: 'insight',
  hypomanic: 'default',
} as const

export default async function EpisodesPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const episodes = await prisma.episode.findMany({
    where: { userId },
    orderBy: { startDate: 'desc' },
  })

  return (
    <div style={{ maxWidth: '680px' }}>
      <PageHeader
        title="Episode Memory"
        description="Document your episodes after they pass. This builds your personal episode history."
      />

      <EpisodeForm />

      {episodes.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Episode History ({episodes.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {episodes.map((ep) => (
              <Card key={ep.id}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Badge type={episodeColors[ep.type as keyof typeof episodeColors] || 'default'}>
                      {ep.type}
                    </Badge>
                    <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>
                      {formatDate(ep.startDate)}
                      {ep.endDate ? ` → ${formatDate(ep.endDate)}` : ' → ongoing'}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--font-geist-mono)', color: 'var(--text-3)' }}>
                    Severity {ep.severity}/10
                  </span>
                </div>
                {ep.trigger && (
                  <div style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-3)' }}>Trigger: </span>{ep.trigger}
                  </div>
                )}
                {ep.whatHelped && (
                  <div style={{ fontSize: '13px', color: 'var(--text-2)' }}>
                    <span style={{ color: 'var(--text-3)' }}>What helped: </span>{ep.whatHelped}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
