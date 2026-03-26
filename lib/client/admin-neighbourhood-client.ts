import { apiRequest } from '@/lib/client/api-client'
import type { NeighbourhoodRecord } from '@/lib/server/neighbourhoods/types'

type NeighbourhoodPayload = {
  name: string
  description: string
  fullDescription: string
  image: string
  latitude: string
  longitude: string
  amenities: string[]
  highlights: string[]
  population: string
  avgIncome: string
  avgAge: string
  phases: { name: string; description: string; image: string }[]
}

export function listAdminNeighbourhoodsRequest() {
  return apiRequest<{ neighbourhoods: NeighbourhoodRecord[] }>('/api/admin/neighbourhoods', { method: 'GET' })
}

export function createAdminNeighbourhoodRequest(input: NeighbourhoodPayload) {
  return apiRequest<{ neighbourhood: NeighbourhoodRecord }>('/api/admin/neighbourhoods', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateAdminNeighbourhoodRequest(id: string, input: NeighbourhoodPayload) {
  return apiRequest<{ neighbourhood: NeighbourhoodRecord }>(`/api/admin/neighbourhoods/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export function deleteAdminNeighbourhoodRequest(id: string) {
  return apiRequest<Record<string, never>>(`/api/admin/neighbourhoods/${id}`, { method: 'DELETE' })
}
