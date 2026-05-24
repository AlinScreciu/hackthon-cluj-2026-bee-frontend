'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { TopBar } from './TopBar'
import { MobileTabBar } from './MobileTabBar'
import { Sidebar } from './Sidebar'
import { SpinnerPage } from '@/components/feedback/Spinner'

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      const redirect = pathname && pathname !== '/' ? `?redirect=${encodeURIComponent(pathname)}` : ''
      router.replace(`/login${redirect}`)
      return
    }
    // Role guard: each role's pages call role-locked endpoints (e.g.
    // /fermier/* hits /parcels which 403s for apicultors). Silently
    // bounce wrong-role users to their own dashboard instead of letting
    // them stare at a half-broken form.
    if (!isLoading && user && pathname) {
      const roleRoot = '/' + user.role
      const onOwnArea = pathname === roleRoot || pathname.startsWith(`${roleRoot}/`) || pathname.startsWith('/setari')
      if (!onOwnArea) {
        router.replace(roleRoot)
      }
    }
  }, [isLoading, user, router, pathname])

  if (isLoading) return <SpinnerPage />
  if (!user) return null

  return (
    <div className="min-h-screen">
      <Sidebar user={user} />
      <div className="lg:pl-[220px]">
        <TopBar user={user} />
        <main
          id="main-content"
          className="pb-24 md:pb-8 max-w-lg md:max-w-3xl lg:max-w-7xl mx-auto"
        >
          {children}
        </main>
      </div>
      <MobileTabBar role={user.role} />
    </div>
  )
}
