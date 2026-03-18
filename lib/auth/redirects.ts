import type { UserRole } from '@/lib/auth/types'

export function getDashboardPathForRole(role: UserRole) {
  return role === 'admin' ? '/admin' : '/dashboard'
}
