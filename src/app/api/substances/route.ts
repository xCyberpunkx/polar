import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const logs = await prisma.substanceLog.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: 60,
  })
  return NextResponse.json(logs)
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { substance, date, amount, notes } = await req.json()
  const log = await prisma.substanceLog.create({
    data: { userId, substance, date: new Date(date), amount, notes },
  })
  return NextResponse.json(log)
}
