export interface UserNotificationRecord {
  id: string
  userId: string
  title: string
  message: string
  href?: string | null
  createdAt: string
}
