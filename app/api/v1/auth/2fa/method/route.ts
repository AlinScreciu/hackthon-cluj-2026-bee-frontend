import { authChallenges } from '@/app/api/v1/_mock/data'
import { errBadRequest } from '@/app/api/v1/_mock/auth'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { challenge_id, method } = body

  const challenge = authChallenges.get(challenge_id)
  if (!challenge) {
    return errBadRequest('not_found', 'Sesiune de autentificare invalidă.')
  }

  const masked = method === 'email' ? 'a***@test.ro' : '+40 7•• ••• •01'
  authChallenges.set(challenge_id, { ...challenge, method, masked })

  return Response.json({ challenge_id, method, masked_destination: masked })
}
