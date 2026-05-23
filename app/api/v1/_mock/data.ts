// NOTE: No uuid package - use crypto.randomUUID() instead

import type { User, Apiary, Parcel, SprayReport, AlertDispatchPublic, AlertView, CascadeStatus, ChannelStates, Toxicity, DamageClaim, LedgerEvent } from '@/lib/api/types'

function uid() {
  return crypto.randomUUID()
}

// ── Seed Users ────────────────────────────────────────────────────────────────
export const USERS: User[] = [
  {
    id: 'user-apicultor-1',
    cnp: '1900101400001',
    name: 'I. Mureșan',
    full_name: 'Ioan Mureșan',
    email: 'apicultor@test.ro',
    phone: '+40712000001',
    role: 'apicultor',
    county: 'Cluj',
    locality: 'Apahida',
  },
  {
    id: 'user-fermier-1',
    cnp: '1850201400002',
    name: 'M. Popescu',
    full_name: 'Maria Popescu',
    email: 'fermier@test.ro',
    phone: '+40712000002',
    role: 'fermier',
    county: 'Cluj',
    locality: 'Florești',
  },
  {
    id: 'user-inspector-1',
    cnp: '1780301400003',
    name: 'D. Stan',
    full_name: 'Dumitru Stan',
    email: 'inspector@test.ro',
    phone: '+40712000003',
    role: 'inspector',
    county: 'Cluj',
    locality: 'Cluj-Napoca',
  },
]

// password for all test users: "test1234"

// ── Seed Apiaries ─────────────────────────────────────────────────────────────
export const APIARIES: Apiary[] = [
  {
    id: 'apiary-1',
    owner_id: 'user-apicultor-1',
    name: 'Stupina Apahida Nord',
    type: 'permanent',
    lat: 46.813,
    lng: 23.752,
    hive_count: 24,
    start_date: '2023-03-15',
    end_date: null,
    notes: 'Lângă pădure de salcâm',
    status: 'safe',
    current_risk: { nearest_spray_km: null, nearest_spray_eta: null, active_alerts: 0 },
    created_at: '2023-03-15T10:00:00Z',
    last_ledger_hash: 'a3f1c2e4b5d60000000000000000000000000000000000000000000000000001',
  },
  {
    id: 'apiary-2',
    owner_id: 'user-apicultor-1',
    name: 'Stupina Florești',
    type: 'permanent',
    lat: 46.742,
    lng: 23.506,
    hive_count: 16,
    start_date: '2024-04-01',
    end_date: null,
    notes: null,
    status: 'warning',
    current_risk: { nearest_spray_km: 0.8, nearest_spray_eta: null, active_alerts: 1 },
    created_at: '2024-04-01T08:00:00Z',
    last_ledger_hash: 'b4e2d3f5a6c70000000000000000000000000000000000000000000000000002',
  },
  {
    id: 'apiary-3',
    owner_id: 'user-apicultor-1',
    name: 'Stupina Pastorală Turda',
    type: 'pastoral',
    lat: 46.567,
    lng: 23.787,
    hive_count: 40,
    start_date: '2026-05-01',
    end_date: '2026-07-31',
    notes: 'Mutată pentru sezonul de tei',
    status: 'safe',
    current_risk: { nearest_spray_km: null, nearest_spray_eta: null, active_alerts: 0 },
    created_at: '2026-05-01T07:00:00Z',
    last_ledger_hash: 'c5f3e4a7b8d80000000000000000000000000000000000000000000000000003',
  },
]

// ── Seed Parcels ─────────────────────────────────────────────────────────────
export const PARCELS: Parcel[] = [
  {
    id: 'parcel-1',
    owner_id: 'user-fermier-1',
    name: 'Parcela Florești A',
    cadastral_number: '12345/1',
    lat: 46.748,
    lng: 23.512,
    surface_ha: 4.5,
    default_crop: 'Rapiță',
    county: 'Cluj',
    locality: 'Florești',
  },
  {
    id: 'parcel-2',
    owner_id: 'user-fermier-1',
    name: 'Parcela Apahida Sud',
    cadastral_number: '67890/2',
    lat: 46.801,
    lng: 23.748,
    surface_ha: 7.2,
    default_crop: 'Porumb',
    county: 'Cluj',
    locality: 'Apahida',
  },
  {
    id: 'parcel-3',
    owner_id: 'user-fermier-1',
    name: 'Parcela Jucu',
    cadastral_number: '11223/3',
    lat: 46.891,
    lng: 23.797,
    surface_ha: 3.8,
    default_crop: 'Floarea soarelui',
    county: 'Cluj',
    locality: 'Jucu',
  },
]

