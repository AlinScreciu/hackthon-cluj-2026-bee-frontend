'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { api } from '@/lib/api/client'
import { ChevronLeft } from 'lucide-react'

export default function NoaStupinePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [hiveCount, setHiveCount] = useState('10')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/apiaries', {
        name, hive_count: parseInt(hiveCount), type: 'permanent',
        lat: 46.77, lng: 23.59, start_date: new Date().toISOString().split('T')[0],
      })
      router.push('/apicultor/stupine')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 py-4">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-purple text-sm font-medium mb-4">
        <ChevronLeft size={18} /> Înapoi
      </button>
      <h1 className="text-xl font-bold text-ink mb-6">Stupină nouă</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-2xl p-5 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-ink-soft mb-1">Nume stupină</label>
          <input value={name} onChange={e => setName(e.target.value)} required
            className="w-full h-12 px-4 rounded-xl border border-hair bg-white text-ink focus:outline-none focus:ring-2 focus:ring-purple" />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-soft mb-1">Număr stupi</label>
          <input type="number" value={hiveCount} onChange={e => setHiveCount(e.target.value)} required min="1"
            className="w-full h-12 px-4 rounded-xl border border-hair bg-white text-ink focus:outline-none focus:ring-2 focus:ring-purple" />
        </div>
        <button type="submit" disabled={loading || !name}
          className="w-full h-12 bg-purple text-white font-semibold rounded-xl disabled:opacity-50">
          {loading ? 'Se salvează...' : 'Înregistrează stupina'}
        </button>
      </form>
    </div>
  )
}
