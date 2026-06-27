import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { messages } = await req.json()

  // Fetch user context
  const [checkins, medications, episodes, warnings] = await Promise.all([
    prisma.checkin.findMany({ where: { userId }, orderBy: { date: 'desc' }, take: 14 }),
    prisma.medication.findMany({ where: { userId, active: true } }),
    prisma.episode.findMany({ where: { userId }, orderBy: { startDate: 'desc' }, take: 5 }),
    prisma.warning.findMany({ where: { userId, active: true } }),
  ])

  const avgMood = checkins.length
    ? (checkins.reduce((a, b) => a + b.mood, 0) / checkins.length).toFixed(1)
    : null
  const avgSleep = checkins.length
    ? (checkins.reduce((a, b) => a + b.sleep, 0) / checkins.length).toFixed(1)
    : null
  const medsAdherence = checkins.length
    ? Math.round((checkins.filter(c => c.medsTaken).length / checkins.length) * 100)
    : null
  const recentWords = checkins.slice(0, 5).map(c => c.word).filter(Boolean)
  const lastCheckin = checkins[0]

  const systemPrompt = `You are Polar's AI companion — a knowledgeable, warm, and direct mental health support assistant for someone with bipolar disorder.

You are NOT a therapist. You are NOT a doctor. You are a well-informed companion who:
- Knows this person's actual data
- Gives honest, grounded responses
- Never minimizes or dramatizes
- Refers to crisis resources when appropriate
- Encourages professional care when needed

USER CONTEXT (real data from their tracking):
${checkins.length > 0 ? `
- Days tracked: ${checkins.length}
- 14-day average mood: ${avgMood}/10
- 14-day average sleep: ${avgSleep}h
- Medication adherence: ${medsAdherence}%
- Recent one-word check-ins: ${recentWords.join(', ')}
${lastCheckin ? `- Last check-in: Mood ${lastCheckin.mood}/10, Energy ${lastCheckin.energy}/10, Sleep ${lastCheckin.sleep}h, Meds ${lastCheckin.medsTaken ? 'taken' : 'missed'}, Word: "${lastCheckin.word}"` : ''}
` : '- No tracking data yet (new user)'}

${medications.length > 0 ? `CURRENT MEDICATIONS:\n${medications.map(m => `- ${m.name}${m.dosage ? ` (${m.dosage})` : ''}${m.frequency ? `, ${m.frequency}` : ''}`).join('\n')}` : 'No medications logged yet.'}

${episodes.length > 0 ? `RECENT EPISODES:\n${episodes.map(e => `- ${e.type} episode starting ${new Date(e.startDate).toLocaleDateString()}, severity ${e.severity}/10${e.trigger ? `, trigger: ${e.trigger}` : ''}`).join('\n')}` : 'No episodes logged yet.'}

${warnings.length > 0 ? `PERSONAL WARNING SIGNS:\n${warnings.map(w => `- ${w.description}`).join('\n')}` : 'No warning signs defined yet.'}

IMPORTANT RULES:
- If the user mentions suicidal thoughts, self-harm, or a crisis: ALWAYS provide the crisis line (Algeria: 3033, International: iasp.info/resources/Crisis_Centres) and encourage them to reach out immediately. Do not engage further with the topic.
- Speak as a knowledgeable friend, not a clinician
- Reference their actual data when relevant (e.g. "I notice your sleep has been averaging ${avgSleep}h lately")
- Keep responses focused and not too long — 2-4 paragraphs max unless they need detail
- Never diagnose, never recommend medication changes
- Respond in the same language the user writes in`

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Build history for Gemini multi-turn
    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }))

    const chat = model.startChat({
      history,
      systemInstruction: systemPrompt,
    })

    const lastMessage = messages[messages.length - 1].content
    const result = await chat.sendMessage(lastMessage)
    const text = result.response.text()

    return NextResponse.json({ reply: text })
  } catch (err) {
    console.error('Gemini error:', err)
    return NextResponse.json({ error: 'AI unavailable' }, { status: 500 })
  }
}
