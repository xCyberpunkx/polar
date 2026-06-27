import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const warnings = await prisma.warning.findMany({ where: { userId } })
  return NextResponse.json(warnings)
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { description } = await req.json()
  const warning = await prisma.warning.create({ data: { userId, description } })
  return NextResponse.json(warning)
}
