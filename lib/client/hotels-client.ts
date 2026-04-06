import type { HotelBookingInput, HotelBookingRecord, HotelRecord, HotelUpsertInput } from '@/lib/hotels/types'
import { apiRequest } from '@/lib/client/api-client'

export function listHotelsRequest(input?: { scope?: 'public' | 'mine' | 'admin'; search?: string; status?: string; approvalStatus?: string }) {
  const params = new URLSearchParams()
  if (input?.scope) params.set('scope', input.scope)
  if (input?.search) params.set('search', input.search)
  if (input?.status) params.set('status', input.status)
  if (input?.approvalStatus) params.set('approvalStatus', input.approvalStatus)
  const query = params.toString()
  return apiRequest<{ hotels: HotelRecord[] }>(`/api/hotels${query ? `?${query}` : ''}`, { method: 'GET' })
}

export function getHotelRequest(id: string) {
  return apiRequest<{ hotel: HotelRecord }>(`/api/hotels/${id}`, { method: 'GET' })
}

export function createHotelRequest(input: HotelUpsertInput) {
  return apiRequest<{ hotel: HotelRecord }>(`/api/hotels`, { method: 'POST', body: JSON.stringify(input) })
}

export function updateHotelRequest(id: string, input: HotelUpsertInput) {
  return apiRequest<{ hotel: HotelRecord }>(`/api/hotels/${id}`, { method: 'PUT', body: JSON.stringify(input) })
}

export function deleteHotelRequest(id: string) {
  return apiRequest<{ success: true }>(`/api/hotels/${id}`, { method: 'DELETE' })
}

export function updateHotelApprovalRequest(id: string, input: { approvalStatus: 'approved' | 'rejected' | 'pending_review'; rejectionReason?: string | null }) {
  return apiRequest<{ hotel: HotelRecord }>(`/api/admin/hotels/${id}/approval`, { method: 'PATCH', body: JSON.stringify(input) })
}

export function createHotelBookingRequest(hotelId: string, input: HotelBookingInput) {
  return apiRequest<{ booking: HotelBookingRecord }>(`/api/hotels/${hotelId}/bookings`, { method: 'POST', body: JSON.stringify(input) })
}

export function listHotelBookingsRequest(scope: 'mine' | 'admin') {
  return apiRequest<{ bookings: HotelBookingRecord[] }>(`/api/hotel-bookings?scope=${scope}`, { method: 'GET' })
}

export function updateHotelBookingStatusRequest(id: string, status: HotelBookingRecord['status']) {
  return apiRequest<{ booking: HotelBookingRecord }>(`/api/hotel-bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
}

export function submitHotelBookingReceiptRequest(id: string, receiptUrl: string) {
  return apiRequest<{ booking: HotelBookingRecord }>(`/api/hotel-bookings/${id}/receipt`, {
    method: 'PATCH',
    body: JSON.stringify({ receiptUrl }),
  })
}