// ── Seed Substances ───────────────────────────────────────────────────────────
export const SUBSTANCES = [
  { label: 'Confidor Energy', toxicity: 'T+' as Toxicity },
  { label: 'Mospilan 20 SG', toxicity: 'T' as Toxicity },
  { label: 'Karate Zeon', toxicity: 'T' as Toxicity },
  { label: 'Decis Mega', toxicity: 'T-' as Toxicity },
  { label: 'Actara 25 WG', toxicity: 'T+' as Toxicity },
  { label: 'Fastac Active', toxicity: 'T' as Toxicity },
  { label: 'Dursban 4E', toxicity: 'T+' as Toxicity },
  { label: 'Laser 240 SC', toxicity: 'T-' as Toxicity },
]

// ── In-memory stores ──────────────────────────────────────────────────────────
export const sprayReports = new Map<string, SprayReport & { created_at_ms: number }>()
export const alertDispatches = new Map<string, AlertDispatchPublic[]>() // keyed by sprayId
export const alertViews = new Map<string, AlertView>() // keyed by alert_dispatch_id
export const damageClaims = new Map<string, DamageClaim>()
export const pushSubscriptions = new Map<string, unknown>()
export const authChallenges = new Map<string, { userId: string; method: string; masked: string }>()

// ── Cascade time-based progression ───────────────────────────────────────────
export function computeCascadeStatus(sprayId: string): CascadeStatus | null {
  const spray = sprayReports.get(sprayId)
  const dispatches = alertDispatches.get(sprayId)
  if (!spray || !dispatches) return null

  const elapsed = (Date.now() - spray.created_at_ms) / 1000 // seconds since creation

  const computed = dispatches.map((d, i) => {
    const offset = i * 8 // stagger each beekeeper by 8 seconds
    return computeDispatch(d, elapsed - offset)
  })

  const confirmed = computed.filter(d => d.final_status?.startsWith('confirmed')).length
  const pending = computed.filter(d => d.final_status === null).length
  const unconfirmed = computed.filter(d => d.final_status === 'unconfirmed').length
  const failed = computed.filter(d => d.final_status === 'failed').length
  const overall = pending > 0 ? 'in_progress' : 'complete'

  return {
    spray_report_id: sprayId,
    overall_status: overall,
    summary: { total: computed.length, confirmed, pending, unconfirmed, failed },
    dispatches: computed,
    polled_at: new Date().toISOString(),
  }
}

function computeDispatch(d: AlertDispatchPublic, t: number): AlertDispatchPublic {
  // If in-app confirmed, preserve that status
  if (d.final_status === 'confirmed_app') return d
  // Preserve seeded "unsafe / unconfirmed" terminal state (cascade exhausted,
  // beekeeper hasn't responded) — used for the urgent-alert demo dispatch
  if (d.final_status === 'unconfirmed') return d

  // Time-based state machine: t = seconds since dispatch was created
  if (t < 0) {
    return {
      ...d,
      channels: {
        push: { state: 'pending', at: null },
        call: { state: 'queued', at: null, attempts: 0 },
        sms: { state: 'queued', at: null },
      },
      final_status: null,
    }
  }

  const at = (s: number) => t > s ? new Date(Date.now() - (t - s) * 1000).toISOString() : null

  let pushState: ChannelStates['push']['state'] = 'pending'
  if (t > 2) pushState = 'sent'
  if (t > 6) pushState = 'delivered'
  if (t > 20) pushState = 'opened'

  // Respect pre-set skipped call state (T- substances)
  const callSkipped = d.channels.call.state === 'skipped'
  let callState: ChannelStates['call']['state'] = callSkipped ? 'skipped' : 'queued'
  if (!callSkipped) {
    if (t > 2) callState = 'ringing'
    if (t > 7) callState = 'answered'
    if (t > 12) callState = 'confirmed'
  }

  let smsState: ChannelStates['sms']['state'] = 'queued'
  let finalStatus: AlertDispatchPublic['final_status'] = null

  if (!callSkipped && t > 12) {
    // Call confirmed — SMS skipped
    smsState = 'skipped'
    finalStatus = 'confirmed_call'
  } else if (callSkipped && t > 20) {
    // T- path: SMS confirmed
    if (t > 15) smsState = 'sent'
    if (t > 20) smsState = 'delivered'
    if (t > 30) { smsState = 'confirmed'; finalStatus = 'confirmed_sms' }
  } else if (t > 60) {
    finalStatus = 'unconfirmed'
  }

  return {
    ...d,
    channels: {
      push: { state: pushState, at: at(2) },
      call: { state: callState, at: callSkipped ? null : at(2), attempts: (!callSkipped && t > 2) ? 1 : 0 },
      sms: { state: smsState, at: smsState !== 'queued' ? at(callSkipped ? 15 : 13) : null },
    },
    final_status: finalStatus,
  }
}

