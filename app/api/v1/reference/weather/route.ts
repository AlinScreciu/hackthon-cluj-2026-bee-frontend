export async function GET(req: Request) {
  const url = new URL(req.url)
  const lat = parseFloat(url.searchParams.get('lat') ?? '46.77')
  const lng = parseFloat(url.searchParams.get('lng') ?? '23.59')
  return Response.json({
    wind_direction_deg: 225,
    wind_speed_ms: 3.5,
    temperature_c: 22,
    fetched_at: new Date().toISOString(),
  })
}
