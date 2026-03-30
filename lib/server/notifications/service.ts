import type { AuthUser } from '@/lib/auth/types'
import { ApiError } from '@/lib/server/http/api-error'

import {
  createUserNotificationRecord,
  deleteUserNotificationRecord,
  getUserNotificationRecord,
  listUserNotificationRecords,
} from './repository'

export async function createUserNotification(input: {
  userId: string
  title: string
  message: string
  href?: string | null
}) {
  await createUserNotificationRecord(input)
}

export async function listNotificationsForUser(actor: AuthUser) {
  return listUserNotificationRecords(actor.id)
}

export async function deleteNotificationForUser(actor: AuthUser, id: string) {
  const notification = await getUserNotificationRecord(id)
  if (!notification || notification.userId !== actor.id) {
    throw new ApiError(404, 'NOTIFICATION_NOT_FOUND', 'Notification not found.')
  }
  await deleteUserNotificationRecord(id)
}
