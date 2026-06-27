import { PageHeader, Card, Badge } from '@/components/ui'
import { ARTICLES, CATEGORIES } from '@/lib/medical/knowledge-base'
import Link from 'next/link'

export default function LearnPage() {
  return (
    <div style={{ maxWidth: '760px' }}>
      <PageHeader
        title="Learn"
        description="Evidence-based psychoeducation from clinical guidelines. Knowledge is a treatment tool."
      />

      <Card style={{ marginBottom: '32px', borderColor: 'var(--border-2)', background: 'linear-gradient(135deg, #1e1b4b 0%, #111 100%)' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: '1.8' }}>
          <strong style={{ color: 'var(--text)' }}>Medical disclaimer:</strong> Content in this section is psychoeducational and based on published clinical guidelines (DSM-5, CANMAT, NICE, BAP). It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your psychiatrist or healthcare provider about your specific situation.
        </div>
      </Card>

      {Object.entries(CATEGORIES).map(([key, cat]) => {
        const articles = ARTICLES.filter((a) => a.category === key)
        if (!articles.length) return null
        return (
          <div key={key} style={{ marginBottom: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: cat.color }} />
              <h2 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>{cat.label}</h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '14px', paddingLeft: '20px' }}>
              {cat.description}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {articles.map((article) => (
                <Link key={article.slug} href={`/learn/${article.slug}`} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      padding: '16px 20px',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      transition: 'border-color 0.15s',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)', marginBottom: '4px' }}>
                          {article.title}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: '1.5' }}>
                          {article.summary}
                        </div>
                      </div>
                      <div style={{ flexShrink: 0, fontSize: '12px', color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
                        {article.readTime} min
                      </div>
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
