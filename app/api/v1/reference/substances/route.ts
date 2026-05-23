import { SUBSTANCES } from '@/app/api/v1/_mock/data'

export async function GET() {
  return Response.json({ items: SUBSTANCES })
}
