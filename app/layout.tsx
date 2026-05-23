import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'sonner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Beelive',
  description: 'Sistem de alertă pentru apicultori și fermieri — Cluj Hackathon 2026',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#40288C',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={inter.variable}>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-purple focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
        >
          Sari la conținut principal
        </a>
        <Providers>
          {children}
        </Providers>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: 'var(--font-sans)',
              borderRadius: '12px',
            },
          }}
        />
      </body>
    </html>
  )
}
