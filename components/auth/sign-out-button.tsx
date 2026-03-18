'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/providers/auth-provider'
import { ApiClientError } from '@/lib/client/api-error'

export function SignOutButton({
  className,
  variant = 'outline',
}: {
  className?: string
  variant?: React.ComponentProps<typeof Button>['variant']
}) {
  const router = useRouter()
  const { logout } = useAuth()

  const handleClick = async () => {
    try {
      await logout()
      toast.success('Signed out successfully.')
      router.push('/login')
      router.refresh()
    } catch (error) {
      const message =
        error instanceof ApiClientError ? error.message : 'Unable to sign out right now.'
      toast.error(message)
    }
  }

  return (
    <Button variant={variant} className={className} onClick={handleClick}>
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </Button>
  )
}
