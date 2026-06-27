import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { randomBytes } from 'crypto'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { medications: { where: { active: true } } },
  })

  return NextResponse.json(user)
}

export async function PATCH(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  if (body.generateCaregiverToken) {
    const token = randomBytes(16).toString('hex')
    const user = await prisma.user.update({
      where: { id: userId },
      data: { caregiverToken: token },
    })
    return NextResponse.json(user)
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { timezone: body.timezone },
  })

  return NextResponse.json(user)
}
