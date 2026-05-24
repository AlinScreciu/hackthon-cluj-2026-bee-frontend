'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import type {
  User, Apiary, Parcel, SprayReport, AlertView,
  CascadeStatus, Substance, Weather, AlertDispatchPublic, DamageClaim, LedgerEventSummary,
  RiskPreview, RiskPreviewRequest,
  UploadSignRequest, SignedUploadResponse, DamageClaimCreate,
  FarmerSummary, FarmerDetail, ANFExportRequest,
} from './types'

export const keys = {
  me: ['me'] as const,
  apiaries: ['apiaries'] as const,
  apiary: (id: string) => ['apiaries', id] as const,
  parcels: ['parcels'] as const,
  parcel: (id: string) => ['parcels', id] as const,
  sprayReports: (status?: string) => ['spray-reports', status] as const,
  sprayReport: (id: string) => ['spray-reports', id] as const,
  cascadeStatus: (id: string) => ['cascade-status', id] as const,
  alerts: (status?: string) => ['alerts', status] as const,
  alert: (id: string) => ['alerts', id] as const,
  substances: ['substances'] as const,
  weather: (lat?: number, lng?: number) => ['weather', lat, lng] as const,
  mapData: (bbox?: string) => ['map-data', bbox] as const,
  farmers: ['farmers'] as const,
  farmer: (id: string) => ['farmers', id] as const,
  damageClaims: ['damage-claims'] as const,
  damageClaim: (id: string) => ['damage-claims', id] as const,
  events: ['events'] as const,
}

