import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateReflection } from '@/lib/gemini'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { mood, energy, sleep, medsTaken, word, note } = body

  // Validate
  if (!mood || !energy || sleep === undefined || medsTaken === null || !word) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Check if already checked in today
  const existing = await prisma.checkin.findFirst({
    where: {
      userId,
      date: { gte: today, lt: new Date(today.getTime() + 86400000) },
    },
  })

  if (existing) {
    return NextResponse.json({ error: 'Already checked in today' }, { status: 409 })
  }

  // Generate AI reflection
  const aiReflection = await generateReflection({ mood, energy, sleep, medsTaken, word, note })

  const checkin = await prisma.checkin.create({
    data: {
      userId,
      date: today,
      mood,
      energy,
      sleep,
      medsTaken,
      word,
      note: note || null,
      aiReflection,
    },
  })

  return NextResponse.json({ ...checkin, aiReflection })
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const checkins = await prisma.checkin.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: 90,
  })

  return NextResponse.json(checkins)
}
