import { jwtVerify, SignJWT } from 'jose'
import { NextResponse } from 'next/server'

import type { AuthSessionPayload } from '@/lib/auth/types'
import { getServerEnv } from '@/lib/server/config/env'

export const SESSION_COOKIE_NAME = 'ulo_session'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

function getSessionSecret() {
  return new TextEncoder().encode(getServerEnv().sessionSecret)
}

export async function createSessionToken(payload: AuthSessionPayload) {
  return new SignJWT({
    email: payload.email,
    name: payload.name,
    role: payload.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSessionSecret())
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getSessionSecret())

  return {
    sub: String(payload.sub),
    email: String(payload.email),
    name: String(payload.name),
    role: payload.role as AuthSessionPayload['role'],
  }
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
}
