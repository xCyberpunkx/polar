import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text)', marginBottom: '8px' }}>Polar</div>
          <div style={{ fontSize: '14px', color: 'var(--text-2)' }}>Your bipolar intelligence platform</div>
        </div>
        <SignIn />
      </div>
    </div>
  )
}
