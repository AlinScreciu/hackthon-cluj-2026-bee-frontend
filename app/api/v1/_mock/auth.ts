import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { User } from '@/lib/api/types'

const SECRET = new TextEncoder().encode(
  process.env.MOCK_JWT_SECRET ?? 'dev-secret-hackathon-radarul-albinelor'
)

export async function signSession(user: User): Promise<string> {
  return new SignJWT({ sub: user.id, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET)
}

export async function verifySession(): Promise<{ sub: string; role: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('ra_session')?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as { sub: string; role: string }
  } catch {
    return null
  }
}

export function errUnauthorized() {
  return Response.json(
    { error: { code: 'unauthorized', message: 'Sesiune expirată. Reintră în cont.' } },
    { status: 401 }
  )
}

export function errForbidden() {
  return Response.json(
    { error: { code: 'forbidden_role', message: 'Nu ai permisiune pentru această acțiune.' } },
    { status: 403 }
  )
}

export function errNotFound(msg = 'Resursa nu a fost găsită.') {
  return Response.json(
    { error: { code: 'not_found', message: msg } },
    { status: 404 }
  )
}

export function errBadRequest(code: string, message: string, details?: Record<string, string>) {
  return Response.json(
    { error: { code, message, details: details ?? null } },
    { status: 400 }
  )
}
