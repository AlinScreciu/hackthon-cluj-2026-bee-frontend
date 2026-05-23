import { verifySession, errUnauthorized, errBadRequest } from '@/app/api/v1/_mock/auth'

export async function POST(req: Request) {
  const session = await verifySession()
  if (!session) return errUnauthorized()

  const body = await req.json().catch(() => ({}))
  if (!body.filename || !body.mime) {
    return errBadRequest('validation_failed', 'filename și mime sunt obligatorii.')
  }

  const ext = body.filename.split('.').pop() ?? 'bin'
  const objectKey = `uploads/${crypto.randomUUID()}.${ext}`
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '') ?? ''

  return Response.json({
    upload_url: `${baseUrl}/api/v1/uploads/${objectKey}`,
    public_url: `${baseUrl}/api/v1/uploads/${objectKey}`,
    fields: { key: objectKey, 'Content-Type': body.mime },
  }, { status: 200 })
}
