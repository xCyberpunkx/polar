import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { PageHeader, Card, Stat } from '@/components/ui'
import { ReportGenerator } from './ReportGenerator'
import { calculateStabilityScore, getScoreLabel } from '@/lib/utils'
import { calculatePatterns } from '@/lib/patterns'

export default async function ReportPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const [checkins, episodes, medications, patterns] = await Promise.all([
    prisma.checkin.findMany({ where: { userId }, orderBy: { date: 'desc' }, take: 90 }),
    prisma.episode.findMany({ where: { userId }, orderBy: { startDate: 'desc' } }),
    prisma.medication.findMany({ where: { userId, active: true } }),
    calculatePatterns(userId),
  ])

  const last30 = checkins.slice(0, 30)
  const score = calculateStabilityScore(checkins)
  const avgMood = last30.length ? (last30.reduce((a, b) => a + b.mood, 0) / last30.length).toFixed(1) : '—'
  const avgSleep = last30.length ? (last30.reduce((a, b) => a + b.sleep, 0) / last30.length).toFixed(1) : '—'
  const medsAdherence = last30.length ? Math.round((last30.filter((c) => c.medsTaken).length / last30.length) * 100) : 0
  const totalDays = checkins.length

  const reportData = {
    generatedAt: new Date().toISOString(),
    stabilityScore: score,
    stabilityLabel: getScoreLabel(score),
    totalDaysTracked: totalDays,
    last30Days: {
      avgMood,
      avgSleep,
      medsAdherence,
      checkinsCount: last30.length,
    },
    episodes: episodes.map((e) => ({
      type: e.type,
      startDate: e.startDate.toISOString(),
      endDate: e.endDate?.toISOString(),
      severity: e.severity,
      trigger: e.trigger,
      whatHelped: e.whatHelped,
    })),
    medications: medications.map((m) => ({
      name: m.name,
      dosage: m.dosage,
      frequency: m.frequency,
    })),
    patterns: patterns.map((p) => ({
      title: p.title,
      description: p.description,
      type: p.type,
    })),
    moodHistory: checkins.slice(0, 30).reverse().map((c) => ({
      date: c.date.toISOString().split('T')[0],
      mood: c.mood,
      energy: c.energy,
      sleep: c.sleep,
      medsTaken: c.medsTaken,
      word: c.word,
    })),
  }

  return (
    <div style={{ maxWidth: '720px' }}>
      <PageHeader
        title="Psychiatrist Report"
        description="A complete summary of your tracked data. Share with your doctor at your next appointment."
      />

      {/* Preview stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        <Stat label="Days Tracked" value={totalDays} />
        <Stat label="Avg Mood" value={avgMood} sub="last 30 days" color="var(--accent)" />
        <Stat label="Avg Sleep" value={`${avgSleep}h`} sub="last 30 days" />
        <Stat label="Meds %" value={`${medsAdherence}%`} sub="last 30 days" color={medsAdherence >= 80 ? 'var(--success)' : 'var(--warning)'} />
      </div>

      <Card style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '16px', lineHeight: '1.7' }}>
          The report includes: stability score, medication adherence, mood & sleep averages, full mood history, episode log, detected patterns, and current medication list.
        </div>
        <ReportGenerator reportData={reportData} />
      </Card>

      {checkins.length < 7 && (
        <Card style={{ borderColor: 'var(--warning)' }}>
          <div style={{ fontSize: '13px', color: 'var(--warning)' }}>
            ⚠ You have less than 7 days of data. The report will be sparse. Keep checking in daily for more meaningful insights.
          </div>
        </Card>
      )}
    </div>
  )
}
