'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import {
  LayoutDashboard, Zap, TrendingUp, Lightbulb, AlertTriangle,
  BookOpen, FlaskConical, FileText, Settings, GraduationCap, Shield, PhoneCall,
} from 'lucide-react'

const nav = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pulse', label: 'Daily Pulse', icon: Zap },
  { href: '/timeline', label: 'Timeline', icon: TrendingUp },
  { href: '/patterns', label: 'Patterns', icon: Lightbulb },
  { href: '/warnings', label: 'Warnings', icon: AlertTriangle },
  { href: '/episodes', label: 'Episodes', icon: BookOpen },
  { href: '/substances', label: 'Substance Log', icon: FlaskConical },
  { href: '/wrap', label: 'Crisis Plan', icon: Shield },
  { href: '/report', label: 'Report', icon: FileText },
  { href: '/learn', label: 'Learn', icon: GraduationCap },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside style={{
      width: '220px', minHeight: '100vh', background: 'var(--surface)',
      borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
      padding: '24px 0', position: 'fixed', top: 0, left: 0, zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>P</span>
          </div>
          <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>Polar</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 12px', overflowY: 'auto' }}>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 10px',
              borderRadius: '6px', marginBottom: '2px', color: active ? 'var(--text)' : 'var(--text-2)',
              background: active ? 'var(--surface-2)' : 'transparent', textDecoration: 'none',
              fontSize: '13px', fontWeight: active ? '500' : '400', transition: 'all 0.15s',
              border: active ? '1px solid var(--border-2)' : '1px solid transparent',
            }}>
              <Icon size={14} color={active ? 'var(--accent)' : 'var(--text-3)'} />
              {label}
            </Link>
          )
        })}

        {/* Crisis link - always visible */}
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
          <Link href="/crisis" style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 10px',
            borderRadius: '6px', color: '#ef4444', textDecoration: 'none', fontSize: '13px',
            border: '1px solid transparent', transition: 'all 0.15s',
          }}>
            <PhoneCall size={14} color="#ef4444" />
            Crisis Resources
          </Link>
        </div>
      </nav>

      {/* User */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <UserButton />
        <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>Account</span>
      </div>
    </aside>
  )
}
