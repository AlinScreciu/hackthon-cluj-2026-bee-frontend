'use client'
import Link from 'next/link'
import { LogOut, Settings, Bell } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import { useAlerts } from '@/lib/api/queries'
import { BeeLogo } from '@/components/ui/BeeLogo'
import type { User, Role } from '@/lib/api/types'

const ROLE_PILL: Record<Role, { bg: string; fg: string; label: string }> = {
  apicultor: { bg: '#FFEF5F', fg: '#1B0F2E', label: 'Apicultor' },
  fermier:   { bg: '#40288C', fg: '#FFFFFF', label: 'Fermier' },
  inspector: { bg: '#85489D', fg: '#FFFFFF', label: 'ANF' },
}

const DESKTOP_TABS: Record<string, { href: string; label: string }[]> = {
  apicultor: [
    { href: '/apicultor', label: 'Acasă' },
    { href: '/apicultor/stupine', label: 'Stupine' },
    { href: '/apicultor/alerte', label: 'Alerte' },
  ],
  fermier: [
    { href: '/fermier', label: 'Acasă' },
    { href: '/fermier/parcele', label: 'Parcele' },
    { href: '/fermier/rapoarte', label: 'Rapoarte' },
  ],
  inspector: [
    { href: '/inspector', label: 'Acasă' },
    { href: '/inspector/harta', label: 'Hartă' },
    { href: '/inspector/fermieri', label: 'Fermieri' },
    { href: '/inspector/pagube', label: 'Pagube' },
  ],
}


export function TopBar({ user }: { user: User }) {
  const router = useRouter()
  const pathname = usePathname()
  const qc = useQueryClient()
  const tabs = DESKTOP_TABS[user.role] ?? []
  const pill = ROLE_PILL[user.role]

  // Bell badge: unread active alerts (apicultor only)
  const { data: alertsData } = useAlerts('active')
  const unreadCount = user.role === 'apicultor' ? (alertsData?.items?.length ?? 0) : 0

  async function handleLogout() {
    await api.post('/auth/logout')
    qc.clear()
    router.replace('/login')
  }

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-hair">
      <div className="flex items-center justify-between px-4 h-14 max-w-4xl mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <BeeLogo size={28} aria-hidden />
          <div>
            <p className="text-sm font-bold text-ink leading-none tracking-[-0.01em]">Beelive</p>
            <p className="text-[10px] text-ink-muted leading-none mt-0.5 tracking-[0.02em] uppercase font-medium">
              Radarul Albinelor
            </p>
          </div>
          {/* Role pill */}
          <span
            className="h-[22px] px-2.5 rounded-full text-[11px] font-bold flex items-center leading-none ml-1"
            style={{ background: pill.bg, color: pill.fg }}
          >
            {pill.label}
          </span>
        </div>

        {/* Desktop nav — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-1 mx-4 flex-1" aria-label="Navigare principală">
          {tabs.map(tab => {
            const isActive = pathname === tab.href ||
              (tab.href !== `/${user.role}` && pathname.startsWith(tab.href))
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-purple/10 text-purple'
                    : 'text-ink-muted hover:bg-hair-soft hover:text-ink'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>

        {/* User actions */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="hidden sm:block text-sm font-medium text-ink-soft mr-2">{user.name}</span>

          {/* Bell with unread badge */}
          <button
            onClick={() => user.role === 'apicultor' && router.push('/apicultor/alerte')}
            className="relative p-2 rounded-lg hover:bg-hair-soft transition-colors"
            aria-label={unreadCount > 0 ? `${unreadCount} alerte active` : 'Notificări'}
          >
            <Bell size={18} className="text-ink-muted" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[15px] h-[15px] px-[3px] rounded-full bg-alert text-white text-[9px] font-bold flex items-center justify-center leading-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => router.push('/setari')}
            className="p-2 rounded-lg hover:bg-hair-soft transition-colors"
            aria-label="Setări"
          >
            <Settings size={18} className="text-ink-muted" />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-hair-soft transition-colors"
            aria-label="Ieși din cont"
          >
            <LogOut size={18} className="text-ink-muted" />
          </button>
        </div>
      </div>
    </header>
  )
}
