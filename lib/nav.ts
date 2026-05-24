import { Home, Layers, Bell, User, MapPin, FileText, AlertTriangle, Users, Settings, LogOut, FileBarChart } from 'lucide-react'
import type { ComponentType } from 'react'
import type { Role } from '@/lib/api/types'

export type NavItem = {
  href: string
  icon: ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  label: string
}

export const PRIMARY_NAV_BY_ROLE: Record<Role, NavItem[]> = {
  apicultor: [
    { href: '/apicultor', icon: Home, label: 'Acasă' },
    { href: '/apicultor/stupine', icon: Layers, label: 'Stupine' },
    { href: '/apicultor/alerte', icon: Bell, label: 'Alerte' },
    { href: '/apicultor/daune', icon: AlertTriangle, label: 'Daune' },
  ],
  fermier: [
    { href: '/fermier', icon: Home, label: 'Acasă' },
    { href: '/fermier/parcele', icon: Layers, label: 'Parcele' },
    { href: '/fermier/rapoarte', icon: FileText, label: 'Rapoarte' },
    { href: '/fermier/registru-anf', icon: FileBarChart, label: 'Registru ANF' },
  ],
  inspector: [
    { href: '/inspector', icon: Home, label: 'Acasă' },
    { href: '/inspector/harta', icon: MapPin, label: 'Hartă' },
    { href: '/inspector/fermieri', icon: Users, label: 'Fermieri' },
    { href: '/inspector/pagube', icon: AlertTriangle, label: 'Pagube' },
  ],
}

export const MOBILE_NAV_BY_ROLE: Record<Role, NavItem[]> = {
  apicultor: [
    { href: '/apicultor', icon: Home, label: 'Acasă' },
    { href: '/apicultor/stupine', icon: Layers, label: 'Stupine' },
    { href: '/apicultor/alerte', icon: Bell, label: 'Alerte' },
    { href: '/apicultor/daune', icon: AlertTriangle, label: 'Daune' },
    { href: '/setari', icon: User, label: 'Profil' },
  ],
  fermier: [
    { href: '/fermier', icon: Home, label: 'Acasă' },
    { href: '/fermier/parcele', icon: Layers, label: 'Parcele' },
    { href: '/fermier/rapoarte', icon: FileText, label: 'Rapoarte' },
    { href: '/setari', icon: User, label: 'Profil' },
  ],
  inspector: [
    { href: '/inspector', icon: Home, label: 'Acasă' },
    { href: '/inspector/harta', icon: MapPin, label: 'Hartă' },
    { href: '/inspector/pagube', icon: AlertTriangle, label: 'Pagube' },
    { href: '/setari', icon: User, label: 'Profil' },
  ],
}

export const SECONDARY_NAV: NavItem[] = [
  { href: '/setari', icon: Settings, label: 'Setări' },
]

export function isNavActive(itemHref: string, pathname: string, roleRoot: string): boolean {
  if (pathname === itemHref) return true
  if (itemHref === roleRoot) return false
  return pathname.startsWith(itemHref)
}

const PAGE_TITLE_RULES: { match: RegExp; title: string }[] = [
  { match: /^\/apicultor$/, title: 'Acasă' },
  { match: /^\/apicultor\/stupine$/, title: 'Stupinele tale' },
  { match: /^\/apicultor\/stupine\/nou$/, title: 'Stupină nouă' },
  { match: /^\/apicultor\/stupine\/[^/]+$/, title: 'Detaliu stupină' },
  { match: /^\/apicultor\/alerte$/, title: 'Alertele tale' },
  { match: /^\/apicultor\/alerte\/[^/]+$/, title: 'Alertă' },
  { match: /^\/apicultor\/daune$/, title: 'Daunele tale' },
  { match: /^\/apicultor\/daune\/nou$/, title: 'Pagubă nouă' },
  { match: /^\/apicultor\/daune\/[^/]+$/, title: 'Detaliu pagubă' },
  { match: /^\/fermier$/, title: 'Acasă' },
  { match: /^\/fermier\/parcele$/, title: 'Parcelele tale' },
  { match: /^\/fermier\/parcele\/[^/]+$/, title: 'Detaliu parcelă' },
  { match: /^\/fermier\/rapoarte$/, title: 'Rapoarte stropire' },
  { match: /^\/fermier\/rapoarte\/[^/]+$/, title: 'Detaliu raport' },
  { match: /^\/fermier\/raport-nou$/, title: 'Raport stropire nouă' },
  { match: /^\/fermier\/registru-anf$/, title: 'Registru ANF' },
  { match: /^\/inspector$/, title: 'Acasă' },
  { match: /^\/inspector\/harta$/, title: 'Hartă teritoriu' },
  { match: /^\/inspector\/fermieri$/, title: 'Fermieri' },
  { match: /^\/inspector\/pagube$/, title: 'Pagube' },
  { match: /^\/setari$/, title: 'Setări' },
]

export function getPageTitle(pathname: string): string {
  for (const rule of PAGE_TITLE_RULES) {
    if (rule.match.test(pathname)) return rule.title
  }
  return ''
}

export const ROLE_PILL: Record<Role, { bg: string; fg: string; label: string }> = {
  apicultor: { bg: '#40288C', fg: '#FFFFFF', label: 'Apicultor' },
  fermier: { bg: '#EEA727', fg: '#1a1a1a', label: 'Fermier' },
  inspector: { bg: '#DC2626', fg: '#FFFFFF', label: 'ANF' },
}

export const ROLE_ROOT: Record<Role, string> = {
  apicultor: '/apicultor',
  fermier: '/fermier',
  inspector: '/inspector',
}

export { LogOut, User, Settings }
