'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './client'
import type {
  User, Apiary, Parcel, SprayReport, AlertView,
  CascadeStatus, Substance, AlertDispatchPublic, DamageClaim
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
  mapData: (bbox?: string) => ['map-data', bbox] as const,
  farmers: ['farmers'] as const,
  farmer: (id: string) => ['farmers', id] as const,
  damageClaims: ['damage-claims'] as const,
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
    queryFn: () => api.get<{ apiary: Apiary; history: unknown[] }>(`/apiaries/${id}`),
  })
}

export function useParcels() {
  return useQuery({
    queryKey: keys.parcels,
    queryFn: () => api.get<{ items: Parcel[] }>('/parcels'),
  })
}

export function useSprayReports(status?: 'active' | 'past') {
  return useQuery({
    queryKey: keys.sprayReports(status),
    queryFn: () => api.get<{ items: SprayReport[]; next_cursor: string | null }>(
      `/spray-reports${status ? `?status=${status}` : ''}`
    ),
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

export function useAlerts(status?: 'active' | 'all') {
  return useQuery({
    queryKey: keys.alerts(status),
    queryFn: () => api.get<{ items: AlertView[] }>(
      `/alerts${status ? `?status=${status}` : ''}`
    ),
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
    queryFn: () => api.get<{ items: unknown[] }>('/inspector/farmers'),
  })
}

export function useDamageClaims() {
  return useQuery({
    queryKey: keys.damageClaims,
    queryFn: () => api.get<{ items: DamageClaim[] }>('/damage-claims'),
  })
}

export function useConfirmAlert() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'move_hives' | 'seal_in_place' }) =>
      api.post<{ alert: AlertView; ledger_hash: string }>(`/alerts/${id}/confirm`, { action }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.alerts() })
    },
  })
}
