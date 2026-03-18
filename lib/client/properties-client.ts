import type { PropertyApprovalStatus, PropertyRecord, PropertyScope, PropertyUpsertInput } from '@/lib/properties/types'
import { apiRequest } from '@/lib/client/api-client'

export function listPropertiesRequest(input?: {
  scope?: PropertyScope
  search?: string
  type?: string
  status?: string
  approvalStatus?: string
  limit?: number
}) {
  const params = new URLSearchParams()

  if (input?.scope) params.set('scope', input.scope)
  if (input?.search) params.set('search', input.search)
  if (input?.type) params.set('type', input.type)
  if (input?.status) params.set('status', input.status)
  if (input?.approvalStatus) params.set('approvalStatus', input.approvalStatus)
  if (input?.limit) params.set('limit', String(input.limit))

  const query = params.toString()
  return apiRequest<{ properties: PropertyRecord[] }>(`/api/properties${query ? `?${query}` : ''}`, {
    method: 'GET',
  })
}

export function getPropertyRequest(id: string) {
  return apiRequest<{ property: PropertyRecord }>(`/api/properties/${id}`, {
    method: 'GET',
  })
}

export function createPropertyRequest(input: PropertyUpsertInput) {
  return apiRequest<{ property: PropertyRecord }>('/api/properties', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updatePropertyRequest(id: string, input: PropertyUpsertInput) {
  return apiRequest<{ property: PropertyRecord }>(`/api/properties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export function deletePropertyRequest(id: string) {
  return apiRequest<{ success: true }>(`/api/properties/${id}`, {
    method: 'DELETE',
  })
}

export function updatePropertyApprovalRequest(
  id: string,
  input: { approvalStatus: Extract<PropertyApprovalStatus, 'approved' | 'rejected' | 'pending_review'>; rejectionReason?: string | null }
) {
  return apiRequest<{ property: PropertyRecord }>(`/api/admin/properties/${id}/approval`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}
