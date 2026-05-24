export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: Record<string, string> | null,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api/v1'

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    // Accept two error shapes:
    //  - API_CONTRACT.MD envelope: { error: { code, message, details } }
    //  - Huma's RFC 7807 default:  { title, status, detail, errors? }
    // The Go API currently emits RFC 7807; the contract envelope is aspirational.
    const code = body?.error?.code ?? body?.detail ?? 'unknown'
    const message = body?.error?.message ?? body?.title ?? res.statusText
    const details = body?.error?.details ?? body?.errors ?? null
    throw new ApiError(res.status, code, message, details)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  del: <T>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),
  // rawPut uploads a Blob to an absolute URL (e.g. a presigned R2 PUT URL).
  // Bypasses apiFetch on purpose: must NOT prefix API_BASE, NOT send credentials,
  // and NOT set JSON Content-Type — the signed URL is sensitive to extra headers.
  rawPut: async (absoluteUrl: string, body: Blob, contentType: string): Promise<void> => {
    const res = await fetch(absoluteUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body,
    })
    if (!res.ok) {
      throw new ApiError(res.status, 'upload_failed', `Upload eșuat (HTTP ${res.status})`)
    }
  },
  // postForBlob POSTs JSON to an API_BASE-relative path and returns the raw response Blob.
  // Used by binary endpoints like /spray-reports/anf-export that return application/pdf.
  postForBlob: async (path: string, body?: unknown): Promise<Blob> => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const errBody = await res.json().catch(() => null)
      const code = errBody?.error?.code ?? errBody?.detail ?? 'unknown'
      const message = errBody?.error?.message ?? errBody?.title ?? res.statusText
      const details = errBody?.error?.details ?? errBody?.errors ?? null
      throw new ApiError(res.status, code, message, details)
    }
    return res.blob()
  },
}