// Helper to get user by CNP
export function getUserByCnp(cnp: string): User | undefined {
  return USERS.find(u => u.cnp === cnp)
}

export function getUserById(id: string): User | undefined {
  return USERS.find(u => u.id === id)
}

// Create a spray report with dispatches
export function createSprayReport(
  farmerId: string,
  body: {
    parcel_id: string; surface_ha: number; crop: string; substance: string;
    scheduled_at: string; duration_hours: number; notes?: string
  }
): SprayReport & { created_at_ms: number; initial_dispatches: AlertDispatchPublic[] } {
  const parcel = PARCELS.find(p => p.id === body.parcel_id)
  const substance = SUBSTANCES.find(s => s.label === body.substance)
  const toxicity: Toxicity = substance?.toxicity ?? 'T'
  const id = uid()
  const now = new Date().toISOString()
  const createdAtMs = Date.now()

  const spray: SprayReport & { created_at_ms: number } = {
    id,
    farmer_id: farmerId,
    parcel_id: body.parcel_id,
    parcel: parcel
      ? { name: parcel.name, lat: parcel.lat, lng: parcel.lng }
      : { name: 'Parcelă necunoscută', lat: 46.77, lng: 23.59 },
    crop: body.crop,
    substance: body.substance,
    toxicity,
    surface_ha: body.surface_ha,
    scheduled_at: body.scheduled_at,
    duration_hours: body.duration_hours,
    notes: body.notes ?? null,
    status: 'scheduled',
    affected_apiaries_count: 2,
    ledger_hash: uid().replace(/-/g, '').substring(0, 16),
    created_at: now,
    created_at_ms: createdAtMs,
  }

  // Create 2 mock dispatches (to apicultor-1's apiaries)
  const dispatches: AlertDispatchPublic[] = [
    {
      alert_dispatch_id: uid(),
      beekeeper_initials: 'I. M.',
      apiary_name: 'Stupina Apahida Nord',
      distance_km: 1.2,
      downwind: true,
      channels: {
        push: { state: 'pending', at: null },
        call: { state: toxicity === 'T-' ? 'skipped' : 'queued', at: null, attempts: 0 },
        sms: { state: 'queued', at: null },
      },
      final_status: null,
      ledger_hash: uid().replace(/-/g, '').substring(0, 16),
    },
    {
      alert_dispatch_id: uid(),
      beekeeper_initials: 'I. M.',
      apiary_name: 'Stupina Florești',
      distance_km: 0.8,
      downwind: false,
      channels: {
        push: { state: 'pending', at: null },
        call: { state: toxicity === 'T-' ? 'skipped' : 'queued', at: null, attempts: 0 },
        sms: { state: 'queued', at: null },
      },
      final_status: null,
      ledger_hash: uid().replace(/-/g, '').substring(0, 16),
    },
  ]

  sprayReports.set(id, spray)
  alertDispatches.set(id, dispatches)

  // Create AlertView entries for the apicultor
  dispatches.forEach(d => {
    const av: AlertView = {
      alert_dispatch_id: d.alert_dispatch_id,
      spray_report_id: id,
      farmer_name_masked: 'M. Popescu',
      apiary_id: d.apiary_name === 'Stupina Apahida Nord' ? 'apiary-1' : 'apiary-2',
      apiary_name: d.apiary_name,
      substance: body.substance,
      toxicity,
      scheduled_at: body.scheduled_at,
      distance_km: d.distance_km,
      downwind: d.downwind,
      spray_lat: spray.parcel.lat,
      spray_lng: spray.parcel.lng,
      wind_direction_deg: 225,
      channels: d.channels,
      final_status: 'unconfirmed',
      in_app_action: null,
      ledger_hash: d.ledger_hash,
      created_at: now,
    }
    alertViews.set(d.alert_dispatch_id, av)
  })

  return { ...spray, initial_dispatches: dispatches }
}

// Create a damage claim
export function createDamageClaim(
  beekeeperId: string,
  body: {
    apiary_id: string
    related_spray_id?: string | null
    description: string
    hive_loss_count: number
    photos?: string[]
    gps_lat: number
    gps_lng: number
  }
): DamageClaim {
  const id = uid()
  const claim: DamageClaim = {
    id,
    beekeeper_id: beekeeperId,
    apiary_id: body.apiary_id,
    related_spray_id: body.related_spray_id ?? null,
    description: body.description,
    hive_loss_count: body.hive_loss_count,
    photos: body.photos ?? [],
    gps_lat: body.gps_lat,
    gps_lng: body.gps_lng,
    status: 'filed',
    ledger_hash: uid().replace(/-/g, '').substring(0, 16),
    created_at: new Date().toISOString(),
  }
  damageClaims.set(id, claim)
  return claim
}

