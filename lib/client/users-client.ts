import type { AuthUser } from '@/lib/auth/types'
import { apiRequest } from '@/lib/client/api-client'

export function listAdminUsersRequest(input?: {
  search?: string
  accountType?: string
  approvalStatus?: string
}) {
  const params = new URLSearchParams()
  if (input?.search) params.set('search', input.search)
  if (input?.accountType) params.set('accountType', input.accountType)
  if (input?.approvalStatus) params.set('approvalStatus', input.approvalStatus)
  const query = params.toString()
  return apiRequest<{ users: AuthUser[] }>(`/api/admin/users${query ? `?${query}` : ''}`, { method: 'GET' })
}

export function updateAdminUserRequest(id: string, input: {
  name: string
  email: string
  phone?: string | null
  address?: string | null
  state?: string | null
  localGovernment?: string | null
  accountType: 'user' | 'agent' | 'landlord' | 'hotel_manager'
  approvalStatus: 'pending' | 'approved' | 'rejected'
  isActive: boolean
  propertyListingLimit?: number | null
  hotelListingLimit?: number | null
}) {
  return apiRequest<{ user: AuthUser }>(`/api/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export function listAgentsRequest() {
  return apiRequest<{ agents: AuthUser[] }>('/api/agents', { method: 'GET' })
}

export function getAgentRequest(id: string) {
  return apiRequest<{ agent: AuthUser }>(`/api/agents/${id}`, { method: 'GET' })
}
