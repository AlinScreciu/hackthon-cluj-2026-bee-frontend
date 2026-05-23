import { toast } from 'sonner'
import { ApiError } from './client'

export function toastSuccess(message: string) {
  return toast.success(message)
}

export function toastError(err: unknown, fallback: string) {
  if (err instanceof ApiError) {
    const fieldMsg =
      err.details && typeof err.details === 'object'
        ? Object.values(err.details).find((v): v is string => typeof v === 'string')
        : undefined
    return toast.error(fieldMsg ?? err.message ?? fallback)
  }
  return toast.error(fallback)
}

export function toastApiPromise<T>(
  promise: Promise<T>,
  opts: { loading: string; success: string; errorFallback: string },
): Promise<T> {
  toast.promise(promise, {
    loading: opts.loading,
    success: opts.success,
    error: (err) => {
      if (err instanceof ApiError) {
        const fieldMsg =
          err.details && typeof err.details === 'object'
            ? Object.values(err.details).find((v): v is string => typeof v === 'string')
            : undefined
        return fieldMsg ?? err.message ?? opts.errorFallback
      }
      return opts.errorFallback
    },
  })
  return promise
}