// ── Seeded historical spray reports ──────────────────────────────────────────
// These are pre-populated so the demo has data immediately after login.
// created_at_ms is set far in the past → cascade computes as "confirmed_call" for all dispatches.

const SEED_3D_MS = Date.now() - 3 * 86400 * 1000   // 3 days ago
const SEED_1D_MS = Date.now() - 1 * 86400 * 1000   // yesterday

// Spray seed 1: T+ substance, 3 days ago, completed
sprayReports.set('spray-seed-1', {
  id: 'spray-seed-1',
  farmer_id: 'user-fermier-1',
  parcel_id: 'parcel-1',
  parcel: { name: 'Parcela Florești A', lat: 46.748, lng: 23.512 },
  crop: 'Rapiță',
  substance: 'Confidor Energy',
  toxicity: 'T+',
  surface_ha: 4.5,
  scheduled_at: '2026-05-20T06:00:00Z',
  duration_hours: 3,
  notes: 'Tratament preventiv',
  status: 'completed',
  affected_apiaries_count: 2,
  ledger_hash: 'a1b2c3d4e5f60001a1b2c3d4',
  created_at: '2026-05-20T05:30:00Z',
  created_at_ms: SEED_3D_MS,
})

alertDispatches.set('spray-seed-1', [
  {
    alert_dispatch_id: 'dispatch-seed-1a',
    beekeeper_initials: 'I. M.',
    apiary_name: 'Stupina Florești',
    distance_km: 0.8,
    downwind: true,
    channels: { push: { state: 'pending', at: null }, call: { state: 'queued', at: null, attempts: 0 }, sms: { state: 'queued', at: null } },
    final_status: null,
    ledger_hash: 'a1b2c3d4e5f60002a1b2c3d4',
  },
  {
    alert_dispatch_id: 'dispatch-seed-1b',
    beekeeper_initials: 'I. M.',
    apiary_name: 'Stupina Apahida Nord',
    distance_km: 2.1,
    downwind: false,
    channels: { push: { state: 'pending', at: null }, call: { state: 'queued', at: null, attempts: 0 }, sms: { state: 'queued', at: null } },
    final_status: null,
    ledger_hash: 'a1b2c3d4e5f60003a1b2c3d4',
  },
])

alertViews.set('dispatch-seed-1a', {
  alert_dispatch_id: 'dispatch-seed-1a',
  spray_report_id: 'spray-seed-1',
  farmer_name_masked: 'M. Popescu',
  apiary_id: 'apiary-2',
  apiary_name: 'Stupina Florești',
  substance: 'Confidor Energy',
  toxicity: 'T+',
  scheduled_at: '2026-05-20T06:00:00Z',
  distance_km: 0.8,
  downwind: true,
  spray_lat: 46.748,
  spray_lng: 23.512,
  wind_direction_deg: 230,
  channels: { push: { state: 'pending', at: null }, call: { state: 'queued', at: null, attempts: 0 }, sms: { state: 'queued', at: null } },
  final_status: 'unconfirmed',
  in_app_action: null,
  ledger_hash: 'a1b2c3d4e5f60002a1b2c3d4',
  created_at: '2026-05-20T05:30:00Z',
})

alertViews.set('dispatch-seed-1b', {
  alert_dispatch_id: 'dispatch-seed-1b',
  spray_report_id: 'spray-seed-1',
  farmer_name_masked: 'M. Popescu',
  apiary_id: 'apiary-1',
  apiary_name: 'Stupina Apahida Nord',
  substance: 'Confidor Energy',
  toxicity: 'T+',
  scheduled_at: '2026-05-20T06:00:00Z',
  distance_km: 2.1,
  downwind: false,
  spray_lat: 46.748,
  spray_lng: 23.512,
  wind_direction_deg: 230,
  channels: { push: { state: 'pending', at: null }, call: { state: 'queued', at: null, attempts: 0 }, sms: { state: 'queued', at: null } },
  final_status: 'unconfirmed',
  in_app_action: null,
  ledger_hash: 'a1b2c3d4e5f60003a1b2c3d4',
  created_at: '2026-05-20T05:30:00Z',
})

