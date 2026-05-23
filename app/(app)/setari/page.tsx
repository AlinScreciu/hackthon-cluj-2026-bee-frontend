'use client'
import { useAuth } from '@/lib/hooks/useAuth'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api/client'
import { LogOut, User, Bell, Shield } from 'lucide-react'

export default function SetariPage() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const router = useRouter()

  async function handleLogout() {
    await api.post('/auth/logout')
    qc.clear()
    router.replace('/login')
  }

  const ROLE_LABELS: Record<string, string> = {
    apicultor: 'Apicultor', fermier: 'Fermier', inspector: 'Inspector ANF'
  }

  return (
    <div className="px-4 py-4 space-y-4">
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

      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 h-12 bg-white text-alert border border-alert/30 font-semibold rounded-xl shadow-sm"
      >
        <LogOut size={18} />
        Ieși din cont
      </button>
    </div>
  )
}
