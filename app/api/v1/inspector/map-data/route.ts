import { verifySession, errUnauthorized } from '@/app/api/v1/_mock/auth'
import { APIARIES, sprayReports, damageClaims } from '@/app/api/v1/_mock/data'

export async function GET() {
  const session = await verifySession()
  if (!session) return errUnauthorized()

  const apiaries = APIARIES.map(a => ({
    id: a.id, lat: a.lat, lng: a.lng, status: a.status, hive_count: a.hive_count
  }))

  const active_sprays = Array.from(sprayReports.values())
    .filter(s => s.status === 'scheduled' || s.status === 'in_progress')
    .map(s => ({
      id: s.id,
      lat: s.parcel.lat,
      lng: s.parcel.lng,
      toxicity: s.toxicity,
      scheduled_at: s.scheduled_at,
      radius_m: s.toxicity === 'T+' ? 3000 : s.toxicity === 'T' ? 1500 : 750,
    }))

  const damage_claims_list = Array.from(damageClaims.values()).map(c => ({
    id: c.id, lat: c.gps_lat, lng: c.gps_lng, status: c.status
  }))

  return Response.json({ apiaries, active_sprays, damage_claims: damage_claims_list })
}
