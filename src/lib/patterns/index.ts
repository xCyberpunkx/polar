import { prisma } from '@/lib/db'

export interface PatternCard {
  id: string
  type: 'warning' | 'insight' | 'positive'
  title: string
  description: string
  confidence: number // 0-100
}

export async function calculatePatterns(userId: string): Promise<PatternCard[]> {
  const checkins = await prisma.checkin.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: 90,
  })

  if (checkins.length < 14) return []

  const patterns: PatternCard[] = []

  // Pattern 1: Sleep < 6h preceding mood drop
  const sleepMoodPattern = detectSleepMoodPattern(checkins)
  if (sleepMoodPattern) patterns.push(sleepMoodPattern)

  // Pattern 2: High energy spike before low
  const energySpikePattern = detectEnergySpike(checkins)
  if (energySpikePattern) patterns.push(energySpikePattern)

  // Pattern 3: Meds adherence vs mood correlation
  const medsPattern = detectMedsPattern(checkins)
  if (medsPattern) patterns.push(medsPattern)

  // Pattern 4: Weekend mood shift
  const weekendPattern = detectWeekendPattern(checkins)
  if (weekendPattern) patterns.push(weekendPattern)

  // Pattern 5: Streak of low mood
  const lowMoodStreak = detectLowMoodStreak(checkins)
  if (lowMoodStreak) patterns.push(lowMoodStreak)

  return patterns
}

function detectSleepMoodPattern(checkins: any[]): PatternCard | null {
  let matches = 0
  let total = 0

  for (let i = 0; i < checkins.length - 4; i++) {
    const window = checkins.slice(i, i + 3)
    const lowSleep = window.every((c) => c.sleep < 6)
    if (lowSleep) {
      total++
      const dayAfter = checkins[i + 3]
      if (dayAfter && dayAfter.mood < 4) matches++
    }
  }

  if (total < 2) return null
  const confidence = Math.round((matches / total) * 100)
  if (confidence < 60) return null

  return {
    id: 'sleep-mood',
    type: 'warning',
    title: 'Sleep loss predicts mood drops',
    description: `${confidence}% of the time, when you sleep less than 6 hours for 3+ days, your mood drops below 4 within days.`,
    confidence,
  }
}

function detectEnergySpike(checkins: any[]): PatternCard | null {
  let matches = 0
  let total = 0

  for (let i = 0; i < checkins.length - 5; i++) {
    const highEnergy = checkins[i].energy >= 8 && checkins[i + 1].energy >= 8
    if (highEnergy) {
      total++
      const following = checkins.slice(i + 2, i + 6)
      if (following.some((c) => c.mood <= 4)) matches++
    }
  }

  if (total < 2) return null
  const confidence = Math.round((matches / total) * 100)
  if (confidence < 55) return null

  return {
    id: 'energy-spike',
    type: 'warning',
    title: 'High energy spikes precede lows',
    description: `${confidence}% of your sustained high-energy periods (8+/10 for 2+ days) are followed by a mood low within 4 days.`,
    confidence,
  }
}

function detectMedsPattern(checkins: any[]): PatternCard | null {
  const withMeds = checkins.filter((c) => c.medsTaken)
  const withoutMeds = checkins.filter((c) => !c.medsTaken)

  if (withMeds.length < 5 || withoutMeds.length < 3) return null

  const moodWithMeds = withMeds.reduce((a, b) => a + b.mood, 0) / withMeds.length
  const moodWithoutMeds = withoutMeds.reduce((a, b) => a + b.mood, 0) / withoutMeds.length
  const diff = Math.round(((moodWithMeds - moodWithoutMeds) / 10) * 100)

  if (Math.abs(diff) < 15) return null

  if (diff > 0) {
    return {
      id: 'meds-positive',
      type: 'positive',
      title: 'Medication is working for you',
      description: `Your average mood is ${diff}% higher on days you take your medication. The data is clear.`,
      confidence: Math.min(95, 60 + diff),
    }
  } else {
    return {
      id: 'meds-negative',
      type: 'insight',
      title: 'Medication timing worth reviewing',
      description: `Your mood data shows some correlation with medication days worth discussing with your psychiatrist.`,
      confidence: 70,
    }
  }
}

function detectWeekendPattern(checkins: any[]): PatternCard | null {
  const weekdays = checkins.filter((c) => {
    const day = new Date(c.date).getDay()
    return day >= 1 && day <= 5
  })
  const weekends = checkins.filter((c) => {
    const day = new Date(c.date).getDay()
    return day === 0 || day === 6
  })

  if (weekdays.length < 10 || weekends.length < 4) return null

  const weekdayMood = weekdays.reduce((a, b) => a + b.mood, 0) / weekdays.length
  const weekendMood = weekends.reduce((a, b) => a + b.mood, 0) / weekends.length
  const diff = weekendMood - weekdayMood

  if (Math.abs(diff) < 1.5) return null

  return {
    id: 'weekend-pattern',
    type: diff > 0 ? 'positive' : 'insight',
    title: diff > 0 ? 'Weekends lift your mood' : 'Weekdays are harder for you',
    description: `Your average mood is ${Math.abs(diff).toFixed(1)} points ${diff > 0 ? 'higher' : 'lower'} on ${diff > 0 ? 'weekends' : 'weekdays'}.`,
    confidence: 75,
  }
}

function detectLowMoodStreak(checkins: any[]): PatternCard | null {
  let currentStreak = 0
  let maxStreak = 0

  for (const checkin of checkins) {
    if (checkin.mood <= 4) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 0
    }
  }

  if (maxStreak < 4) return null

  return {
    id: 'low-streak',
    type: 'warning',
    title: 'Extended low mood periods detected',
    description: `Your longest recorded low mood streak (4 or below) is ${maxStreak} consecutive days. Consider flagging this to your psychiatrist.`,
    confidence: 90,
  }
}
