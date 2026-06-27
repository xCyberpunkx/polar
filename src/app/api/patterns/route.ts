import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { calculatePatterns } from '@/lib/patterns'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const patterns = await calculatePatterns(userId)
  return NextResponse.json(patterns)
}
