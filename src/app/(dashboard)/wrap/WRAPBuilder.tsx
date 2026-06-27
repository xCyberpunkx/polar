'use client'

import { useState, useEffect } from 'react'
import { Card, Button } from '@/components/ui'

interface WRAPData {
  wellSigns: string
  dailyMaintenance: string
  triggers: string
  earlyWarnings: string
  worsening: string
  crisisContacts: { name: string; phone: string; relationship: string }[]
  hospitalPreferences: string
  medicationsHelped: string
  medicationsNotHelped: string
  thingsHelpMe: string
  thingsMakeWorse: string
  advanceDirectives: string
  postCrisisPlan: string
}

const DEFAULT: WRAPData = {
  wellSigns: '',
  dailyMaintenance: '',
  triggers: '',
  earlyWarnings: '',
  worsening: '',
  crisisContacts: [{ name: '', phone: '', relationship: '' }],
  hospitalPreferences: '',
  medicationsHelped: '',
  medicationsNotHelped: '',
  thingsHelpMe: '',
  thingsMakeWorse: '',
  advanceDirectives: '',
  postCrisisPlan: '',
}

const SECTIONS = [
  {
    id: 'wellSigns',
    title: '1. What I look like when I\'m well',
    description: 'Describe yourself in specific behavioral terms when stable. This is your baseline. Be concrete — hours of sleep, how you interact, your appetite, energy, motivation.',
    placeholder: 'e.g. I sleep 7.5 hours and wake up without an alarm. I enjoy cooking. I respond to messages within a day. I feel curious about my work. I exercise 3x a week...',
    rows: 5,
  },
  {
    id: 'dailyMaintenance',
    title: '2. Daily maintenance plan',
    description: 'What you need to do every day to stay well — medication times, sleep schedule, meals, movement, connection. Document this when well so you have a reference when you slip.',
    placeholder: 'e.g. Take lamotrigine at 9pm. Sleep by 11pm, wake at 7am. Eat three meals. Walk for 20 minutes. Text one friend...',
    rows: 5,
  },
  {
    id: 'triggers',
    title: '3. Known triggers',
    description: 'External events or circumstances that have historically preceded episodes. Be specific — what kind of stress, what situations, what people or contexts.',
    placeholder: 'e.g. Work deadline pressure without support. Social isolation for more than 4 days. Jet lag or travel across time zones. Conflict with my family. Alcohol use...',
    rows: 4,
  },
  {
    id: 'earlyWarnings',
    title: '4. Early warning signs',
    description: 'Subtle internal signals that something is changing — things you might notice before anyone else does. May differ for manic vs depressive episodes.',
    placeholder: 'e.g. (Mania) I start texting people late at night. I feel like I need less sleep. I make plans I normally wouldn\'t.\n\n(Depression) I stop answering messages. I skip meals. I feel the days are moving slowly...',
    rows: 5,
  },
  {
    id: 'worsening',
    title: '5. When things are breaking down',
    description: 'Clear signs that you need immediate help — behaviors or symptoms that indicate you are in or approaching a crisis.',
    placeholder: 'e.g. I stop sleeping entirely. I am spending money I don\'t have. I am not recognizing my own reflection. I am having thoughts of suicide. I cannot follow a conversation...',
    rows: 4,
  },
]

const textareaStyle = (rows: number): React.CSSProperties => ({
  width: '100%',
  padding: '12px 14px',
  background: 'var(--surface-2)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  color: 'var(--text)',
  fontSize: '14px',
  fontFamily: 'inherit',
  outline: 'none',
  resize: 'vertical',
  lineHeight: '1.6',
  minHeight: `${rows * 28}px`,
})

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  background: 'var(--surface-2)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  color: 'var(--text)',
  fontSize: '13px',
  fontFamily: 'inherit',
  outline: 'none',
}