// Spray seed 2: T substance, yesterday, completed
sprayReports.set('spray-seed-2', {
  id: 'spray-seed-2',
  farmer_id: 'user-fermier-1',
  parcel_id: 'parcel-2',
  parcel: { name: 'Parcela Apahida Sud', lat: 46.801, lng: 23.748 },
  crop: 'Porumb',
  substance: 'Mospilan 20 SG',
  toxicity: 'T',
  surface_ha: 7.2,
  scheduled_at: '2026-05-22T07:00:00Z',
  duration_hours: 5,
  notes: null,
  status: 'completed',
  affected_apiaries_count: 1,
  ledger_hash: 'b2c3d4e5f6a70001b2c3d4e5',
  created_at: '2026-05-22T06:45:00Z',
  created_at_ms: SEED_1D_MS,
})

alertDispatches.set('spray-seed-2', [
  {
    alert_dispatch_id: 'dispatch-seed-2a',
    beekeeper_initials: 'I. M.',
    apiary_name: 'Stupina Apahida Nord',
    distance_km: 0.6,
    downwind: true,
    channels: { push: { state: 'pending', at: null }, call: { state: 'queued', at: null, attempts: 0 }, sms: { state: 'queued', at: null } },
    final_status: null,
    ledger_hash: 'b2c3d4e5f6a70002b2c3d4e5',
  },
])

alertViews.set('dispatch-seed-2a', {
  alert_dispatch_id: 'dispatch-seed-2a',
  spray_report_id: 'spray-seed-2',
  farmer_name_masked: 'M. Popescu',
  apiary_id: 'apiary-1',
  apiary_name: 'Stupina Apahida Nord',
  substance: 'Mospilan 20 SG',
  toxicity: 'T',
  scheduled_at: '2026-05-22T07:00:00Z',
  distance_km: 0.6,
  downwind: true,
  spray_lat: 46.801,
  spray_lng: 23.748,
  wind_direction_deg: 190,
  channels: { push: { state: 'pending', at: null }, call: { state: 'queued', at: null, attempts: 0 }, sms: { state: 'queued', at: null } },
  final_status: 'unconfirmed',
  in_app_action: null,
  ledger_hash: 'b2c3d4e5f6a70002b2c3d4e5',
  created_at: '2026-05-22T06:45:00Z',
})

// Spray seed 3: T- substance (Decis Mega), 5 hours ago, in_progress
sprayReports.set('spray-seed-3', {
  id: 'spray-seed-3',
  farmer_id: 'user-fermier-1',
  parcel_id: 'parcel-3',
  parcel: { name: 'Parcela Jucu', lat: 46.891, lng: 23.797 },
  crop: 'Floarea soarelui',
  substance: 'Decis Mega',
  toxicity: 'T-',
  surface_ha: 3.8,
  scheduled_at: '2026-05-23T08:00:00Z',
  duration_hours: 2,
  notes: null,
  status: 'in_progress',
  affected_apiaries_count: 1,
  ledger_hash: 'c3d4e5f6a7b80001c3d4e5f6',
  created_at: '2026-05-23T07:50:00Z',
  created_at_ms: Date.now() - 5 * 3600 * 1000,
})

// Spray seed 4: scheduled for tomorrow — shows "Următoarea" pill on parcel-2
sprayReports.set('spray-seed-4', {
  id: 'spray-seed-4',
  farmer_id: 'user-fermier-1',
  parcel_id: 'parcel-2',
  parcel: { name: 'Parcela Apahida Sud', lat: 46.801, lng: 23.748 },
  crop: 'Porumb',
  substance: 'Confidor',
  toxicity: 'T',
  surface_ha: 7.2,
  scheduled_at: new Date(Date.now() + 86400 * 1000).toISOString(),
  duration_hours: 4,
  notes: null,
  status: 'scheduled',
  affected_apiaries_count: 2,
  ledger_hash: '',
  created_at: new Date().toISOString(),
  created_at_ms: Date.now(),
})

// Spray seed urgent: T+ substance, just now, urgent + unconfirmed (demo state)
// — cascade exhausted all channels but the apicultor hasn't responded yet
sprayReports.set('spray-seed-urgent', {
  id: 'spray-seed-urgent',
  farmer_id: 'user-fermier-1',
  parcel_id: 'parcel-2',
  parcel: { name: 'Parcela Apahida Sud', lat: 46.798, lng: 23.745 },
  crop: 'Rapiță',
  substance: 'Confidor Energy',
  toxicity: 'T+',
  surface_ha: 6.4,
  scheduled_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  duration_hours: 4,
  notes: null,
  status: 'in_progress',
  affected_apiaries_count: 1,
  ledger_hash: 'e5f6a7b8c9d00001e5f6a7b8',
  created_at: new Date(Date.now() - 120 * 1000).toISOString(),
  created_at_ms: Date.now() - 120 * 1000,
})

