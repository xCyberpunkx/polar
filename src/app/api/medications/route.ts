import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const meds = await prisma.medication.findMany({ where: { userId, active: true }, orderBy: { createdAt: 'asc' } })
  return NextResponse.json(meds)
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name, dosage, frequency } = await req.json()
  const med = await prisma.medication.create({ data: { userId, name, dosage, frequency } })
  return NextResponse.json(med)
}
