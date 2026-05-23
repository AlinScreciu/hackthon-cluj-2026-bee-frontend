'use client'
import { useAuth } from '@/lib/hooks/useAuth'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api/client'
import { Spinner } from '@/components/feedback/Spinner'
import { LogOut, User, Bell, Shield, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export default function SetariPage() {
  const { user, isLoading } = useAuth()
  const qc = useQueryClient()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    if (!confirm('Sigur vrei să ieși din cont?')) return
    setLoggingOut(true)
    try {
      await api.post('/auth/logout')
      qc.clear()
      router.replace('/login')
    } catch {
      setLoggingOut(false)
    }
  }

  const ROLE_LABELS: Record<string, string> = {
    apicultor: 'Apicultor', fermier: 'Fermier', inspector: 'Inspector ANF'
  }

  if (isLoading) return <Spinner size="lg" className="py-12 mx-auto" />

  return (
    <div className="px-4 md:px-6 lg:px-8 py-4 space-y-4">
      <h1 className="text-xl font-bold text-ink">Profil și setări</h1>

      {user && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-purple/10 flex items-center justify-center">
              <User size={28} className="text-purple" />
            </div>
            <div>
              <p className="font-bold text-ink text-lg">{user.full_name}</p>
              <p className="text-ink-muted text-sm">{ROLE_LABELS[user.role]}</p>
              <p className="text-ink-muted text-xs">{user.locality}, {user.county}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm text-ink-soft">
            <p><span className="text-ink-muted">Email:</span> {user.email}</p>
            <p><span className="text-ink-muted">Telefon:</span> {user.phone}</p>
          </div>
        </div>
      )}

      {/* Notification preferences */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-hair-soft">
          <Bell size={18} className="text-purple shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-ink">Notificări</p>
            <p className="text-[12px] text-ink-muted">Push, SMS și apeluri de alertă</p>
          </div>
          <ChevronRight size={16} className="text-ink-muted" />
        </div>
        <div className="flex items-center gap-3 px-5 py-4">
          <Shield size={18} className="text-purple shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-ink">Securitate</p>
            <p className="text-[12px] text-ink-muted">2FA, sesiuni active</p>
          </div>
          <ChevronRight size={16} className="text-ink-muted" />
        </div>
      </div>

      <button
        onClick={handleLogout}
        disabled={loggingOut}
        aria-label="Ieși din contul Beelive"
        className="w-full flex items-center justify-center gap-2 h-12 bg-white text-alert border border-alert/30 font-semibold rounded-xl shadow-sm disabled:opacity-50 transition-opacity"
      >
        {loggingOut ? (
          <span className="w-4 h-4 rounded-full border-2 border-alert border-t-transparent animate-spin" />
        ) : (
          <LogOut size={18} />
        )}
        {loggingOut ? 'Se deconectează...' : 'Ieși din cont'}
      </button>
    </div>
  )
}
