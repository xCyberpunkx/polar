import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const episodes = await prisma.episode.findMany({
    where: { userId },
    orderBy: { startDate: 'desc' },
  })

  return NextResponse.json(episodes)
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { type, startDate, endDate, trigger, whatHelped, severity, notes } = body

  const episode = await prisma.episode.create({
    data: {
      userId,
      type,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      trigger,
      whatHelped,
      severity,
      notes,
    },
  })

  return NextResponse.json(episode)
}
