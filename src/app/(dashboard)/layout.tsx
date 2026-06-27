import { Sidebar } from '@/components/layout/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <main style={{
        marginLeft: '236px',
        flex: 1,
        padding: '36px 44px',
        maxWidth: 'calc(100vw - 236px)',
        minHeight: '100vh',
      }}>
        {children}
      </main>
    </div>
  )
}
