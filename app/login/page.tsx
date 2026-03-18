import { redirect } from 'next/navigation'

import LoginPageClient from './login-page-client'
import { getCurrentUser } from '@/lib/server/auth/current-user'
import { getDashboardPathForRole } from '@/lib/auth/redirects'

export default async function LoginPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect(getDashboardPathForRole(user.role))
  }

  return <LoginPageClient />
}
