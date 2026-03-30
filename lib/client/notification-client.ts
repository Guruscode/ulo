import { apiRequest } from '@/lib/client/api-client'
import type { UserNotificationRecord } from '@/lib/server/notifications/types'

export function listNotificationsRequest() {
  return apiRequest<{ notifications: UserNotificationRecord[] }>('/api/notifications', { method: 'GET' })
}

export function deleteNotificationRequest(id: string) {
  return apiRequest<Record<string, never>>(`/api/notifications/${id}`, { method: 'DELETE' })
}
