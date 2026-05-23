'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { LogOut, Settings as SettingsIcon } from 'lucide-react'
import { BeeLogo } from '@/components/ui/BeeLogo'
import { api } from '@/lib/api/client'
import { useAlerts } from '@/lib/api/queries'
import { PRIMARY_NAV_BY_ROLE, ROLE_PILL, ROLE_ROOT, isNavActive } from '@/lib/nav'
import type { User } from '@/lib/api/types'

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0].replace(/\./g, '')
  const last = parts[parts.length - 1].replace(/\./g, '')
  return `${first.charAt(0)}${parts.length > 1 ? last.charAt(0) : ''}`.toUpperCase()
}

export function Sidebar({ user }: { user: User }) {
  const pathname = usePathname()
  const router = useRouter()
  const qc = useQueryClient()
  const pill = ROLE_PILL[user.role]
  const items = PRIMARY_NAV_BY_ROLE[user.role]
  const root = ROLE_ROOT[user.role]

  const { data: alertsData } = useAlerts('active')
  const unread = user.role === 'apicultor' ? (alertsData?.items?.length ?? 0) : 0

  async function handleLogout() {
    await api.post('/auth/logout')
    qc.clear()
    router.replace('/login')
  }

  return (
    <aside
      className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-[220px] lg:bg-white lg:border-r lg:border-hair lg:z-40"
      aria-label="Bară laterală"
    >
      {/* Brand */}
      <div className="px-5 pt-3 pb-3 border-b border-hair-soft">
        <div className="flex items-center gap-2.5">
          <BeeLogo size={28} aria-hidden />
          <p className="text-[17px] font-bold text-ink leading-none tracking-[-0.01em]">Beelive</p>
        </div>
        <p className="text-[10.5px] italic text-purple/70 mt-1.5 ml-3 leading-snug">
          Because bees live, we live too
        </p>
      </div>

      {/* Profile card */}
      <div className="px-4 pt-4 pb-3">
        <Link
          href="/setari"
          aria-label="Profil și setări"
          className="block rounded-2xl p-3 transition-colors hover:bg-hair-soft/60 focus:outline-none focus:ring-2 focus:ring-purple/30"
          style={{
            background: `linear-gradient(135deg, ${pill.bg}0F 0%, ${pill.bg}05 100%)`,
            border: `1px solid ${pill.bg}1F`,
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-[13px] font-bold leading-none shadow-sm"
              style={{
                background: pill.bg,
                color: pill.fg,
                boxShadow: `0 2px 6px ${pill.bg}33`,
              }}
              aria-hidden
            >
              {initialsOf(user.name)}
            </div>
            <div className="min-w-0 flex-1">
              <span
                className="inline-flex items-center h-[18px] px-2 rounded-full text-[10px] font-bold leading-none"
                style={{ background: pill.bg, color: pill.fg }}
              >
                {pill.label}
              </span>
              <p className="mt-1 text-[13px] font-semibold text-ink leading-tight truncate">{user.name}</p>
            </div>
          </div>
          <p className="text-[11px] text-ink-muted leading-tight truncate mt-2 pl-0.5">
            {user.locality} · {user.county}
          </p>
        </Link>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto" aria-label="Navigare principală">
        <ul className="space-y-0.5">
          {items.map(item => {
            const active = isNavActive(item.href, pathname, root)
            const Icon = item.icon
            const showBadge = item.href === '/apicultor/alerte' && unread > 0
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative flex items-center gap-3 h-10 px-3 rounded-lg text-[14px] font-medium transition-colors ${active
                    ? 'bg-purple/10 text-purple'
                    : 'text-ink-soft hover:bg-hair-soft hover:text-ink'
                    }`}
                >
                  {active && (
                    <span aria-hidden className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-purple" />
                  )}
                  <Icon size={18} aria-hidden className={active ? 'text-purple' : 'text-ink-muted'} />
                  <span className="flex-1 truncate">{item.label}</span>
                  {showBadge && (
                    <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-alert text-white text-[10px] font-bold flex items-center justify-center leading-none">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer: settings + logout */}
      <div className="px-3 py-3 border-t border-hair-soft space-y-0.5">
        <Link
          href="/setari"
          aria-current={pathname === '/setari' ? 'page' : undefined}
          className={`flex items-center gap-3 h-10 px-3 rounded-lg text-[14px] font-medium transition-colors ${pathname === '/setari'
            ? 'bg-purple/10 text-purple'
            : 'text-ink-soft hover:bg-hair-soft hover:text-ink'
            }`}
        >
          <SettingsIcon size={18} aria-hidden className={pathname === '/setari' ? 'text-purple' : 'text-ink-muted'} />
          <span className="flex-1">Setări</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 h-10 px-3 rounded-lg text-[14px] font-medium text-ink-soft hover:bg-hair-soft hover:text-ink transition-colors w-full text-left"
        >
          <LogOut size={18} aria-hidden className="text-ink-muted" />
          <span>Ieși din cont</span>
        </button>
      </div>
    </aside>
  )
}
