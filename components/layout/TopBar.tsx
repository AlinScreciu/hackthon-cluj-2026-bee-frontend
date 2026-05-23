'use client'
import Link from 'next/link'
import { LogOut, Settings, Bell, CalendarDays } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import { useAlerts } from '@/lib/api/queries'
import { BeeLogo } from '@/components/ui/BeeLogo'
import { PRIMARY_NAV_BY_ROLE, ROLE_PILL, ROLE_ROOT, isNavActive, getPageTitle } from '@/lib/nav'
import type { User } from '@/lib/api/types'

const DATE_FMT = new Intl.DateTimeFormat('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' })

export function TopBar({ user }: { user: User }) {
  const router = useRouter()
  const pathname = usePathname()
  const qc = useQueryClient()
  const tabs = PRIMARY_NAV_BY_ROLE[user.role] ?? []
  const pill = ROLE_PILL[user.role]
  const root = ROLE_ROOT[user.role]
  const pageTitle = getPageTitle(pathname)

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
      {/* Mobile/tablet: cap at max-w-7xl so brand+actions line up with page content.
          Desktop (lg+): edge-to-edge within the sidebar-shifted area so chrome
          (title, date pill) lives in its own band, distinct from centered content. */}
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 h-14 max-w-7xl mx-auto lg:max-w-none lg:mx-0">
        {/* Brand — hidden on lg+ (Sidebar owns it) */}
        <div className="flex items-center gap-2 shrink-0 lg:hidden">
          <BeeLogo size={28} aria-hidden />
          <p className="text-md font-bold text-ink leading-none tracking-[-0.01em]">Beelive</p>
          <span
            className="h-[22px] px-2.5 rounded-full text-[11px] font-bold flex items-center leading-none ml-1"
            style={{ background: pill.bg, color: pill.fg }}
          >
            {pill.label}
          </span>
        </div>

        {/* Desktop page title (lg+) */}
        <h1 className="hidden lg:block text-[18px] font-bold text-ink truncate tracking-[-0.01em]">
          {pageTitle}
        </h1>

        {/* Tablet (md only) inline nav — hidden on lg+ (Sidebar owns nav) */}
        <nav className="hidden md:flex lg:hidden items-center gap-1 mx-4 flex-1" aria-label="Navigare principală">
          {tabs.map(tab => {
            const active = isNavActive(tab.href, pathname, root)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${active
                  ? 'bg-purple/10 text-purple'
                  : 'text-ink-muted hover:bg-hair-soft hover:text-ink'
                  }`}
                aria-current={active ? 'page' : undefined}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>

        {/* User actions */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="hidden sm:block lg:hidden text-sm font-medium text-ink-soft mr-2">{user.name}</span>

          {/* Bell — apicultor only, mobile/tablet only (sidebar's Alerte item shows the same badge on lg+) */}
          {user.role === 'apicultor' && (
            <button
              onClick={() => router.push('/apicultor/alerte')}
              className="relative p-2 rounded-lg hover:bg-hair-soft transition-colors lg:hidden"
              aria-label={unreadCount > 0 ? `${unreadCount} alerte active` : 'Notificări'}
            >
              <Bell size={18} className="text-ink-muted" aria-hidden />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[15px] h-[15px] px-[3px] rounded-full bg-alert text-white text-[9px] font-bold flex items-center justify-center leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          )}
          {/* Mobile/tablet utility actions — sidebar replaces these on lg+ */}
          <button
            onClick={() => router.push('/setari')}
            className="p-2 rounded-lg hover:bg-hair-soft transition-colors lg:hidden"
            aria-label="Setări"
          >
            <Settings size={18} className="text-ink-muted" aria-hidden />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-hair-soft transition-colors lg:hidden"
            aria-label="Ieși din cont"
          >
            <LogOut size={18} className="text-ink-muted" aria-hidden />
          </button>

          {/* Desktop date pill (lg+) — fills the right slot meaningfully */}
          <div className="hidden lg:flex items-center gap-1.5 h-9 px-3 rounded-lg bg-hair-soft text-[12.5px] font-medium text-ink-soft">
            <CalendarDays size={14} aria-hidden className="text-ink-muted" />
            <span className="capitalize">{DATE_FMT.format(new Date())}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
