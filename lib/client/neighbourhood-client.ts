import { apiRequest } from '@/lib/client/api-client'
import type { NeighbourhoodRecord } from '@/lib/server/neighbourhoods/types'

export function listNeighbourhoodsRequest() {
  return apiRequest<{ neighbourhoods: NeighbourhoodRecord[] }>('/api/neighbourhoods', { method: 'GET' })
}

export function getNeighbourhoodRequest(slug: string) {
  return apiRequest<{ neighbourhood: NeighbourhoodRecord }>(`/api/neighbourhoods/${slug}`, { method: 'GET' })
}
