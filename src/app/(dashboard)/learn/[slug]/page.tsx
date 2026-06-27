import { notFound } from 'next/navigation'
import { getArticle, CATEGORIES } from '@/lib/medical/knowledge-base'
import Link from 'next/link'

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const cat = CATEGORIES[article.category]

  return (
    <div style={{ maxWidth: '700px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', fontSize: '13px', color: 'var(--text-3)' }}>
        <Link href="/learn" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Learn</Link>
        <span>›</span>
        <span style={{ color: cat.color }}>{cat.label}</span>
      </div>

      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'inline-block', padding: '3px 10px', background: cat.color + '22', border: `1px solid ${cat.color}44`, borderRadius: '20px', fontSize: '12px', color: cat.color, fontWeight: '600', marginBottom: '16px' }}>
          {cat.label}
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text)', lineHeight: 1.2, marginBottom: '12px', letterSpacing: '-0.03em' }}>
          {article.title}
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-2)', lineHeight: 1.65, marginBottom: '16px' }}>
          {article.summary}
        </p>
        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-3)' }}>
          <span>{article.readTime} min read</span>
          <span>·</span>
          <span>Last reviewed {article.lastReviewed}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '48px' }}>
        {article.content.map((section, i) => (
          <div key={i}>
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text)', marginBottom: '12px', letterSpacing: '-0.01em' }}>
              {section.heading}
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.8 }}>
              {section.body}
            </p>
            {section.callout && (
              <div style={{
                marginTop: '16px', padding: '14px 18px', borderRadius: 'var(--radius-sm)',
                borderLeft: `3px solid ${section.callout.type === 'warning' ? 'var(--danger)' : section.callout.type === 'tip' ? 'var(--success)' : 'var(--accent)'}`,
                background: section.callout.type === 'warning' ? 'var(--danger-dim)' : section.callout.type === 'tip' ? 'var(--success-dim)' : 'var(--accent-dim)',
                fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.7,
              }}>
                <strong style={{ color: section.callout.type === 'warning' ? 'var(--danger)' : section.callout.type === 'tip' ? 'var(--success)' : 'var(--accent)', display: 'block', marginBottom: '4px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {section.callout.type === 'warning' ? 'Important' : section.callout.type === 'tip' ? 'Tip' : 'Info'}
                </strong>
                {section.callout.text}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sources */}
      <div style={{ padding: '20px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600' }}>
          Clinical Sources
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {article.sources.map((src, i) => (
            <div key={i} style={{ fontSize: '12px', color: 'var(--text-3)', paddingLeft: '10px', borderLeft: '2px solid var(--border-2)', lineHeight: 1.5 }}>
              {src}
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: '12px', color: 'var(--text-3)', lineHeight: 1.7, padding: '14px 16px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', marginBottom: '28px' }}>
        Educational content only. Not medical advice. Consult your psychiatrist for guidance specific to your situation.
      </div>

      <Link href="/learn" style={{ fontSize: '14px', color: 'var(--accent)', textDecoration: 'none', fontWeight: '500' }}>
        ← Back to Learn
      </Link>
    </div>
  )
}
