'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, ApiError } from '@/lib/api/client'
import { t } from '@/lib/i18n'
import { Button } from '@/components/ui/Button'
import { BeeLogo } from '@/components/ui/BeeLogo'

export default function LoginPage() {
  const router = useRouter()
  const [cnp, setCnp] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api.post<{ challenge_id: string; method: string; masked_destination: string }>(
        '/auth/login',
        { cnp, password }
      )
      router.push(`/2fa?challenge_id=${data.challenge_id}&dest=${encodeURIComponent(data.masked_destination)}&method=${data.method}`)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(t.login.errors[err.code as keyof typeof t.login.errors] ?? t.login.errors.internal)
      } else {
        setError(t.login.errors.internal)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-4 relative overflow-hidden">
      {/* Honeycomb overlay */}
      <div
        className="absolute inset-0 pointer-events-none honeycomb-bg opacity-[0.035]"
        aria-hidden
        style={{ backgroundColor: 'transparent' }}
      />

      <div className="w-full max-w-sm relative z-10">
        {/* Brand + mascot */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <BeeLogo size={72} aria-hidden />
          </div>
          <h1 className="text-[22px] font-bold text-ink tracking-[-0.02em]">Beelive</h1>
          <p className="text-ink-muted mt-1 text-[13.5px]">{t.login.subtitle}</p>
          <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-purple mt-2 mb-1">ROeID · Pasul 1</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_32px_rgba(77,43,140,0.10)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="cnp" className="block text-[12px] font-semibold text-ink-soft mb-1.5 tracking-[0.02em] uppercase">
                {t.login.cnpLabel}
              </label>
              <input
                id="cnp"
                type="text"
                inputMode="numeric"
                value={cnp}
                onChange={e => setCnp(e.target.value.replace(/\D/g, '').slice(0, 13))}
                placeholder={t.login.cnpPlaceholder}
                maxLength={13}
                className="w-full h-12 px-4 rounded-[12px] border-[1.5px] border-hair bg-white text-ink text-[14px] placeholder:text-ink-muted focus:outline-none focus:border-purple transition-colors"
                aria-required="true"
                aria-describedby={error ? 'login-error' : undefined}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[12px] font-semibold text-ink-soft mb-1.5 tracking-[0.02em] uppercase">
                {t.login.passwordLabel}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 px-4 rounded-[12px] border-[1.5px] border-hair bg-white text-ink text-[14px] placeholder:text-ink-muted focus:outline-none focus:border-purple transition-colors"
                aria-required="true"
              />
            </div>

            {error && (
              <p id="login-error" role="alert" className="text-sm text-alert font-medium">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={loading || cnp.length !== 13 || !password}
              className="mt-2"
            >
              {t.login.submit}
            </Button>
          </form>
        </div>

        {process.env.NODE_ENV !== 'production' && (
          <p className="text-center text-[11px] text-ink-muted mt-5 leading-relaxed">
            Date de test: CNP <code className="font-mono bg-hair-soft px-1 rounded">1900101400001</code> / parolă <code className="font-mono bg-hair-soft px-1 rounded">test1234</code><br />
            Roluri: <code className="font-mono">...400001</code>=apicultor · <code className="font-mono">...400002</code>=fermier · <code className="font-mono">...400003</code>=inspector
          </p>
        )}
      </div>
    </div>
  )
}
