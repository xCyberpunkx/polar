import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateReflection(data: {
  mood: number
  energy: number
  sleep: number
  medsTaken: boolean
  word: string
  note?: string
}): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are a compassionate mental health companion for someone with bipolar disorder. 
    
Today's check-in data:
- Mood: ${data.mood}/10
- Energy: ${data.energy}/10  
- Sleep: ${data.sleep} hours
- Medication taken: ${data.medsTaken ? 'Yes' : 'No'}
- Word to describe today: "${data.word}"
${data.note ? `- Note: "${data.note}"` : ''}

Write ONE short, warm, non-clinical sentence (max 20 words) that acknowledges how they're feeling today. 
Do not give advice. Do not be dramatic. Just reflect back what you sense with care.
Never mention "bipolar". Never start with "I".`

    const result = await model.generateContent(prompt)
    return result.response.text().trim()
  } catch (error) {
    // Fallback if Gemini fails
    return `"${data.word}" — noted. Your check-in is saved.`
  }
}

export async function generatePatternSummary(patterns: string[]): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are a compassionate mental health data analyst. 
    
Based on these patterns detected in someone's bipolar disorder tracking data:
${patterns.map((p, i) => `${i + 1}. ${p}`).join('\n')}

Write 2-3 sentences in plain, warm language summarizing what these patterns mean for this person's wellbeing. 
Be honest but gentle. Focus on actionable awareness, not alarm.`

    const result = await model.generateContent(prompt)
    return result.response.text().trim()
  } catch (error) {
    return 'Your patterns have been analyzed. Review the cards below for detailed insights.'
  }
}
