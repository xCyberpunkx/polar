import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface MorningBriefData {
  to: string
  userName: string
  stabilityScore: number
  streak: number
  avgMood: string
  yesterday?: { mood: number; word: string }
  tip: string
}

interface WeeklyDigestData {
  to: string
  userName: string
  weekAvgMood: string
  weekAvgSleep: string
  medsAdherence: number
  stabilityScore: number
  patternsCount: number
  topInsight?: string
}

export async function sendMorningBrief(data: MorningBriefData) {
  const scoreColor = data.stabilityScore >= 75 ? '#22c55e' : data.stabilityScore >= 50 ? '#f59e0b' : '#ef4444'
  const scoreLabel = data.stabilityScore >= 75 ? 'Stable' : data.stabilityScore >= 50 ? 'Moderate' : 'Unstable'

  await resend.emails.send({
    from: 'Polar <morning@polarapp.health>',
    to: data.to,
    subject: `☀ Good morning, ${data.userName} · Stability: ${data.stabilityScore}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="background:#0a0a0a;color:#ededed;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin:0;padding:0;">
  <div style="max-width:520px;margin:0 auto;padding:32px 24px;">
    
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px;">
      <div style="width:24px;height:24px;border-radius:5px;background:#6366f1;display:flex;align-items:center;justify-content:center;">
        <span style="color:white;font-size:12px;font-weight:700;">P</span>
      </div>
      <span style="font-size:14px;color:#888;">Polar</span>
    </div>

    <h1 style="font-size:20px;font-weight:600;margin:0 0 8px;color:#ededed;">
      Good morning${data.userName ? `, ${data.userName}` : ''}.
    </h1>
    <p style="font-size:14px;color:#888;margin:0 0 28px;">Here's your daily brief.</p>

    <!-- Stability score -->
    <div style="background:#111;border:1px solid #1f1f1f;border-radius:8px;padding:20px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;">
      <div>
        <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Stability Score</div>
        <div style="font-size:36px;font-weight:700;color:${scoreColor};font-family:monospace;">${data.stabilityScore}</div>
        <div style="font-size:12px;color:${scoreColor};margin-top:2px;">${scoreLabel}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Streak</div>
        <div style="font-size:28px;font-weight:700;color:#ededed;font-family:monospace;">${data.streak}</div>
        <div style="font-size:12px;color:#888;">days</div>
      </div>
    </div>

    ${data.yesterday ? `
    <!-- Yesterday -->
    <div style="background:#111;border:1px solid #1f1f1f;border-radius:8px;padding:16px;margin-bottom:16px;">
      <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:10px;">Yesterday</div>
      <div style="display:flex;gap:16px;align-items:center;">
        <div><div style="font-size:10px;color:#555;">MOOD</div><div style="font-size:20px;font-weight:600;color:#6366f1;font-family:monospace;">${data.yesterday.mood}/10</div></div>
        <div style="flex:1;font-size:14px;color:#888;font-style:italic;">"${data.yesterday.word}"</div>
      </div>
    </div>
    ` : `
    <div style="background:#111;border:1px solid #1f1f1f;border-radius:8px;padding:16px;margin-bottom:16px;text-align:center;">
      <div style="font-size:13px;color:#888;">No check-in yesterday.</div>
    </div>
    `}

    <!-- Today's tip -->
    <div style="background:#1e1b4b44;border:1px solid #3730a3;border-radius:8px;padding:16px;margin-bottom:28px;">
      <div style="font-size:11px;color:#818cf8;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">Today's focus</div>
      <div style="font-size:14px;color:#c7d2fe;line-height:1.6;">${data.tip}</div>
    </div>

    <!-- CTA -->
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/pulse" style="display:block;background:#6366f1;color:white;text-align:center;padding:12px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500;margin-bottom:32px;">
      Record today's pulse →
    </a>

    <div style="font-size:11px;color:#333;text-align:center;">
      Polar · <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color:#444;">Manage email preferences</a>
    </div>
  </div>
</body>
</html>`,
  })
}