alertDispatches.set('spray-seed-urgent', [
  {
    alert_dispatch_id: 'dispatch-seed-urgent',
    beekeeper_initials: 'I. M.',
    apiary_name: 'Stupina Apahida Nord',
    distance_km: 0.4,
    downwind: true,
    channels: {
      push: { state: 'delivered', at: new Date(Date.now() - 110 * 1000).toISOString() },
      call: { state: 'no_answer', at: new Date(Date.now() - 80 * 1000).toISOString(), attempts: 3 },
      sms: { state: 'no_reply', at: new Date(Date.now() - 60 * 1000).toISOString() },
    },
    final_status: 'unconfirmed',
    ledger_hash: 'e5f6a7b8c9d00002e5f6a7b8',
  },
])

alertViews.set('dispatch-seed-urgent', {
  alert_dispatch_id: 'dispatch-seed-urgent',
  spray_report_id: 'spray-seed-urgent',
  farmer_name_masked: 'M. Popescu',
  apiary_id: 'apiary-1',
  apiary_name: 'Stupina Apahida Nord',
  substance: 'Confidor Energy',
  toxicity: 'T+',
  scheduled_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  distance_km: 0.4,
  downwind: true,
  spray_lat: 46.798,
  spray_lng: 23.745,
  wind_direction_deg: 210,
  channels: {
    push: { state: 'delivered', at: new Date(Date.now() - 110 * 1000).toISOString() },
    call: { state: 'no_answer', at: new Date(Date.now() - 80 * 1000).toISOString(), attempts: 3 },
    sms: { state: 'no_reply', at: new Date(Date.now() - 60 * 1000).toISOString() },
  },
  final_status: 'unconfirmed',
  in_app_action: null,
  ledger_hash: 'e5f6a7b8c9d00002e5f6a7b8',
  created_at: new Date(Date.now() - 120 * 1000).toISOString(),
})

alertDispatches.set('spray-seed-3', [
  {
    alert_dispatch_id: 'dispatch-seed-3a',
    beekeeper_initials: 'I. M.',
    apiary_name: 'Stupina Pastorală Turda',
    distance_km: 1.9,
    downwind: true,
    channels: { push: { state: 'pending', at: null }, call: { state: 'skipped', at: null, attempts: 0 }, sms: { state: 'queued', at: null } },
    final_status: null,
    ledger_hash: 'c3d4e5f6a7b80002c3d4e5f6',
  },
])

alertViews.set('dispatch-seed-3a', {
  alert_dispatch_id: 'dispatch-seed-3a',
  spray_report_id: 'spray-seed-3',
  farmer_name_masked: 'M. Popescu',
  apiary_id: 'apiary-3',
  apiary_name: 'Stupina Pastorală Turda',
  substance: 'Decis Mega',
  toxicity: 'T-',
  scheduled_at: '2026-05-23T08:00:00Z',
  distance_km: 1.9,
  downwind: true,
  spray_lat: 46.891,
  spray_lng: 23.797,
  wind_direction_deg: 45,
  channels: { push: { state: 'pending', at: null }, call: { state: 'skipped', at: null, attempts: 0 }, sms: { state: 'queued', at: null } },
  final_status: 'unconfirmed',
  in_app_action: null,
  ledger_hash: 'c3d4e5f6a7b80002c3d4e5f6',
  created_at: '2026-05-23T07:50:00Z',
})

// ── Seeded damage claims ──────────────────────────────────────────────────────
damageClaims.set('damage-seed-1', {
  id: 'damage-seed-1',
  beekeeper_id: 'user-apicultor-1',
  apiary_id: 'apiary-2',
  related_spray_id: 'spray-seed-1',
  description: 'Am găsit 3 familii moarte în stupina din Florești în ziua de după stropire. Albinele prezentau semne clare de intoxicație cu neonicotinoide.',
  hive_loss_count: 3,
  photos: [],
  gps_lat: 46.742,
  gps_lng: 23.506,
  status: 'under_review',
  ledger_hash: 'd4e5f6a7b8c90001d4e5f6a7',
  created_at: '2026-05-21T10:15:00Z',
})

damageClaims.set('damage-seed-2', {
  id: 'damage-seed-2',
  beekeeper_id: 'user-apicultor-1',
  apiary_id: 'apiary-1',
  related_spray_id: null,
  description: 'Pierderi semnificative de albine după aplicare de pesticide pe câmpul vecin. Nu am primit alertă în avans.',
  hive_loss_count: 5,
  photos: [],
  gps_lat: 46.813,
  gps_lng: 23.752,
  status: 'filed',
  ledger_hash: 'd4e5f6a7b8c90002d4e5f6a7',
  created_at: '2026-05-23T09:00:00Z',
})

