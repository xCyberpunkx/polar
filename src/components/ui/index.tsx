'use client'

import { ReactNode } from 'react'

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, style, className }: { children: ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <div className={className} style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '20px',
      ...style,
    }}>
      {children}
    </div>
  )
}

// ─── Button ───────────────────────────────────────────────────────────────────
export function Button({
  children, onClick, variant = 'primary', size = 'md', disabled = false, type = 'button', style,
}: {
  children: ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg'; disabled?: boolean; type?: 'button' | 'submit'; style?: React.CSSProperties;
}) {
  const v = {
    primary: { background: 'var(--accent)', color: '#fff', border: 'transparent' },
    secondary: { background: 'var(--surface-2)', color: 'var(--text)', border: 'var(--border-2)' },
    danger: { background: 'var(--danger-dim)', color: 'var(--danger)', border: 'var(--danger)' },
    ghost: { background: 'transparent', color: 'var(--text-2)', border: 'transparent' },
  }[variant]
  const s = { sm: { padding: '6px 12px', fontSize: '13px' }, md: { padding: '9px 18px', fontSize: '14px' }, lg: { padding: '12px 24px', fontSize: '15px' } }[size]
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      ...v, ...s, borderRadius: 'var(--radius-sm)', border: `1px solid ${v.border}`,
      fontFamily: 'inherit', fontWeight: '500', cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1, transition: 'all 0.15s', display: 'inline-flex',
      alignItems: 'center', gap: '6px', ...style,
    }}>
      {children}
    </button>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ children, type = 'default' }: { children: ReactNode; type?: 'default' | 'warning' | 'danger' | 'success' | 'insight' }) {
  const c = {
    default: { bg: 'var(--surface-2)', color: 'var(--text-2)', border: 'var(--border-2)' },
    warning: { bg: 'var(--warning-dim)', color: 'var(--warning)', border: 'var(--warning-dim)' },
    danger: { bg: 'var(--danger-dim)', color: 'var(--danger)', border: 'var(--danger-dim)' },
    success: { bg: 'var(--success-dim)', color: 'var(--success)', border: 'var(--success-dim)' },
    insight: { bg: 'var(--accent-dim)', color: 'var(--accent)', border: 'var(--accent-dim)' },
  }[type]
  return (
    <span style={{
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: '600',
      textTransform: 'uppercase', letterSpacing: '0.06em',
    }}>
      {children}
    </span>
  )
}

// ─── Stat ─────────────────────────────────────────────────────────────────────
export function Stat({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <Card>
      <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '500' }}>
        {label}
      </div>
      <div style={{ fontSize: '30px', fontWeight: '700', color: color || 'var(--text)', fontFamily: 'var(--font-geist-mono)', lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '6px' }}>{sub}</div>}
    </Card>
  )
}

// ─── PageHeader ───────────────────────────────────────────────────────────────
export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text)', marginBottom: description ? '5px' : 0, letterSpacing: '-0.02em' }}>
        {title}
      </h1>
      {description && <p style={{ fontSize: '14px', color: 'var(--text-2)' }}>{description}</p>}
    </div>
  )
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function Divider() {
  return <div style={{ borderTop: '1px solid var(--border)', margin: '20px 0' }} />
}

// ─── SliderInput ──────────────────────────────────────────────────────────────
export function SliderInput({ label, value, onChange, min = 1, max = 10, color }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; color?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div style={{ marginBottom: '22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)' }}>{label}</label>
        <span style={{ fontSize: '15px', fontWeight: '700', color: color || 'var(--accent)', fontFamily: 'var(--font-geist-mono)' }}>
          {value}<span style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: '400' }}>/10</span>
        </span>
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{ height: '4px', background: 'var(--border-2)', borderRadius: '2px', marginBottom: '0' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: color || 'var(--accent)', borderRadius: '2px', transition: 'width 0.1s' }} />
        </div>
        <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))}
          style={{ position: 'absolute', top: '-7px', left: 0, width: '100%', opacity: 0, height: '20px', cursor: 'pointer' }}
        />
        <div style={{ position: 'absolute', top: '-7px', left: `calc(${pct}% - 9px)`, width: '18px', height: '18px', borderRadius: '50%', background: color || 'var(--accent)', border: '2px solid var(--bg)', boxShadow: '0 1px 4px rgba(0,0,0,0.3)', pointerEvents: 'none', transition: 'left 0.1s' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{min} — low</span>
        <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>high — {max}</span>
      </div>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 24px' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--surface-2)', border: '1px solid var(--border)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '20px', height: '2px', background: 'var(--border-2)', borderRadius: '1px' }} />
      </div>
      <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)', marginBottom: '6px' }}>{title}</div>
      <div style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: action ? '20px' : 0, maxWidth: '280px', margin: '0 auto', lineHeight: '1.6' }}>{description}</div>
      {action && <div style={{ marginTop: '20px' }}>{action}</div>}
    </div>
  )
}
