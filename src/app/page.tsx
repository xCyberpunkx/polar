import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  const { userId } = await auth()
  if (userId) redirect('/dashboard')

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#f2f2f2', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <nav style={{ padding: '20px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #161616', position: 'sticky', top: 0, background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="white" strokeWidth="1.5"/><path d="M7 4.5V7l1.5 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <span style={{ fontSize: '17px', fontWeight: '700', letterSpacing: '-0.02em' }}>Polar</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/crisis" style={{ fontSize: '14px', color: '#ef4444', textDecoration: 'none', fontWeight: '500' }}>Crisis Help</Link>
          <Link href="/sign-in" style={{ fontSize: '14px', color: '#a0a0a0', textDecoration: 'none' }}>Sign in</Link>
          <Link href="/sign-up" style={{ fontSize: '14px', fontWeight: '600', color: 'white', background: '#6366f1', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none' }}>Get started free</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '110px 48px 90px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: '#1e1b4b', border: '1px solid #3730a3', borderRadius: '20px', fontSize: '13px', color: '#818cf8', marginBottom: '36px', fontWeight: '500' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#818cf8', display: 'inline-block', flexShrink: 0 }} />
          Open source · Free · Built by someone with bipolar disorder
        </div>
        <h1 style={{ fontSize: '68px', fontWeight: '800', lineHeight: 1.0, letterSpacing: '-0.04em', marginBottom: '24px', color: '#f2f2f2' }}>
          Finally understand<br /><span style={{ color: '#6366f1' }}>your bipolar disorder</span>
        </h1>
        <p style={{ fontSize: '20px', color: '#707070', lineHeight: 1.65, maxWidth: '540px', margin: '0 auto 44px' }}>
          Polar tracks your mood, sleep, and medication — then uses AI to surface the patterns your brain misses during episodes.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/sign-up" style={{ fontSize: '16px', fontWeight: '700', color: 'white', background: '#6366f1', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none' }}>Start for free →</Link>
          <Link href="/crisis" style={{ fontSize: '16px', fontWeight: '500', color: '#a0a0a0', background: '#111', border: '1px solid #222', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none' }}>Crisis resources</Link>
        </div>
        <p style={{ marginTop: '18px', fontSize: '13px', color: '#444' }}>No credit card. No ads. No bullshit.</p>
      </div>

      <div style={{ background: '#0c0c0c', borderTop: '1px solid #161616', borderBottom: '1px solid #161616', padding: '80px 48px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', fontWeight: '600', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', textAlign: 'center' }}>Why existing apps fail</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { title: 'You forget', body: 'Bipolar episodes impair memory. By your next psychiatrist appointment, you cannot accurately describe last month. They make decisions on incomplete data.' },
              { title: 'Patterns are invisible', body: 'The link between 3 nights of poor sleep and a manic episode 5 days later is invisible in the moment. A database sees what you cannot.' },
              { title: 'Generic apps miss what matters', body: 'Wellness apps are not built for bipolar. They miss medication adherence, episode triggers, personal warning signs, and clinical reporting.' },
            ].map(({ title, body }) => (
              <div key={title} style={{ padding: '24px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '12px' }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#f2f2f2', marginBottom: '10px' }}>{title}</div>
                <div style={{ fontSize: '13px', color: '#606060', lineHeight: '1.75' }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '80px 48px' }}>
        <p style={{ fontSize: '13px', fontWeight: '600', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', textAlign: 'center' }}>Everything in Polar</p>
        <p style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-0.03em', textAlign: 'center', marginBottom: '52px', color: '#f2f2f2' }}>Every feature built<br />for one condition</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
          {[
            { icon: '⚡', title: 'Daily Pulse', desc: '60-second check-in: mood, energy, sleep, medication. After 30 days you have data your psychiatrist has never seen.' },
            { icon: '🤖', title: 'AI Companion Chat', desc: 'A private AI that knows your history — medications, patterns, episodes. Ask it anything. It responds with context.' },
            { icon: '📊', title: 'Pattern Detection', desc: 'After 14+ days, Polar surfaces correlations specific to you: "your mood crashes 4 days after sleep drops below 6h, 83% of the time."' },
            { icon: '⚠️', title: 'Warning Sign Alerts', desc: 'Define your personal warning signs when stable. Weekly checks. 3+ present triggers an alert to you and your trusted contact.' },
            { icon: '📄', title: 'Psychiatrist Report', desc: 'One-click PDF: 30-day charts, medication adherence, episode log, patterns. Bring real data to your next appointment.' },
            { icon: '🛡️', title: 'Crisis Plan (WRAP)', desc: 'Wellness Recovery Action Plan — built when stable, used in crisis. Tells others exactly how to help you.' },
            { icon: '📚', title: 'Clinical Knowledge Base', desc: 'Evidence-based articles from DSM-5, CANMAT, NICE, BAP guidelines. Understand your condition, your medications, your triggers.' },
            { icon: '👁️', title: 'Caregiver View', desc: 'Share a read-only link with a partner, family member, or psychiatrist. Your stability score and check-ins, no login needed.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ padding: '24px', background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '24px', flexShrink: 0, marginTop: '2px' }}>{icon}</div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#f2f2f2', marginBottom: '6px' }}>{title}</div>
                <div style={{ fontSize: '13px', color: '#606060', lineHeight: '1.7' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#0c0c0c', borderTop: '1px solid #161616', borderBottom: '1px solid #161616', padding: '80px 48px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <p style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-0.03em', textAlign: 'center', marginBottom: '48px', color: '#f2f2f2' }}>Your first 30 days</p>
          {[
            { day: 'Day 1', title: 'Set up your profile', body: 'Add your medications from our preset list (Lamotrigine, Quetiapine, Lithium, etc.). Define your personal warning signs. Build your crisis plan.' },
            { day: 'Days 2–14', title: 'Record your daily pulse', body: '60 seconds per day. After you submit, the AI reflects something true back to you. Not generic. Based on what you wrote.' },
            { day: 'Day 15', title: 'First patterns emerge', body: 'Polar begins detecting statistical correlations in your data. Sleep vs mood. Energy spikes vs crashes. Meds vs stability.' },
            { day: 'Day 30', title: 'Bring it to your psychiatrist', body: 'Generate a PDF report. Walk in with 30 days of objective data. Watch the conversation change entirely.' },
          ].map(({ day, title, body }, i, arr) => (
            <div key={day} style={{ display: 'flex', gap: '24px', padding: '24px 0', borderBottom: i < arr.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
              <div style={{ width: '72px', flexShrink: 0, fontSize: '12px', fontWeight: '700', color: '#6366f1', paddingTop: '3px', fontFamily: 'monospace', letterSpacing: '0.05em' }}>{day}</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#f2f2f2', marginBottom: '6px' }}>{title}</div>
                <div style={{ fontSize: '14px', color: '#606060', lineHeight: '1.7' }}>{body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '100px 48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '48px', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '16px', color: '#f2f2f2' }}>Start understanding<br />your brain today.</h2>
        <p style={{ fontSize: '18px', color: '#606060', marginBottom: '36px' }}>Free. Open source. Clinically grounded.</p>
        <Link href="/sign-up" style={{ fontSize: '17px', fontWeight: '700', color: 'white', background: '#6366f1', padding: '16px 40px', borderRadius: '10px', textDecoration: 'none', display: 'inline-block' }}>Create your free account →</Link>
        <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #161616', fontSize: '12px', color: '#3a3a3a', lineHeight: '1.7' }}>
          Polar is not a medical device. Not a substitute for psychiatric care. Always work with a qualified psychiatrist.
          <br /><Link href="/crisis" style={{ color: '#555', textDecoration: 'none' }}>Crisis resources →</Link>
        </div>
      </div>
    </div>
  )
}
