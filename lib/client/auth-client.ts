import type { AuthUser } from '@/lib/auth/types'
import { apiRequest } from '@/lib/client/api-client'

type AuthPayload = {
  user: AuthUser
  redirectPath: string
}

export type SignupOtpRequestPayload = {
  verificationToken: string
  email: string
  expiresInMinutes: number
}

export function signupRequest(input: {
  name: string
  email: string
  phone: string
  address: string
  state: string
  localGovernment: string
  accountType: 'user' | 'agent' | 'landlord' | 'hotel_manager'
  identityType?: 'bvn' | null
  identityNumber?: string | null
  password: string
  agreeToTerms: boolean
}) {
  return apiRequest<SignupOtpRequestPayload>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function verifySignupOtpRequest(input: { verificationToken: string; otp: string }) {
  return apiRequest<AuthPayload>('/api/auth/signup/verify-otp', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function resendSignupOtpRequest(input: { verificationToken: string }) {
  return apiRequest<SignupOtpRequestPayload>('/api/auth/signup/resend-otp', {
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
