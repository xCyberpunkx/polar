'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

// Card
export function Card({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '24px',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// Badge
export function Badge({
  children,
  type = 'default',
}: {
  children: ReactNode
  type?: 'default' | 'warning' | 'danger' | 'success' | 'insight'
}) {
  const colors = {
    default: { bg: 'var(--surface-2)', color: 'var(--text-2)', border: 'var(--border-2)' },
    warning: { bg: '#451a03', color: '#f59e0b', border: '#78350f' },
    danger: { bg: '#450a0a', color: '#ef4444', border: '#7f1d1d' },
    success: { bg: '#052e16', color: '#22c55e', border: '#14532d' },
    insight: { bg: '#1e1b4b', color: '#818cf8', border: '#3730a3' },
  }
  const c = colors[type]

  return (
    <span
      style={{
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        borderRadius: '4px',
        padding: '2px 8px',
        fontSize: '11px',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
    >
      {children}
    </span>
  )
}

// Button
export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  style,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit'
  style?: React.CSSProperties
}) {
  const variants = {
    primary: { background: 'var(--accent)', color: 'white', border: 'transparent' },
    secondary: { background: 'var(--surface-2)', color: 'var(--text)', border: 'var(--border-2)' },
    danger: { background: '#450a0a', color: '#ef4444', border: '#7f1d1d' },
    ghost: { background: 'transparent', color: 'var(--text-2)', border: 'transparent' },
  }
  const sizes = {
    sm: { padding: '6px 12px', fontSize: '13px' },
    md: { padding: '9px 16px', fontSize: '14px' },
    lg: { padding: '12px 24px', fontSize: '15px' },
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variants[variant],
        ...sizes[size],
        borderRadius: 'var(--radius)',
        border: `1px solid ${variants[variant].border}`,
        fontFamily: 'inherit',
        fontWeight: '500',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

// Stat card
export function Stat({
  label,
  value,
  sub,
  color,
}: {
  label: string
  value: string | number
  sub?: string
  color?: string
}) {
  return (
    <Card>
      <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </div>
      <div style={{ fontSize: '32px', fontWeight: '600', color: color || 'var(--text)', fontFamily: 'var(--font-geist-mono)', lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '6px' }}>{sub}</div>
      )}
    </Card>
  )
}

// Page header
export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--text)', marginBottom: '6px' }}>
        {title}
      </h1>
      {description && (
        <p style={{ fontSize: '14px', color: 'var(--text-2)' }}>{description}</p>
      )}
    </div>
  )
}

// Divider
export function Divider() {
  return <div style={{ borderTop: '1px solid var(--border)', margin: '24px 0' }} />
}

// Slider input
export function SliderInput({
  label,
  value,
  onChange,
  min = 1,
  max = 10,
  color,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  color?: string
}) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <label style={{ fontSize: '13px', color: 'var(--text-2)' }}>{label}</label>
        <span style={{ fontSize: '13px', fontWeight: '600', color: color || 'var(--accent)', fontFamily: 'var(--font-geist-mono)' }}>
          {value}/10
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: color || 'var(--accent)', cursor: 'pointer' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{min}</span>
        <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{max}</span>
      </div>
    </div>
  )
}
