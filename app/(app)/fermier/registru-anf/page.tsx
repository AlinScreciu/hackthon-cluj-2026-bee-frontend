'use client'
import { useState } from 'react'
import { Download } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api/v1'

export default function RegistruAnfPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleExport() {
    setLoading(true)
    setError('')
    try {
      window.open(`${API_BASE}/spray-reports/anf-export`, '_blank')
    } catch {
      setError('Nu s-a putut genera PDF-ul. Reîncearcă.')
    } finally {
      setLoading(false)
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
        disabled={loading}
        aria-label="Descarcă registrul ANF în format PDF"
        className="w-full flex items-center justify-center gap-2 h-14 bg-purple text-white font-bold rounded-2xl disabled:opacity-50 transition-opacity"
      >
        <Download size={20} />
        {loading ? 'Se generează...' : 'Descarcă registrul PDF'}
      </button>
    </div>
  )
}