// ── Ledger events (static chain, for display) ─────────────────────────────────
export const LEDGER_EVENTS: LedgerEvent[] = [
  {
    id: 'evt-001',
    hash: 'a3f1c2e4b5d600000000000000000000000000000000000000000000000001aa',
    prev_hash: null,
    type: 'apiary.registered',
    actor_id: 'user-apicultor-1',
    payload: { apiary_id: 'apiary-1', name: 'Stupina Apahida Nord', hive_count: 24, type: 'permanent' },
    created_at: '2023-03-15T10:00:00Z',
  },
  {
    id: 'evt-002',
    hash: 'b4e2d3f5a6c700000000000000000000000000000000000000000000000002bb',
    prev_hash: 'a3f1c2e4b5d600000000000000000000000000000000000000000000000001aa',
    type: 'apiary.registered',
    actor_id: 'user-apicultor-1',
    payload: { apiary_id: 'apiary-2', name: 'Stupina Florești', hive_count: 16, type: 'permanent' },
    created_at: '2024-04-01T08:00:00Z',
  },
  {
    id: 'evt-003',
    hash: 'c5f3e4a7b8d800000000000000000000000000000000000000000000000003cc',
    prev_hash: 'b4e2d3f5a6c700000000000000000000000000000000000000000000000002bb',
    type: 'apiary.registered',
    actor_id: 'user-apicultor-1',
    payload: { apiary_id: 'apiary-3', name: 'Stupina Pastorală Turda', hive_count: 40, type: 'pastoral' },
    created_at: '2026-05-01T07:00:00Z',
  },
  {
    id: 'evt-004',
    hash: 'a1b2c3d4e5f600000000000000000000000000000000000000000000000004dd',
    prev_hash: 'c5f3e4a7b8d800000000000000000000000000000000000000000000000003cc',
    type: 'spray.created',
    actor_id: 'user-fermier-1',
    payload: { spray_report_id: 'spray-seed-1', substance: 'Confidor Energy', toxicity: 'T+', parcel_id: 'parcel-1', surface_ha: 4.5 },
    created_at: '2026-05-20T05:30:00Z',
  },
  {
    id: 'evt-005',
    hash: 'a1b2c3d4e5f600000000000000000000000000000000000000000000000005ee',
    prev_hash: 'a1b2c3d4e5f600000000000000000000000000000000000000000000000004dd',
    type: 'alert.dispatched',
    actor_id: null,
    payload: { alert_dispatch_id: 'dispatch-seed-1a', apiary_id: 'apiary-2', beekeeper_id: 'user-apicultor-1', distance_km: 0.8, downwind: true },
    created_at: '2026-05-20T05:30:01Z',
  },
  {
    id: 'evt-006',
    hash: 'a1b2c3d4e5f600000000000000000000000000000000000000000000000006ff',
    prev_hash: 'a1b2c3d4e5f600000000000000000000000000000000000000000000000005ee',
    type: 'alert.dispatched',
    actor_id: null,
    payload: { alert_dispatch_id: 'dispatch-seed-1b', apiary_id: 'apiary-1', beekeeper_id: 'user-apicultor-1', distance_km: 2.1, downwind: false },
    created_at: '2026-05-20T05:30:01Z',
  },
  {
    id: 'evt-007',
    hash: 'a1b2c3d4e5f600000000000000000000000000000000000000000000000007aa',
    prev_hash: 'a1b2c3d4e5f600000000000000000000000000000000000000000000000006ff',
    type: 'pdf.generated',
    actor_id: null,
    payload: { spray_report_id: 'spray-seed-1', primarie: 'Florești', recipient_email: 'primarie.floresti@mock.ro' },
    created_at: '2026-05-20T05:30:02Z',
  },
  {
    id: 'evt-008',
    hash: 'a1b2c3d4e5f600000000000000000000000000000000000000000000000008bb',
    prev_hash: 'a1b2c3d4e5f600000000000000000000000000000000000000000000000007aa',
    type: 'email.sent',
    actor_id: null,
    payload: { spray_report_id: 'spray-seed-1', recipient: 'primarie.floresti@mock.ro', subject: 'Notificare stropire — Confidor Energy' },
    created_at: '2026-05-20T05:30:03Z',
  },
  {
    id: 'evt-009',
    hash: 'a1b2c3d4e5f600000000000000000000000000000000000000000000000009cc',
    prev_hash: 'a1b2c3d4e5f600000000000000000000000000000000000000000000000008bb',
    type: 'alert.confirmed',
    actor_id: 'user-apicultor-1',
    payload: { alert_dispatch_id: 'dispatch-seed-1a', channel: 'call', final_status: 'confirmed_call' },
    created_at: '2026-05-20T05:30:13Z',
  },
  {
    id: 'evt-010',
    hash: 'a1b2c3d4e5f600000000000000000000000000000000000000000000000010dd',
    prev_hash: 'a1b2c3d4e5f600000000000000000000000000000000000000000000000009cc',
    type: 'alert.confirmed',
    actor_id: 'user-apicultor-1',
    payload: { alert_dispatch_id: 'dispatch-seed-1b', channel: 'call', final_status: 'confirmed_call' },
    created_at: '2026-05-20T05:30:21Z',
  },
  {
    id: 'evt-011',
    hash: 'b2c3d4e5f6a700000000000000000000000000000000000000000000000011ee',
    prev_hash: 'a1b2c3d4e5f600000000000000000000000000000000000000000000000010dd',
    type: 'spray.created',
    actor_id: 'user-fermier-1',
    payload: { spray_report_id: 'spray-seed-2', substance: 'Mospilan 20 SG', toxicity: 'T', parcel_id: 'parcel-2', surface_ha: 7.2 },
    created_at: '2026-05-22T06:45:00Z',
  },
  {
    id: 'evt-012',
    hash: 'b2c3d4e5f6a700000000000000000000000000000000000000000000000012ff',
    prev_hash: 'b2c3d4e5f6a700000000000000000000000000000000000000000000000011ee',
    type: 'alert.dispatched',
    actor_id: null,
    payload: { alert_dispatch_id: 'dispatch-seed-2a', apiary_id: 'apiary-1', beekeeper_id: 'user-apicultor-1', distance_km: 0.6, downwind: true },
    created_at: '2026-05-22T06:45:01Z',
  },
  {
    id: 'evt-013',
    hash: 'b2c3d4e5f6a700000000000000000000000000000000000000000000000013aa',
    prev_hash: 'b2c3d4e5f6a700000000000000000000000000000000000000000000000012ff',
    type: 'alert.confirmed',
    actor_id: 'user-apicultor-1',
    payload: { alert_dispatch_id: 'dispatch-seed-2a', channel: 'call', final_status: 'confirmed_call' },
    created_at: '2026-05-22T06:45:14Z',
  },
  {
    id: 'evt-014',
    hash: 'd4e5f6a7b8c900000000000000000000000000000000000000000000000014bb',
    prev_hash: 'b2c3d4e5f6a700000000000000000000000000000000000000000000000013aa',
    type: 'damage.filed',
    actor_id: 'user-apicultor-1',
    payload: { damage_claim_id: 'damage-seed-1', apiary_id: 'apiary-2', related_spray_id: 'spray-seed-1', hive_loss_count: 3 },
    created_at: '2026-05-21T10:15:00Z',
  },
  {
    id: 'evt-015',
    hash: 'c3d4e5f6a7b800000000000000000000000000000000000000000000000015cc',
    prev_hash: 'd4e5f6a7b8c900000000000000000000000000000000000000000000000014bb',
    type: 'spray.created',
    actor_id: 'user-fermier-1',
    payload: { spray_report_id: 'spray-seed-3', substance: 'Decis Mega', toxicity: 'T-', parcel_id: 'parcel-3', surface_ha: 3.8 },
    created_at: '2026-05-23T07:50:00Z',
  },
  {
    id: 'evt-016',
    hash: 'e5f6a7b8c9d000000000000000000000000000000000000000000000000016dd',
    prev_hash: 'c3d4e5f6a7b800000000000000000000000000000000000000000000000015cc',
    type: 'alert.urgent',
    actor_id: null,
    payload: { alert_dispatch_id: 'dispatch-seed-2a', apiary_id: 'apiary-1', beekeeper_id: 'user-apicultor-1', distance_km: 0.6, toxicity: 'T+', downwind: true, reason: 'tox_high_downwind_close' },
    created_at: '2026-05-22T06:44:55Z',
  },
  {
    id: 'evt-017',
    hash: 'f6a7b8c9d0e100000000000000000000000000000000000000000000000017ee',
    prev_hash: 'e5f6a7b8c9d000000000000000000000000000000000000000000000000016dd',
    type: 'alert.urgent',
    actor_id: null,
    payload: { alert_dispatch_id: 'dispatch-seed-1a', apiary_id: 'apiary-2', beekeeper_id: 'user-apicultor-1', distance_km: 0.8, toxicity: 'T+', downwind: true, reason: 'tox_high_downwind_close' },
    created_at: '2026-05-20T05:29:55Z',
  },
]
