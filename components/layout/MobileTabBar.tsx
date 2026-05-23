'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Layers, Bell, User, MapPin, FileText, AlertTriangle } from 'lucide-react'
import type { Role } from '@/lib/api/types'

const TABS: Record<Role, { href: string; icon: React.ReactNode; label: string }[]> = {
  apicultor: [
    { href: '/apicultor', icon: <Home size={22} />, label: 'Acasă' },
    { href: '/apicultor/stupine', icon: <Layers size={22} />, label: 'Stupine' },
    { href: '/apicultor/alerte', icon: <Bell size={22} />, label: 'Alerte' },
    { href: '/setari', icon: <User size={22} />, label: 'Profil' },
  ],
  fermier: [
    { href: '/fermier', icon: <Home size={22} />, label: 'Acasă' },
    { href: '/fermier/parcele', icon: <Layers size={22} />, label: 'Parcele' },
    { href: '/fermier/rapoarte', icon: <FileText size={22} />, label: 'Rapoarte' },
    { href: '/setari', icon: <User size={22} />, label: 'Profil' },
  ],
  inspector: [
    { href: '/inspector', icon: <Home size={22} />, label: 'Acasă' },
    { href: '/inspector/harta', icon: <MapPin size={22} />, label: 'Hartă' },
    { href: '/inspector/pagube', icon: <AlertTriangle size={22} />, label: 'Pagube' },
    { href: '/setari', icon: <User size={22} />, label: 'Profil' },
  ],
}

export function MobileTabBar({ role }: { role: Role }) {
  const pathname = usePathname()
  const tabs = TABS[role]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-hair pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Navigare principală"
    >
      <div className="flex items-stretch max-w-lg mx-auto">
        {tabs.map(tab => {
          const isActive = pathname === tab.href || (tab.href !== `/${role}` && pathname.startsWith(tab.href))
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] transition-colors ${
                isActive ? 'text-purple' : 'text-ink-muted hover:text-ink-soft'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active indicator bar at top */}
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-0.5 rounded-full bg-purple"
                  aria-hidden
                />
              )}
              <span className={`transition-transform ${isActive ? 'scale-110' : ''}`}>
                {tab.icon}
              </span>
              <span className={`text-[10px] leading-none ${isActive ? 'font-bold text-purple' : 'font-medium'}`}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
