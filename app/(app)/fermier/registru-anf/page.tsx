'use client'
import { api } from '@/lib/api/client'
import { useState } from 'react'
import { Download } from 'lucide-react'

export default function RegistruAnfPage() {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    setLoading(true)
    try {
      // Trigger PDF download
      window.open('/api/v1/spray-reports/anf-export', '_blank')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 py-4">
      <h1 className="text-xl font-bold text-ink mb-2">Registru ANF</h1>
      <p className="text-ink-muted text-sm mb-6">Exportă registrul de stropiri pentru ultimii 3 ani, cu verificare blockchain.</p>
      <button
        onClick={handleExport}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 h-14 bg-purple text-white font-bold rounded-2xl disabled:opacity-50"
      >
        <Download size={20} />
        {loading ? 'Se generează...' : 'Descarcă registrul PDF'}
      </button>
    </div>
  )
}
