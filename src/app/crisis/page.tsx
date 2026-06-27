import Link from 'next/link'

const HOTLINES = [
  { country: 'International', name: 'International Association for Suicide Prevention', number: 'https://www.iasp.info/resources/Crisis_Centres/', note: 'Directory of crisis centers worldwide' },
  { country: 'Algeria', name: 'SAMU Social', number: '3033', note: 'Emergency social services' },
  { country: 'USA', name: '988 Suicide & Crisis Lifeline', number: '988', note: 'Call or text 988. Available 24/7.' },
  { country: 'UK', name: 'Samaritans', number: '116 123', note: 'Free, 24/7. jo@samaritans.org' },
  { country: 'Canada', name: 'Crisis Services Canada', number: '1-833-456-4566', note: 'Text: 45645 (4pm–midnight ET)' },
  { country: 'Australia', name: 'Lifeline', number: '13 11 14', note: 'Text: 0477 13 11 14' },
  { country: 'France', name: 'Numéro National de Prévention du Suicide', number: '3114', note: 'Available 24/7' },
  { country: 'Germany', name: 'Telefonseelsorge', number: '0800 111 0 111', note: 'Free, 24/7' },
]

const WARNING_SIGNS = [
  'Talking about wanting to die or to kill yourself',
  'Looking for ways to kill yourself',
  'Talking about feeling hopeless or having no reason to live',
  'Talking about being a burden to others',
  'Withdrawing from friends, family, and activities',
  'Giving away prized possessions',
  'Saying goodbye as if not planning to see people again',
  'Extreme mood swings or sudden calmness after depression',
]

export default function CrisisPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '40px 20px', fontFamily: 'inherit' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        {/* Emergency banner */}
        <div style={{
          background: '#450a0a',
          border: '1px solid var(--danger)',
          borderRadius: 'var(--radius)',
          padding: '20px 24px',
          marginBottom: '32px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#ef4444', marginBottom: '8px' }}>
            If you are in immediate danger
          </div>
          <div style={{ fontSize: '15px', color: '#fca5a5' }}>
            Call emergency services (15, 17, or 112 in Algeria · 911 in USA · 999 in UK · 112 in Europe)
          </div>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            POLAR · CRISIS RESOURCES
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: 'var(--text)', marginBottom: '12px' }}>
            You are not alone.
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: '1.7' }}>
            If you are in crisis or having thoughts of suicide or self-harm, please reach out to a crisis line or emergency services. This page is always accessible — no login required.
          </p>
        </div>

        {/* Crisis lines */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text)', marginBottom: '16px' }}>
            Crisis Lines
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {HOTLINES.map((line) => (
              <div
                key={line.country}
                style={{
                  padding: '16px 20px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {line.country}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)', marginBottom: '2px' }}>{line.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{line.note}</div>
                </div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#ef4444', fontFamily: 'var(--font-geist-mono)', whiteSpace: 'nowrap' }}>
                  {line.number.startsWith('http') ? (
                    <a href={line.number} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontSize: '13px', fontFamily: 'inherit' }}>
                      View directory →
                    </a>
                  ) : line.number}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Warning signs */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text)', marginBottom: '8px' }}>
            Warning signs in yourself or someone else
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '14px' }}>
            If you notice these signs — in yourself or someone you care about — take them seriously. Reach out.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {WARNING_SIGNS.map((sign, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 16px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '14px',
                  color: 'var(--text-2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span style={{ color: 'var(--warning)' }}>⚠</span>
                {sign}
              </div>
            ))}
          </div>
        </section>

        {/* What to do right now */}
        <section style={{
          padding: '24px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          marginBottom: '32px',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text)', marginBottom: '16px' }}>
            If you are struggling right now
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { step: '1', text: 'Tell someone you trust how you are feeling.' },
              { step: '2', text: 'Call a crisis line from the list above.' },
              { step: '3', text: 'Go to your nearest emergency room or call emergency services.' },
              { step: '4', text: 'Contact your psychiatrist or their emergency line.' },
              { step: '5', text: 'If you have a WRAP plan, follow your crisis section.' },
            ].map(({ step, text }) => (
              <div key={step} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: '600', color: 'white', flexShrink: 0,
                }}>
                  {step}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-2)', paddingTop: '3px' }}>{text}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Back to app */}
        <div style={{ textAlign: 'center', paddingBottom: '40px' }}>
          <Link href="/" style={{ fontSize: '13px', color: 'var(--text-3)', textDecoration: 'none' }}>
            ← Back to Polar
          </Link>
        </div>
      </div>
    </div>
  )
}
