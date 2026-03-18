import type { AuthUser } from '@/lib/auth/types'
import { apiRequest } from '@/lib/client/api-client'

export function accountRequest() {
  return apiRequest<{ user: AuthUser }>('/api/account', {
    method: 'GET',
  })
}

export function updateAccountRequest(input: {
  name: string
  email: string
  phone?: string | null
  address?: string | null
  state?: string | null
  localGovernment?: string | null
  identityType?: 'nin' | 'bvn' | null
  identityNumber?: string | null
  timezone: string
  emailNotifications: boolean
  pushNotifications: boolean
  twoFactorEnabled: boolean
}) {
  return apiRequest<{ user: AuthUser }>('/api/account', {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export function updatePasswordRequest(input: {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}) {
  return apiRequest<{ success: true }>('/api/account/password', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
