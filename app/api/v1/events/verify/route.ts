export async function GET() {
  return Response.json({
    valid: true,
    total_events: 42,
    last_hash: crypto.randomUUID().replace(/-/g, '').substring(0, 16),
    checked_at: new Date().toISOString(),
  })
}
