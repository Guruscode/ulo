import type { AuthUser } from '@/lib/auth/types'
import { apiRequest } from '@/lib/client/api-client'

type AuthPayload = {
  user: AuthUser
  redirectPath: string
}

export function signupRequest(input: {
  name: string
  email: string
  password: string
  agreeToTerms: boolean
}) {
  return apiRequest<AuthPayload>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function loginRequest(input: { email: string; password: string }) {
  return apiRequest<AuthPayload>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function logoutRequest() {
  return apiRequest<{ success: true }>('/api/auth/logout', {
    method: 'POST',
    body: JSON.stringify({}),
  })
}

export function meRequest() {
  return apiRequest<{ user: AuthUser; redirectPath: string }>('/api/auth/me', {
    method: 'GET',
  })
}
