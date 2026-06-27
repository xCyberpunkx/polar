import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function calculateStabilityScore(checkins: {
  mood: number
  energy: number
  sleep: number
  medsTaken: boolean
}[]): number {
  if (!checkins.length) return 0

  const recent = checkins.slice(0, 7)

  // Mood variance (lower variance = more stable)
  const moods = recent.map((c) => c.mood)
  const moodAvg = moods.reduce((a, b) => a + b, 0) / moods.length
  const moodVariance = moods.reduce((a, b) => a + Math.pow(b - moodAvg, 2), 0) / moods.length
  const moodScore = Math.max(0, 100 - moodVariance * 8)

  // Sleep score (7-9h is ideal)
  const sleepAvg = recent.reduce((a, b) => a + b.sleep, 0) / recent.length
  const sleepScore = sleepAvg >= 6 && sleepAvg <= 9 ? 100 : sleepAvg < 5 ? 30 : 65

  // Meds adherence
  const medsScore = (recent.filter((c) => c.medsTaken).length / recent.length) * 100

  // Energy variance
  const energies = recent.map((c) => c.energy)
  const energyAvg = energies.reduce((a, b) => a + b, 0) / energies.length
  const energyVariance = energies.reduce((a, b) => a + Math.pow(b - energyAvg, 2), 0) / energies.length
  const energyScore = Math.max(0, 100 - energyVariance * 8)

  return Math.round(moodScore * 0.35 + sleepScore * 0.25 + medsScore * 0.25 + energyScore * 0.15)
}

export function getScoreColor(score: number): string {
  if (score >= 75) return '#22c55e'
  if (score >= 50) return '#f59e0b'
  if (score >= 25) return '#ef4444'
  return '#7f1d1d'
}

export function getScoreLabel(score: number): string {
  if (score >= 75) return 'Stable'
  if (score >= 50) return 'Moderate'
  if (score >= 25) return 'Unstable'
  return 'Critical'
}
