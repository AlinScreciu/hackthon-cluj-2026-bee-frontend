import { USERS, authChallenges } from '@/app/api/v1/_mock/data'
import { errBadRequest } from '@/app/api/v1/_mock/auth'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { cnp, password } = body

  if (!cnp || !/^\d{13}$/.test(cnp)) {
    return errBadRequest('validation_failed', 'CNP invalid.', { cnp: 'CNP trebuie să aibă exact 13 cifre.' })
  }
  if (!password) {
    return errBadRequest('validation_failed', 'Parola lipsă.', { password: 'Parola este obligatorie.' })
  }

  const user = USERS.find(u => u.cnp === cnp)
  if (!user || password !== 'test1234') {
    return Response.json(
      { error: { code: 'invalid_credentials', message: 'CNP sau parolă greșite.' } },
      { status: 401 }
    )
  }

  const challengeId = crypto.randomUUID()
  authChallenges.set(challengeId, {
    userId: user.id,
    method: 'sms',
    masked: '+40 7•• ••• •01',
  })

  // Auto-expire challenge after 10 minutes
  setTimeout(() => authChallenges.delete(challengeId), 10 * 60 * 1000)

  return Response.json({
    challenge_id: challengeId,
    method: 'sms',
    masked_destination: '+40 7•• ••• •01',
  })
}