export function useMe() {
  return useQuery({
    queryKey: keys.me,
    queryFn: () => api.get<{ user: User }>('/auth/me'),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}

export function useApiaries() {
  return useQuery({
    queryKey: keys.apiaries,
    queryFn: () => api.get<{ items: Apiary[] }>('/apiaries'),
  })
}

export function useApiary(id: string) {
  return useQuery({
    queryKey: keys.apiary(id),
    queryFn: () => api.get<{ apiary: Apiary; history: LedgerEventSummary[] }>(`/apiaries/${id}`),
  })
}

export function useParcels() {
  return useQuery({
    queryKey: keys.parcels,
    queryFn: () => api.get<{ items: Parcel[] }>('/parcels'),
  })
}

export function useSprayReports(status?: 'active' | 'past', opts?: { enabled?: boolean }) {
  return useQuery({
    queryKey: keys.sprayReports(status),
    queryFn: () => api.get<{ items: SprayReport[]; next_cursor: string | null }>(
      `/spray-reports${status ? `?status=${status}` : ''}`
    ),
    enabled: opts?.enabled ?? true,
  })
}

export function useSprayReport(id: string) {
  return useQuery({
    queryKey: keys.sprayReport(id),
    queryFn: () => api.get<{ spray_report: SprayReport; cascade: CascadeStatus }>(`/spray-reports/${id}`),
  })
}

export function useCascadeStatus(sprayId: string) {
  return useQuery({
    queryKey: keys.cascadeStatus(sprayId),
    queryFn: () => api.get<CascadeStatus>(`/spray-reports/${sprayId}/cascade-status`),
    refetchInterval: (q) =>
      q.state.data?.overall_status === 'complete' ? false : 2000,
    refetchIntervalInBackground: false,
    staleTime: 0,
  })
}

export function useAlerts(status?: 'active' | 'all', opts?: { enabled?: boolean }) {
  return useQuery({
    queryKey: keys.alerts(status),
    queryFn: () => api.get<{ items: AlertView[] }>(
      `/alerts${status ? `?status=${status}` : ''}`
    ),
    enabled: opts?.enabled ?? true,
  })
}

export function useAlert(id: string) {
  return useQuery({
    queryKey: keys.alert(id),
    queryFn: () => api.get<{ alert: AlertView; spray_report: SprayReport }>(`/alerts/${id}`),
  })
}

export function useSubstances() {
  return useQuery({
    queryKey: keys.substances,
    queryFn: () => api.get<{ items: Substance[] }>('/reference/substances'),
    staleTime: Infinity,
  })
}

export function useWeather(lat?: number, lng?: number) {
  return useQuery({
    queryKey: keys.weather(lat, lng),
    queryFn: () => api.get<Weather>(`/reference/weather?lat=${lat}&lng=${lng}`),
    enabled: typeof lat === 'number' && typeof lng === 'number',
    staleTime: 5 * 60 * 1000,
  })
}

// useRiskPreview drives the AI risk assessment shown on the new-spray form.
// The form passes the current values; we debounce client-side and only fire
// when the required subset is present.
export function useRiskPreview(req: RiskPreviewRequest | null) {
  return useQuery({
    queryKey: ['risk-preview', req] as const,
    queryFn: () => api.post<RiskPreview>('/spray-reports/risk-preview', req!),
    enabled: !!req,
    staleTime: 30 * 1000,
    retry: false,
  })
}

export function useInspectorMapData(bbox?: string) {
  return useQuery({
    queryKey: keys.mapData(bbox),
    queryFn: () => api.get<{
      apiaries: { id: string; lat: number; lng: number; status: string; hive_count: number }[]
      active_sprays: { id: string; lat: number; lng: number; toxicity: string; scheduled_at: string; radius_m: number }[]
      damage_claims: { id: string; lat: number; lng: number; status: string }[]
    }>(`/inspector/map-data${bbox ? `?bbox=${bbox}` : ''}`),
    refetchInterval: 30000,
  })
}

export function useFarmers() {
  return useQuery({
    queryKey: keys.farmers,
    queryFn: () => api.get<{ items: FarmerSummary[] }>('/inspector/farmers'),
  })
}

export function useFarmer(id: string) {
  return useQuery({
    queryKey: keys.farmer(id),
    queryFn: () => api.get<FarmerDetail>(`/inspector/farmers/${id}`),
    enabled: !!id,
  })
}

// useANFExport posts a date range to /spray-reports/anf-export and triggers a
// browser download for the returned application/pdf blob. Returns the mutation
// so callers can disable a button while in-flight and show toast on error.
export function useANFExport() {
  return useMutation({
    mutationFn: async (req: ANFExportRequest) => {
      const blob = await api.postForBlob('/spray-reports/anf-export', req)
      const filename = `anf-export-${req.from}_${req.to}.pdf`
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      return { filename, byte_size: blob.size }
    },
  })
}

export function useDamageClaims() {
  return useQuery({
    queryKey: keys.damageClaims,
    queryFn: () => api.get<{ items: DamageClaim[] }>('/damage-claims'),
  })
}

export function useDamageClaim(id: string) {
  return useQuery({
    queryKey: keys.damageClaim(id),
    queryFn: () => api.get<{ claim: DamageClaim }>(`/damage-claims/${id}`),
  })
}

export function useSignUpload() {
  return useMutation({
    mutationFn: (req: UploadSignRequest) =>
      api.post<SignedUploadResponse>('/uploads/sign', req),
  })
}

export function useCreateDamageClaim() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: DamageClaimCreate) =>
      api.post<{ claim: DamageClaim; ledger_hash: string }>('/damage-claims', input),
    onSuccess: () => {
      // Bare prefix matches every variant under ['damage-claims', ...].
      qc.invalidateQueries({ queryKey: ['damage-claims'] })
    },
  })
}

export function useConfirmAlert() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'move_hives' | 'seal_in_place' }) =>
      api.post<{ alert: AlertView; ledger_hash: string }>(`/alerts/${id}/confirm`, { action }),
    onSuccess: () => {
      // Use bare prefix so partial-match invalidates every variant:
      // ['alerts', 'active'], ['alerts', 'all'], ['alerts', <id>].
      // keys.alerts() would resolve to ['alerts', undefined] which does NOT
      // match those subset keys in TanStack v5.
      qc.invalidateQueries({ queryKey: ['alerts'] })
    },
  })
}