export function WRAPBuilder() {
  const [data, setData] = useState<WRAPData>(DEFAULT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState(0)

  useEffect(() => {
    fetch('/api/wrap')
      .then((r) => r.json())
      .then((d) => {
        if (d) setData({ ...DEFAULT, ...d })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function save() {
    setSaving(true)
    await fetch('/api/wrap', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function updateField(field: keyof WRAPData, value: any) {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  function updateContact(index: number, field: string, value: string) {
    const contacts = [...data.crisisContacts]
    contacts[index] = { ...contacts[index], [field]: value }
    setData((prev) => ({ ...prev, crisisContacts: contacts }))
  }

  function addContact() {
    setData((prev) => ({
      ...prev,
      crisisContacts: [...prev.crisisContacts, { name: '', phone: '', relationship: '' }],
    }))
  }

  function removeContact(index: number) {
    setData((prev) => ({
      ...prev,
      crisisContacts: prev.crisisContacts.filter((_, i) => i !== index),
    }))
  }

  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-3)' }}>Loading your WRAP...</div>
      </Card>
    )
  }

  const allSections = [...SECTIONS.map((s) => s.id), 'contacts', 'hospital', 'medications', 'crisis', 'postCrisis']
  const progress = allSections.filter((s) => {
    if (s === 'contacts') return data.crisisContacts.some((c) => c.name)
    return (data as any)[s]?.trim()
  }).length

  return (
    <div>
      {/* Progress */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>Plan completion</span>
          <span style={{ fontSize: '12px', color: 'var(--text-2)', fontFamily: 'var(--font-geist-mono)' }}>
            {progress}/{allSections.length} sections
          </span>
        </div>
        <div style={{ height: '4px', background: 'var(--border-2)', borderRadius: '2px' }}>
          <div style={{
            height: '100%',
            width: `${(progress / allSections.length) * 100}%`,
            background: progress === allSections.length ? 'var(--success)' : 'var(--accent)',
            borderRadius: '2px',
            transition: 'width 0.3s',
          }} />
        </div>
      </div>

      {/* Core sections */}
      {SECTIONS.map((section, i) => (
        <Card key={section.id} style={{ marginBottom: '16px' }}>
          <div
            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            onClick={() => setActiveSection(activeSection === i ? -1 : i)}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', marginBottom: '2px' }}>
                {section.title}
                {(data as any)[section.id]?.trim() && (
                  <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--success)' }}>✓</span>
                )}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>{section.description.slice(0, 60)}...</div>
            </div>
            <span style={{ color: 'var(--text-3)', fontSize: '18px' }}>{activeSection === i ? '−' : '+'}</span>
          </div>

          {activeSection === i && (
            <div style={{ marginTop: '16px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '10px', lineHeight: '1.6' }}>
                {section.description}
              </p>
              <textarea
                value={(data as any)[section.id]}
                onChange={(e) => updateField(section.id as keyof WRAPData, e.target.value)}
                placeholder={section.placeholder}
                style={textareaStyle(section.rows)}
              />
            </div>
          )}
        </Card>
      ))}

      {/* Crisis contacts */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', marginBottom: '4px' }}>
          6. Crisis contacts
          {data.crisisContacts.some((c) => c.name) && (
            <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--success)' }}>✓</span>
          )}
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '14px' }}>
          People who can help during a crisis — and who have permission to be involved in your care. Include relationship and best contact method.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
          {data.crisisContacts.map((contact, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '8px', alignItems: 'center' }}>
              <input placeholder="Name" value={contact.name} onChange={(e) => updateContact(i, 'name', e.target.value)} style={inputStyle} />
              <input placeholder="Phone" value={contact.phone} onChange={(e) => updateContact(i, 'phone', e.target.value)} style={inputStyle} />
              <input placeholder="Relationship" value={contact.relationship} onChange={(e) => updateContact(i, 'relationship', e.target.value)} style={inputStyle} />
              {i > 0 && (
                <button onClick={() => removeContact(i)} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: '16px' }}>×</button>
              )}
            </div>
          ))}
        </div>
        <Button variant="secondary" size="sm" onClick={addContact}>+ Add contact</Button>
      </Card>

      {/* Hospital & medications */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', marginBottom: '14px' }}>
          7. Hospital preferences & medication history
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: 'var(--text-2)', display: 'block', marginBottom: '6px' }}>Hospital/facility preferences (or facilities to avoid)</label>
          <textarea value={data.hospitalPreferences} onChange={(e) => updateField('hospitalPreferences', e.target.value)} placeholder="e.g. Prefer [hospital name]. Do NOT send me to [hospital name]. I have had good experiences with..." style={textareaStyle(3)} />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: 'var(--text-2)', display: 'block', marginBottom: '6px' }}>Medications that have helped me</label>
          <textarea value={data.medicationsHelped} onChange={(e) => updateField('medicationsHelped', e.target.value)} placeholder="e.g. Quetiapine 50mg PRN for sleep during mania. Lorazepam during acute episodes..." style={textareaStyle(3)} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: 'var(--text-2)', display: 'block', marginBottom: '6px' }}>Medications that have NOT helped or caused problems</label>
          <textarea value={data.medicationsNotHelped} onChange={(e) => updateField('medicationsNotHelped', e.target.value)} placeholder="e.g. SSRIs trigger hypomania for me. Olanzapine caused intolerable weight gain..." style={textareaStyle(3)} />
        </div>
      </Card>

      {/* Crisis management */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', marginBottom: '14px' }}>
          8. During a crisis: what helps and what doesn't
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: 'var(--text-2)', display: 'block', marginBottom: '6px' }}>Things that help me feel better/safer</label>
          <textarea value={data.thingsHelpMe} onChange={(e) => updateField('thingsHelpMe', e.target.value)} placeholder="e.g. Being in a quiet room. Having someone sit with me without talking. Listening to [specific music]. Being reassured I'm safe..." style={textareaStyle(3)} />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', color: 'var(--text-2)', display: 'block', marginBottom: '6px' }}>Things that make things worse</label>
          <textarea value={data.thingsMakeWorse} onChange={(e) => updateField('thingsMakeWorse', e.target.value)} placeholder="e.g. Loud environments. Being touched without permission. Being asked many questions at once. Bright lights..." style={textareaStyle(3)} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: 'var(--text-2)', display: 'block', marginBottom: '6px' }}>Advance directives (decisions others can make on your behalf)</label>
          <textarea value={data.advanceDirectives} onChange={(e) => updateField('advanceDirectives', e.target.value)} placeholder="e.g. [Person name] has permission to speak to my psychiatrist. If I am hospitalized, contact [name]. Do not share my information with [person]..." style={textareaStyle(3)} />
        </div>
      </Card>

      {/* Post-crisis */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', marginBottom: '8px' }}>
          9. Post-crisis recovery plan
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '10px' }}>
          What does recovery look like? What do you need in the weeks after an episode? What helps you rebuild routine?
        </p>
        <textarea value={data.postCrisisPlan} onChange={(e) => updateField('postCrisisPlan', e.target.value)} placeholder="e.g. I need 1-2 weeks of reduced responsibilities. I should avoid big decisions for at least 2 weeks after a manic episode. I need to reconnect with [person] gently. I will schedule a psychiatrist follow-up within 1 week..." style={textareaStyle(4)} />
      </Card>

      {/* Save */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Button onClick={save} disabled={saving} style={{ minWidth: '140px', justifyContent: 'center' }}>
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save WRAP'}
        </Button>
        <span style={{ fontSize: '13px', color: 'var(--text-3)' }}>
          Share this plan with your psychiatrist and at least one trusted contact.
        </span>
      </div>
    </div>
  )
}