export async function sendWeeklyDigest(data: WeeklyDigestData) {
  const scoreColor = data.stabilityScore >= 75 ? '#22c55e' : data.stabilityScore >= 50 ? '#f59e0b' : '#ef4444'

  await resend.emails.send({
    from: 'Polar <weekly@polarapp.health>',
    to: data.to,
    subject: `📊 Your week in numbers · Polar Weekly`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="background:#0a0a0a;color:#ededed;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin:0;padding:0;">
  <div style="max-width:520px;margin:0 auto;padding:32px 24px;">

    <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px;">
      <div style="width:24px;height:24px;border-radius:5px;background:#6366f1;display:flex;align-items:center;justify-content:center;">
        <span style="color:white;font-size:12px;font-weight:700;">P</span>
      </div>
      <span style="font-size:14px;color:#888;">Polar · Weekly Digest</span>
    </div>

    <h1 style="font-size:20px;font-weight:600;margin:0 0 8px;">Your week in numbers.</h1>
    <p style="font-size:14px;color:#888;margin:0 0 28px;">Here's what your data showed this week.</p>

    <!-- Stats grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;">
      <div style="background:#111;border:1px solid #1f1f1f;border-radius:8px;padding:16px;">
        <div style="font-size:10px;color:#555;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Avg Mood</div>
        <div style="font-size:28px;font-weight:700;color:#6366f1;font-family:monospace;">${data.weekAvgMood}<span style="font-size:14px;color:#555;">/10</span></div>
      </div>
      <div style="background:#111;border:1px solid #1f1f1f;border-radius:8px;padding:16px;">
        <div style="font-size:10px;color:#555;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Avg Sleep</div>
        <div style="font-size:28px;font-weight:700;font-family:monospace;">${data.weekAvgSleep}<span style="font-size:14px;color:#555;">h</span></div>
      </div>
      <div style="background:#111;border:1px solid #1f1f1f;border-radius:8px;padding:16px;">
        <div style="font-size:10px;color:#555;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Meds Adherence</div>
        <div style="font-size:28px;font-weight:700;color:${data.medsAdherence >= 80 ? '#22c55e' : '#f59e0b'};font-family:monospace;">${data.medsAdherence}<span style="font-size:14px;color:#555;">%</span></div>
      </div>
      <div style="background:#111;border:1px solid #1f1f1f;border-radius:8px;padding:16px;">
        <div style="font-size:10px;color:#555;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Stability</div>
        <div style="font-size:28px;font-weight:700;color:${scoreColor};font-family:monospace;">${data.stabilityScore}</div>
      </div>
    </div>

    ${data.topInsight ? `
    <div style="background:#1e1b4b44;border:1px solid #3730a3;border-radius:8px;padding:16px;margin-bottom:24px;">
      <div style="font-size:10px;color:#818cf8;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">💡 Pattern detected</div>
      <div style="font-size:14px;color:#c7d2fe;line-height:1.6;">${data.topInsight}</div>
    </div>
    ` : ''}

    <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="display:block;background:#6366f1;color:white;text-align:center;padding:12px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500;margin-bottom:32px;">
      View full dashboard →
    </a>

    <div style="font-size:11px;color:#333;text-align:center;">
      Polar · <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color:#444;">Manage email preferences</a>
    </div>
  </div>
</body>
</html>`,
  })
}

const DAILY_TIPS = [
  'Sleep at the same time tonight, even by 15 minutes earlier than usual. Consistency is more important than perfection.',
  'Before opening any app today, take 3 slow breaths. Your nervous system will notice.',
  'If you took your medication yesterday, your brain chemistry is more stable today than it would have been without it.',
  'One small social interaction today counts. A text, a call, a conversation — connection is protective.',
  'Hydration affects mood more than most people realize. Start with water before coffee today.',
  'Notice your energy level right now. That information is valuable — track it honestly in your Pulse.',
  'If you feel elevated or unusually energized, that is data. Note it, and consider reaching out to your psychiatrist.',
  'Your mood tomorrow is partly built by your sleep tonight. Protect it.',
  'Recovery is not linear. A hard day is not evidence that things are getting worse.',
  'The fact that you are tracking is itself treatment. You are doing something most people don\'t do.',
]

export function getDailyTip(): string {
  return DAILY_TIPS[new Date().getDate() % DAILY_TIPS.length]
}
