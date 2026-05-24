'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Loader2, Check, X, Plus, RotateCw } from 'lucide-react'
import { toast } from 'sonner'
import { useSignUpload } from '@/lib/api/queries'
import { api } from '@/lib/api/client'

const ALLOWED_MIME = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_BYTES = 10 * 1024 * 1024 // 10 MiB

type Status = 'uploading' | 'done' | 'error'

interface UploadItem {
  id: string
  file: File
  previewUrl: string
  status: Status
  key?: string
}

interface PhotoUploaderProps {
  onKeysChange: (keys: string[]) => void
  maxFiles?: number
}

export function PhotoUploader({ onKeysChange, maxFiles = 5 }: PhotoUploaderProps) {
  const [items, setItems] = useState<UploadItem[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const signUpload = useSignUpload()

  // Keep onKeysChange in a ref so the upload effect doesn't restart when the
  // parent passes a non-memoized callback.
  const onKeysChangeRef = useRef(onKeysChange)
  useEffect(() => {
    onKeysChangeRef.current = onKeysChange
  }, [onKeysChange])

  // Emit the current set of completed keys whenever items change.
  useEffect(() => {
    const keys = items.filter(it => it.status === 'done' && it.key).map(it => it.key as string)
    onKeysChangeRef.current(keys)
  }, [items])

  // Revoke object URLs on unmount to avoid leaking blob references.
  useEffect(() => {
    return () => {
      items.forEach(it => URL.revokeObjectURL(it.previewUrl))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const uploadOne = useCallback(async (item: UploadItem) => {
    try {
      const signed = await signUpload.mutateAsync({
        filename: item.file.name,
        mime: item.file.type,
        byte_size: item.file.size,
      })
      await api.rawPut(signed.upload_url, item.file, item.file.type)
      setItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'done', key: signed.key } : it))
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload eșuat.'
      toast.error(msg)
      setItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'error' } : it))
    }
  }, [signUpload])

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files)
    setItems(prev => {
      const remaining = Math.max(0, maxFiles - prev.length)
      if (remaining === 0) {
        toast.error(`Maxim ${maxFiles} poze.`)
        return prev
      }
      const accepted: UploadItem[] = []
      let rejectedCount = 0
      for (const file of arr.slice(0, remaining)) {
        if (!ALLOWED_MIME.includes(file.type)) {
          toast.error(`Format invalid: ${file.name} (acceptate: JPG, PNG, WebP).`)
          rejectedCount++
          continue
        }
        if (file.size > MAX_BYTES) {
          toast.error(`Fișier prea mare: ${file.name} (max 10 MiB).`)
          rejectedCount++
          continue
        }
        accepted.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          file,
          previewUrl: URL.createObjectURL(file),
          status: 'uploading',
        })
      }
      if (arr.length > remaining + rejectedCount) {
        toast.error(`Doar ${remaining} poze adăugate (limită ${maxFiles}).`)
      }
      // Kick off uploads asynchronously
      accepted.forEach(it => { void uploadOne(it) })
      return [...prev, ...accepted]
    })
  }, [maxFiles, uploadOne])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (files && files.length > 0) {
      addFiles(files)
    }
    // Reset so the same file can be re-selected after removal.
    e.target.value = ''
  }

  function removeItem(id: string) {
    setItems(prev => {
      const target = prev.find(it => it.id === id)
      if (target) URL.revokeObjectURL(target.previewUrl)
      return prev.filter(it => it.id !== id)
    })
  }

  function retryItem(id: string) {
    setItems(prev => {
      const target = prev.find(it => it.id === id)
      if (!target) return prev
      const updated = prev.map(it => it.id === id ? { ...it, status: 'uploading' as Status } : it)
      // Fire retry off the new state's snapshot.
      void uploadOne({ ...target, status: 'uploading' })
      return updated
    })
  }

  const canAdd = items.length < maxFiles

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleInputChange}
        className="hidden"
        aria-label="Adaugă poze"
      />

      {items.length > 0 && (
        <ul className="flex gap-2 overflow-x-auto pb-2" role="list">
          {items.map(it => (
            <li key={it.id} className="relative shrink-0" role="listitem">
              <div className="w-20 h-20 rounded-[10px] overflow-hidden bg-hair-soft border border-hair relative">
                {/* Object URL previews aren't compatible with next/image optimizer, use raw img */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={it.previewUrl}
                  alt={`Previzualizare ${it.file.name}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  {it.status === 'uploading' && (
                    <div className="bg-black/40 w-full h-full flex items-center justify-center">
                      <Loader2 size={20} className="text-white animate-spin" aria-label="Se încarcă" />
                    </div>
                  )}
                  {it.status === 'done' && (
                    <div className="absolute bottom-1 right-1 bg-safe text-white rounded-full p-0.5">
                      <Check size={12} aria-label="Încărcat" />
                    </div>
                  )}
                  {it.status === 'error' && (
                    <button
                      type="button"
                      onClick={() => retryItem(it.id)}
                      className="bg-alert/80 w-full h-full flex flex-col items-center justify-center gap-0.5 text-white text-[10px] font-medium"
                      aria-label={`Reîncearcă ${it.file.name}`}
                    >
                      <RotateCw size={16} aria-hidden />
                      <span>Reîncearcă</span>
                    </button>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeItem(it.id)}
                className="absolute -top-1.5 -right-1.5 bg-white border border-hair rounded-full w-5 h-5 flex items-center justify-center shadow-sm hover:bg-hair-soft transition-colors"
                aria-label={`Elimină ${it.file.name}`}
              >
                <X size={12} className="text-ink" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-ink-muted">
        Adaugă până la {maxFiles} poze (max 10 MiB fiecare).
      </p>

      <button
        type="button"
        disabled={!canAdd}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-purple/30 text-purple text-sm font-medium hover:bg-purple/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus size={16} aria-hidden /> Adaugă poze
      </button>
    </div>
  )
}

