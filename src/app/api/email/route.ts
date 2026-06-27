import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendMorningBrief, sendWeeklyDigest, getDailyTip } from '@/lib/email'
import { calculateStabilityScore, getScoreLabel } from '@/lib/utils'
import { calculatePatterns } from '@/lib/patterns'
import { clerkClient } from '@clerk/nextjs/server'

// This route is called by a cron job (Vercel Cron or external)
// Protect with a secret header
export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { type } = await req.json() // 'morning' | 'weekly'

  const users = await prisma.user.findMany({
    include: {
      checkins: { orderBy: { date: 'desc' }, take: 30 },
    },
  })

  const client = await clerkClient()
  let sent = 0
  let failed = 0

  for (const user of users) {
    try {
      const clerkUser = await client.users.getUser(user.id)
      const email = clerkUser.emailAddresses[0]?.emailAddress
      if (!email) continue

      const firstName = clerkUser.firstName || ''
      const checkins = user.checkins

      if (checkins.length === 0) continue

      const stabilityScore = calculateStabilityScore(checkins)

      if (type === 'morning') {
        // Streak calc
        let streak = 0
        const dates = checkins.map((c) => new Date(c.date).toISOString().split('T')[0]).sort().reverse()
        for (let i = 0; i < dates.length; i++) {
          const expected = new Date()
          expected.setDate(expected.getDate() - i)
          if (dates[i] === expected.toISOString().split('T')[0]) streak++
          else break
        }

        const avgMood = checkins.length
          ? (checkins.slice(0, 7).reduce((a, b) => a + b.mood, 0) / Math.min(checkins.length, 7)).toFixed(1)
          : '—'

        const yesterday = checkins[0]

        await sendMorningBrief({
          to: email,
          userName: firstName,
          stabilityScore,
          streak,
          avgMood,
          yesterday: yesterday ? { mood: yesterday.mood, word: yesterday.word } : undefined,
          tip: getDailyTip(),
        })
        sent++
      }

      if (type === 'weekly') {
        const week = checkins.slice(0, 7)
        const weekAvgMood = week.length
          ? (week.reduce((a, b) => a + b.mood, 0) / week.length).toFixed(1)
          : '—'
        const weekAvgSleep = week.length
          ? (week.reduce((a, b) => a + b.sleep, 0) / week.length).toFixed(1)
          : '—'
        const medsAdherence = week.length
          ? Math.round((week.filter((c) => c.medsTaken).length / week.length) * 100)
          : 0

        const patterns = await calculatePatterns(user.id)
        const topInsight = patterns[0]?.description

        await sendWeeklyDigest({
          to: email,
          userName: firstName,
          weekAvgMood,
          weekAvgSleep,
          medsAdherence,
          stabilityScore,
          patternsCount: patterns.length,
          topInsight,
        })
        sent++
      }
    } catch (err) {
      console.error(`Failed for user ${user.id}:`, err)
      failed++
    }
  }

  return NextResponse.json({ sent, failed, type })
}
