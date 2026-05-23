'use client'
import { useMe } from '@/lib/api/queries'
import type { User } from '@/lib/api/types'

export function useAuth(): {
  user: User | undefined
  isLoading: boolean
  isAuthenticated: boolean
} {
  const { data, isLoading } = useMe()
  return {
    user: data?.user,
    isLoading,
    isAuthenticated: !!data?.user,
  }
}
