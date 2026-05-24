'use client'
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { ApiError } from '@/lib/api/client'

// If a query/mutation gets 401 from the API while the user is supposedly logged
// in, the session has vanished server-side. Hard-redirect to /login with the
// current path preserved so re-login lands them back where they were. Skip for
// the auth endpoints themselves — wrong-password errors stay local to that form.
function handle401(error: unknown) {
  if (typeof window === 'undefined') return
  if (!(error instanceof ApiError) || error.status !== 401) return
  const path = window.location.pathname
  if (path.startsWith('/login') || path.startsWith('/2fa')) return
  const redirect = path && path !== '/' ? `?redirect=${encodeURIComponent(path + window.location.search)}` : ''
  window.location.assign(`/login${redirect}`)
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({ onError: handle401 }),
        mutationCache: new MutationCache({ onError: handle401 }),
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
