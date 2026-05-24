'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useFarmers } from '@/lib/api/queries'
import { Spinner } from '@/components/feedback/Spinner'
import { ChevronRight, User } from 'lucide-react'

export default function FermieriPage() {
  const { data, isLoading } = useFarmers()
  const farmers = data?.items ?? []
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
            <li role="listitem" key={f.id}>
              <Link
                href={`/inspector/fermieri/${f.id}`}
                className="bg-white rounded-2xl p-4 mb-2 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow"
                aria-label={`Vezi detalii fermier ${f.full_name} din ${f.locality}`}
              >
                <div className="w-10 h-10 rounded-full bg-hair-soft flex items-center justify-center shrink-0">
                  <User size={18} className="text-ink-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink truncate">{f.full_name}</p>
                  <p className="text-sm text-ink-muted truncate">{f.locality}, {f.county}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span
                      className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(238,167,39,0.15)', color: '#92400E' }}
                    >
                      {f.spray_count} {f.spray_count === 1 ? 'stropire' : 'stropiri'}
                    </span>
                    <span
                      className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded"
                      style={{
                        background: f.damage_count > 0 ? 'rgba(220,38,38,0.12)' : '#F1F0F4',
                        color: f.damage_count > 0 ? '#991B1B' : '#7A6F90',
                      }}
                    >
                      {f.damage_count} {f.damage_count === 1 ? 'pagubă' : 'pagube'}
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-ink-muted shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
