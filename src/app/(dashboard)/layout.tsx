import { Sidebar } from '@/components/layout/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main
        style={{
          marginLeft: '220px',
          flex: 1,
          padding: '40px',
          maxWidth: 'calc(100vw - 220px)',
        }}
      >
        {children}
      </main>
    </div>
  )
}
