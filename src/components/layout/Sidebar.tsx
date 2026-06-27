'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { useTheme } from './ThemeProvider'
import {
  LayoutDashboard, Zap, TrendingUp, Brain, AlertTriangle,
  BookOpen, Beaker, Shield, FileText, GraduationCap,
  Settings, Phone, MessageCircle, Sun, Moon,
} from 'lucide-react'

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pulse', label: 'Daily Pulse', icon: Zap },
  { href: '/chat', label: 'AI Companion', icon: MessageCircle, highlight: true },
  { href: '/timeline', label: 'Timeline', icon: TrendingUp },
  { href: '/patterns', label: 'Patterns', icon: Brain },
  { href: '/warnings', label: 'Warning Signs', icon: AlertTriangle },
  { href: '/episodes', label: 'Episodes', icon: BookOpen },
  { href: '/substances', label: 'Substance Log', icon: Beaker },
  { href: '/wrap', label: 'Crisis Plan', icon: Shield },
  { href: '/report', label: 'Report', icon: FileText },
  { href: '/learn', label: 'Learn', icon: GraduationCap },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { theme, toggle } = useTheme()

  return (
    <aside style={{
      width: '236px', minHeight: '100vh', background: 'var(--surface)',
      borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid var(--border)' }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '9px',
            background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="5.5" stroke="white" strokeWidth="1.5"/>
              <path d="M8 5v3l2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1 }}>Polar</div>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>Bipolar intelligence</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 10px', overflowY: 'auto' }}>
        {nav.map(({ href, label, icon: Icon, highlight }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px',
              borderRadius: '7px', marginBottom: '2px', textDecoration: 'none',
              color: active ? 'var(--text)' : highlight ? 'var(--accent)' : 'var(--text-2)',
              background: active ? 'var(--surface-2)' : 'transparent',
              fontSize: '13.5px', fontWeight: active ? '600' : highlight ? '500' : '400',
              borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
              transition: 'all 0.1s',
            }}>
              <Icon size={15} color={active ? 'var(--accent)' : highlight ? 'var(--accent)' : 'var(--text-3)'} strokeWidth={active ? 2.2 : 1.8} />
              {label}
              {highlight && !active && (
                <span style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: '700', background: 'var(--accent)', color: 'white', padding: '1px 6px', borderRadius: '10px' }}>AI</span>
              )}
            </Link>
          )
        })}

        {/* Crisis */}
        <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
          <Link href="/crisis" style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px',
            borderRadius: '7px', color: 'var(--danger)', textDecoration: 'none',
            fontSize: '13.5px', fontWeight: '500', background: 'var(--danger-dim)',
            border: '1px solid color-mix(in srgb, var(--danger) 20%, transparent)',
          }}>
            <Phone size={14} color="var(--danger)" />
            Crisis Resources
          </Link>
        </div>
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border)' }}>
        <button onClick={toggle} style={{
          width: '100%', padding: '8px 10px', background: 'var(--surface-2)',
          border: '1px solid var(--border)', borderRadius: '7px',
          color: 'var(--text-2)', fontSize: '13px', cursor: 'pointer',
          fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '8px',
          marginBottom: '10px',
        }}>
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 6px' }}>
          <UserButton />
          <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>Account</span>
        </div>
      </div>
    </aside>
  )
}
