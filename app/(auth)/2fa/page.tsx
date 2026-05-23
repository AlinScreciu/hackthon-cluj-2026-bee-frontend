'use client'
import { Suspense, useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api, ApiError } from '@/lib/api/client'
import type { User } from '@/lib/api/types'
import { t } from '@/lib/i18n'
import { BeeLogo } from '@/components/ui/BeeLogo'

function TwoFAForm() {
  const router = useRouter()
  const params = useSearchParams()
  const challengeId = params.get('challenge_id') ?? ''
  const dest = params.get('dest') ?? '••'
  const initialMethod = (params.get('method') ?? 'push') as 'push' | 'sms' | 'email'

  const [digits, setDigits] = useState<string[]>(Array(6).fill(''))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [method, setMethod] = useState(initialMethod)
  const [switchingMethod, setSwitchingMethod] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null))
  const submitRef = useRef<HTMLButtonElement | null>(null)

  const code = digits.join('')

  // Focus first box on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  // Auto-submit when all 6 digits filled
  useEffect(() => {
    if (code.length === 6 && !loading) {
      submitRef.current?.click()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  function handleDigitChange(idx: number, val: string) {
    const digit = val.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[idx] = digit
    setDigits(next)
    if (digit && idx < 5) {
      inputRefs.current[idx + 1]?.focus()
    }
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && idx > 0) inputRefs.current[idx - 1]?.focus()
    if (e.key === 'ArrowRight' && idx < 5) inputRefs.current[idx + 1]?.focus()
  }

  function handlePaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (text.length > 0) {
      const next = [...Array(6).fill('')]
      text.split('').forEach((c, i) => { next[i] = c })
      setDigits(next)
      const focusIdx = Math.min(text.length, 5)
      inputRefs.current[focusIdx]?.focus()
      e.preventDefault()
    }
  }

  async function handleSubmit(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault()
    if (code.length !== 6 || loading) return
    setError('')
    setLoading(true)
    try {
      const data = await api.post<{ user: User }>('/auth/2fa/verify', { challenge_id: challengeId, code })
      router.replace(`/${data.user.role}`)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(t.twoFa.errors[err.code as keyof typeof t.twoFa.errors] ?? 'Eroare de verificare.')
      } else {
        setError('Eroare de verificare. Reîncearcă.')
      }
      setDigits(Array(6).fill(''))
      setTimeout(() => inputRefs.current[0]?.focus(), 0)
    } finally {
      setLoading(false)
    }
  }

  async function switchMethod(newMethod: 'sms' | 'email') {
    if (switchingMethod || newMethod === method) return
    setSwitchingMethod(true)
    try {
      await api.post('/auth/2fa/method', { challenge_id: challengeId, method: newMethod })
      setMethod(newMethod)
      setDigits(Array(6).fill(''))
      setTimeout(() => inputRefs.current[0]?.focus(), 0)
    } catch {
      // ignore
    } finally {
      setSwitchingMethod(false)
    }
  }

  const methodLabel = method === 'sms' ? 'SMS' : method === 'email' ? 'Email' : 'notificarea push'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="w-full max-w-sm relative z-10">
        {/* Brand + mascot */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <BeeLogo size={64} aria-hidden />
          </div>
          <p className="text-[11.5px] font-bold uppercase tracking-[0.06em] text-purple mb-2">
            ROeID · Pasul 2
          </p>
          <h1 className="text-[22px] font-bold text-ink tracking-[-0.02em]">Verificăm că ești tu</h1>
          <p className="text-ink-muted mt-1 text-[13.5px]">
            Ți-am trimis un cod în {methodLabel}.
          </p>
          <p className="text-[12px] text-ink-muted mt-0.5">Apare aici automat în câteva secunde.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_32px_rgba(64,40,140,0.10)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 6 OTP boxes */}
            <div
              className="flex gap-2 justify-center"
              role="group"
              aria-label="Cod de verificare"
              onPaste={handlePaste}
            >
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={e => handleDigitChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  aria-label={`Cifra ${i + 1}`}
                  autoComplete={i === 0 ? 'one-time-code' : 'off'}
                  className="w-[42px] h-[52px] text-center text-xl font-bold font-mono rounded-[10px] border-2 border-purple/30 bg-white text-ink focus:outline-none focus:border-purple focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-1 transition-colors"
                  style={{
                    animationDelay: `${i * 60}ms`,
                    animation: 'casc-in 0.35s ease-out both',
                  }}
                />
              ))}
            </div>

            {/* Method switch links */}
            <div className="flex items-center justify-center gap-5">
              <button
                type="button"
                onClick={() => switchMethod('sms')}
                disabled={switchingMethod || method === 'sms'}
                className="text-[13px] font-semibold text-purple hover:text-purple-soft transition-colors disabled:opacity-40"
              >
                Trimite prin SMS
              </button>
              <button
                type="button"
                onClick={() => switchMethod('email')}
                disabled={switchingMethod || method === 'email'}
                className="text-[13px] font-semibold text-purple hover:text-purple-soft transition-colors disabled:opacity-40"
              >
                Trimite prin Email
              </button>
            </div>

            {error && (
              <p id="twofa-error" role="alert" className="text-sm text-alert font-medium text-center">
                {error}
              </p>
            )}

            {/* Hidden submit button for auto-submit ref */}
            <button
              ref={submitRef}
              type="submit"
              className="sr-only"
              aria-hidden
              tabIndex={-1}
            />

            {/* Loading indicator */}
            {loading && (
              <div className="flex items-center justify-center gap-2 py-1">
                <span
                  className="w-4 h-4 rounded-full border-2 border-purple border-t-transparent"
                  style={{ animation: 'spin 0.7s linear infinite' }}
                  aria-label="Se verifică…"
                />
                <span className="text-[13px] text-ink-muted">Se verifică…</span>
              </div>
            )}
          </form>
        </div>

        {/* Back link */}
        <button
          onClick={() => router.back()}
          className="block w-full text-center text-[12px] text-ink-muted mt-4 hover:text-ink-soft transition-colors"
        >
          ← Înapoi la autentificare
        </button>

        {/* CNP info bar */}
        <div
          className="mt-4 rounded-[10px] px-4 py-2.5 flex items-center justify-between gap-2"
          style={{ background: 'rgba(255,239,95,0.35)', border: '1px solid rgba(238,167,39,0.25)' }}
        >
          <span className="text-[11px] text-ink-soft font-mono">CNP {dest}</span>
          <span className="text-[10px] font-semibold text-ink-muted uppercase tracking-[0.04em]">sesiune ROeID</span>
        </div>

        <p className="text-center text-[11px] text-ink-muted mt-3">
          Orice cod din 6 cifre funcționează în modul demo.
        </p>
      </div>
    </div>
  )
}

export default function TwoFAPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-ink-muted text-sm">Se încarcă...</p>
      </div>
    }>
      <TwoFAForm />
    </Suspense>
  )
}
