import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/lib/server/auth/current-user'

export default async function AdminRouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'admin') {
    redirect('/dashboard')
  }

  return children
}
