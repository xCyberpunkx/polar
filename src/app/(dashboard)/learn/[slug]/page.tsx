import { notFound } from 'next/navigation'
import { getArticle, CATEGORIES } from '@/lib/medical/knowledge-base'
import { Card, Badge } from '@/components/ui'
import Link from 'next/link'

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug)
  if (!article) notFound()

  const cat = CATEGORIES[article.category]

  return (
    <div style={{ maxWidth: '680px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '13px', color: 'var(--text-3)' }}>
        <Link href="/learn" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Learn</Link>
        <span>→</span>
        <span style={{ color: cat.color }}>{cat.label}</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text)', lineHeight: '1.3', marginBottom: '12px' }}>
          {article.title}
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: '1.6', marginBottom: '16px' }}>
          {article.summary}
        </p>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>{article.readTime} min read</span>
          <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>·</span>
          <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>Reviewed {article.lastReviewed}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '40px' }}>
        {article.content.map((section, i) => (
          <div key={i}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text)', marginBottom: '10px' }}>
              {section.heading}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: '1.8' }}>
              {section.body}
            </p>
            {section.callout && (
              <div
                style={{
                  marginTop: '14px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius)',
                  borderLeft: `3px solid ${section.callout.type === 'warning' ? 'var(--danger)' : section.callout.type === 'tip' ? 'var(--success)' : 'var(--accent)'}`,
                  background: section.callout.type === 'warning' ? '#450a0a22' : section.callout.type === 'tip' ? '#052e1622' : '#1e1b4b44',
                  fontSize: '13px',
                  color: 'var(--text-2)',
                  lineHeight: '1.7',
                }}
              >
                <strong style={{ color: section.callout.type === 'warning' ? 'var(--danger)' : section.callout.type === 'tip' ? 'var(--success)' : 'var(--accent)' }}>
                  {section.callout.type === 'warning' ? '⚠ Important' : section.callout.type === 'tip' ? '💡 Tip' : 'ℹ Info'}:
                </strong>{' '}
                {section.callout.text}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sources */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Clinical Sources
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {article.sources.map((src, i) => (
            <li key={i} style={{ fontSize: '12px', color: 'var(--text-3)', paddingLeft: '12px', borderLeft: '2px solid var(--border-2)' }}>
              {src}
            </li>
          ))}
        </ul>
      </Card>

      {/* Disclaimer */}
      <div style={{ fontSize: '12px', color: 'var(--text-3)', lineHeight: '1.6', padding: '12px', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
        This article is for educational purposes only and does not constitute medical advice. Consult your psychiatrist or healthcare provider for guidance specific to your situation.
      </div>

      <div style={{ marginTop: '24px' }}>
        <Link href="/learn" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none' }}>
          ← Back to Learn
        </Link>
      </div>
    </div>
  )
}
