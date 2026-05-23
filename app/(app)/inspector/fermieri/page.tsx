'use client'
import { useState } from 'react'
import { useFarmers } from '@/lib/api/queries'
import { Spinner } from '@/components/feedback/Spinner'
import { ChevronRight, User } from 'lucide-react'

export default function FermieriPage() {
  const { data, isLoading } = useFarmers()
  const farmers = (data?.items ?? []) as { id: string; full_name: string; locality: string; county: string }[]
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const filtered = q
    ? farmers.filter(
        f =>
          f.full_name.toLowerCase().includes(q) ||
          f.locality.toLowerCase().includes(q),
      )
    : farmers

  return (
    <div className="px-4 md:px-6 lg:px-8 py-4">
      <h1 className="text-xl font-bold text-ink mb-4">Fermieri</h1>
      <input
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Caută după nume sau localitate..."
        className="w-full lg:max-w-md h-10 px-3 rounded-lg border border-hair bg-white text-sm mb-4"
      />
      {isLoading ? (
        <Spinner size="md" className="py-8 mx-auto" />
      ) : filtered.length === 0 ? (
        <p className="text-ink-muted text-sm py-8 text-center">Niciun rezultat</p>
      ) : (
        <ul role="list" className="space-y-3 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-3 lg:space-y-0">
          {filtered.map(f => (
            <li role="listitem" key={f.id} className="bg-white rounded-2xl p-4 mb-2 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-hair-soft flex items-center justify-center">
                <User size={18} className="text-ink-muted" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-ink">{f.full_name}</p>
                <p className="text-sm text-ink-muted">{f.locality}, {f.county}</p>
              </div>
              <ChevronRight size={16} className="text-ink-muted" />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
