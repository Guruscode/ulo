'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Bell, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import DashboardLayout from '@/components/dashboard/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StackedCardListSkeleton } from '@/components/ui/page-skeletons'
import { ApiClientError } from '@/lib/client/api-error'
import { deleteNotificationRequest, listNotificationsRequest } from '@/lib/client/notification-client'
import type { UserNotificationRecord } from '@/lib/server/notifications/types'

export default function DashboardNotificationsPage() {
  const [notifications, setNotifications] = useState<UserNotificationRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await listNotificationsRequest()
        setNotifications(response.notifications)
      } catch (error) {
        toast.error(error instanceof ApiClientError ? error.message : 'Unable to load notifications.')
      } finally {
        setIsLoading(false)
      }
    }

    void load()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteNotificationRequest(id)
      setNotifications((current) => current.filter((item) => item.id !== id))
      toast.success('Notification deleted.')
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : 'Unable to delete notification.')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Property and hotel updates sent to your dashboard.</p>
        </div>

        {isLoading ? <StackedCardListSkeleton count={4} /> : null}

        {!isLoading && notifications.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-4 text-gray-600">No notifications yet.</p>
          </Card>
        ) : null}

        {!isLoading && notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
                    <h2 className="text-lg font-semibold text-gray-900">{notification.title}</h2>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    {notification.href ? (
                      <Link href={notification.href} className="inline-flex text-sm font-medium text-secondary hover:text-secondary/80">
                        Open notification
                      </Link>
                    ) : null}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => void handleDelete(notification.id)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  )
}
