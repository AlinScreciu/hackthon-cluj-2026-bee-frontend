export type Role = 'apicultor' | 'fermier' | 'inspector'
export type Toxicity = 'T-' | 'T' | 'T+'
export type FinalStatus = 'confirmed_call' | 'confirmed_sms' | 'confirmed_app' | 'unconfirmed' | 'failed'

export type PushState = 'pending' | 'sent' | 'delivered' | 'opened'
export type CallState = 'skipped' | 'queued' | 'ringing' | 'answered' | 'confirmed' | 'no_input' | 'no_answer' | 'busy' | 'failed' | 'hung_up'
export type SmsState = 'skipped' | 'queued' | 'sent' | 'delivered' | 'confirmed' | 'no_reply' | 'failed'

export interface ChannelStates {
  push: { state: PushState; at: string | null }
  call: { state: CallState; at: string | null; attempts: number }
  sms: { state: SmsState; at: string | null }
}

export interface User {
  id: string
  cnp: string
  name: string
  full_name: string
  email: string
  phone: string
  role: Role
  county: string
  locality: string
}

export interface Apiary {
  id: string
  owner_id: string
  name: string
  type: 'permanent' | 'pastoral'
  lat: number
  lng: number
  hive_count: number
  start_date: string
  end_date: string | null
  notes: string | null
  status: 'safe' | 'warning' | 'danger'
  current_risk: {
    nearest_spray_km: number | null
    nearest_spray_eta: string | null
    active_alerts: number
  }
  created_at: string
  last_ledger_hash: string
}

export interface Parcel {
  id: string
  owner_id: string
  name: string
  cadastral_number: string
  lat: number
  lng: number
  surface_ha: number
  default_crop: string | null
  county: string
  locality: string
}

export interface SprayReport {
  id: string
  farmer_id: string
  parcel_id: string
  parcel: { name: string; lat: number; lng: number }
  crop: string
  substance: string
  toxicity: Toxicity
  surface_ha: number
  scheduled_at: string
  duration_hours: number
  notes: string | null
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  affected_apiaries_count: number
  ledger_hash: string
  created_at: string
}

export interface AlertDispatchPublic {
  alert_dispatch_id: string
  beekeeper_initials: string
  apiary_name: string
  distance_km: number
  downwind: boolean
  channels: ChannelStates
  final_status: FinalStatus | null
  ledger_hash: string
}

export interface CascadeStatus {
  spray_report_id: string
  overall_status: 'in_progress' | 'complete'
  summary: {
    total: number
    confirmed: number
    pending: number
    unconfirmed: number
    failed: number
  }
  dispatches: AlertDispatchPublic[]
  polled_at: string
}

export interface AlertView {
  alert_dispatch_id: string
  spray_report_id: string
  farmer_name_masked: string
  apiary_id: string
  apiary_name: string
  substance: string
  toxicity: Toxicity
  scheduled_at: string
  distance_km: number
  downwind: boolean
  spray_lat: number
  spray_lng: number
  wind_direction_deg: number
  channels: ChannelStates
  final_status: FinalStatus
  in_app_action: 'move_hives' | 'seal_in_place' | null
  ledger_hash: string
  created_at: string
}

export interface LedgerEvent {
  id: string
  hash: string
  prev_hash: string | null
  type: string
  actor_id: string | null
  payload: object
  created_at: string
}

export interface LedgerEventSummary {
  hash: string
  type: string
  created_at: string
}

export interface DamageClaim {
  id: string
  beekeeper_id: string
  apiary_id: string
  related_spray_id: string | null
  description: string
  hive_loss_count: number
  photos: string[]
  gps_lat: number
  gps_lng: number
  status: 'filed' | 'under_review' | 'accepted' | 'rejected'
  ledger_hash: string
  created_at: string
}

export interface Substance {
  label: string
  toxicity: Toxicity
}

// API error shape
export interface ApiErrorBody {
  error: {
    code: string
    message: string
    details?: Record<string, string> | null
  }
}

// Request types
export interface SprayReportCreate {
  parcel_id: string
  surface_ha: number
  crop: string
  substance: string
  scheduled_at: string
  duration_hours: number
  notes?: string
}

export interface ApiaryCreate {
  name: string
  type: 'permanent' | 'pastoral'
  lat: number
  lng: number
  hive_count: number
  start_date: string
  end_date?: string
  notes?: string
}
