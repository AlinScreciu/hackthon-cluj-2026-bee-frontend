'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { TopBar } from './TopBar'
import { MobileTabBar } from './MobileTabBar'
import { SpinnerPage } from '@/components/feedback/Spinner'

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login')
    }
  }, [isLoading, user, router])

  if (isLoading) return <SpinnerPage />
  if (!user) return null

  return (
    <div className="min-h-screen bg-cream">
      <TopBar user={user} />
      <main id="main-content" className="pb-24 md:pb-8 max-w-lg md:max-w-3xl mx-auto">
        {children}
      </main>
      <MobileTabBar role={user.role} />
    </div>
  )
}
