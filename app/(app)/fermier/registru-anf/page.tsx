'use client'
import { useState } from 'react'
import { Download } from 'lucide-react'
import { useANFExport } from '@/lib/api/queries'
import { ApiError } from '@/lib/api/client'

function threeYearsAgoISO() {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 3)
  return d.toISOString().slice(0, 10)
}

// Upper bound includes scheduled-future sprays: ANF reports are filed BEFORE
// application, so most fermier entries have scheduled_at in the near future.
// One year ahead is comfortably wider than any realistic planning window.
function oneYearAheadISO() {
  const d = new Date()
  d.setFullYear(d.getFullYear() + 1)
  return d.toISOString().slice(0, 10)
}

export default function RegistruAnfPage() {
  const anfExport = useANFExport()
  const [error, setError] = useState('')

  async function handleExport() {
    setError('')
    try {
      // farmer_id omitted — BE auto-scopes to the authenticated fermier
      await anfExport.mutateAsync({ from: threeYearsAgoISO(), to: oneYearAheadISO() })
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Nu s-a putut genera PDF-ul. Reîncearcă.'
      setError(msg)
    }
  }

  return (
    <div className="px-4 md:px-6 lg:px-8 py-4">
      <h1 className="text-xl font-bold text-ink mb-2">Registru ANF</h1>
      <p className="text-ink-muted text-sm mb-6">Exportă registrul de stropiri pentru ultimii 3 ani, cu verificare blockchain.</p>

      {error && (
        <p role="alert" className="text-[13px] text-alert bg-alert/10 rounded-xl px-4 py-3 mb-4">{error}</p>
      )}

      <button
        onClick={handleExport}
        disabled={anfExport.isPending}
        aria-label="Descarcă registrul ANF în format PDF"
        className="w-full flex items-center justify-center gap-2 h-14 bg-purple text-white font-bold rounded-2xl disabled:opacity-50 transition-opacity"
      >
        <Download size={20} />
        {anfExport.isPending ? 'Se generează...' : 'Descarcă registrul PDF'}
      </button>
    </div>
  )
}
