import { cookies } from 'next/headers'
import { authChallenges, getUserById } from '@/app/api/v1/_mock/data'
import { signSession, errBadRequest } from '@/app/api/v1/_mock/auth'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { challenge_id, code } = body

  const challenge = authChallenges.get(challenge_id)
  if (!challenge) {
    return errBadRequest('invalid_2fa_code', 'Sesiune de autentificare invalidă.')
  }

  // In mock: any 6-digit code works
  if (!code || !/^\d{6}$/.test(String(code))) {
    return Response.json(
      { error: { code: 'invalid_2fa_code', message: 'Cod incorect. Reîncearcă.' } },
      { status: 401 }
    )
  }

  const user = getUserById(challenge.userId)
  if (!user) {
    return Response.json(
      { error: { code: 'invalid_2fa_code', message: 'Utilizatorul nu există.' } },
      { status: 401 }
    )
  }

  const token = await signSession(user)
  authChallenges.delete(challenge_id)

  const cookieStore = await cookies()
  cookieStore.set('ra_session', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60, // 24h
    // secure: process.env.NODE_ENV === 'production',
  })

  return Response.json({ user })
}
