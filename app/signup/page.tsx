import { redirect } from 'next/navigation'

import SignupPageClient from './signup-page-client'
import { getCurrentUser } from '@/lib/server/auth/current-user'
import { getDashboardPathForRole } from '@/lib/auth/redirects'

export default async function SignupPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect(getDashboardPathForRole(user.role))
  }

  return <SignupPageClient />
}
