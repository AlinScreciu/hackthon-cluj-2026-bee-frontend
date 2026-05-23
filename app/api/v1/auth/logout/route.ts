import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete('ra_session')
  return new Response(null, { status: 204 })
}
