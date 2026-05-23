'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MOBILE_NAV_BY_ROLE, ROLE_ROOT, isNavActive } from '@/lib/nav'
import type { Role } from '@/lib/api/types'

export function MobileTabBar({ role }: { role: Role }) {
  const pathname = usePathname()
  const tabs = MOBILE_NAV_BY_ROLE[role]
  const root = ROLE_ROOT[role]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-hair pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Navigare principală"
    >
      <div className="flex items-stretch max-w-lg mx-auto">
        {tabs.map(tab => {
          const active = isNavActive(tab.href, pathname, root)
          const Icon = tab.icon
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] transition-colors ${
                active ? 'text-purple' : 'text-ink-muted hover:text-ink-soft'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              {active && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-0.5 rounded-full bg-purple"
                  aria-hidden
                />
              )}
              <span className={`transition-transform ${active ? 'scale-110' : ''}`} aria-hidden>
                <Icon size={22} aria-hidden />
              </span>
              <span className={`text-[10px] leading-none ${active ? 'font-bold text-purple' : 'font-medium'}`}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
