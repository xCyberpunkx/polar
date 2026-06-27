import { ARTICLES, CATEGORIES } from '@/lib/medical/knowledge-base'
import Link from 'next/link'

export default function LearnPage() {
  return (
    <div style={{ maxWidth: '780px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: '6px' }}>Learn</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-2)' }}>
          Evidence-based psychoeducation from clinical guidelines. Knowledge about your condition is a treatment tool.
        </p>
      </div>

      <div style={{ padding: '14px 16px', background: 'var(--accent-dim)', border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)', borderRadius: 'var(--radius)', marginBottom: '32px', fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.7 }}>
        <strong style={{ color: 'var(--text)' }}>Medical disclaimer:</strong> Content is sourced from DSM-5-TR, CANMAT 2018, NICE CG185, and BAP 2016 guidelines. It is psychoeducational — not a substitute for professional psychiatric care.
      </div>

      {(Object.entries(CATEGORIES) as [string, typeof CATEGORIES[keyof typeof CATEGORIES]][]).map(([key, cat]) => {
        const articles = ARTICLES.filter(a => a.category === key)
        if (!articles.length) return null
        return (
          <div key={key} style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
              <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text)' }}>{cat.label}</h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '12px', paddingLeft: '20px' }}>{cat.description}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {articles.map(article => (
                <Link key={article.slug} href={`/learn/${article.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '16px 20px', background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', gap: '20px', transition: 'border-color 0.1s',
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)', marginBottom: '4px' }}>
                        {article.title}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.6 }}>
                        {article.summary}
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', whiteSpace: 'nowrap', paddingTop: '2px' }}>
                      {article.readTime} min
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
