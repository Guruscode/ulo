'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronDown, LogOut, User } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useAuth } from '@/components/providers/auth-provider'
import { ApiClientError } from '@/lib/client/api-error'

export function AuthenticatedUserMenu({
  dashboardHref,
  profileHref,
  className,
  variant = 'outline',
  dark = false,
}: {
  dashboardHref: string
  profileHref: string
  className?: string
  variant?: React.ComponentProps<typeof Button>['variant']
  dark?: boolean
}) {
  const router = useRouter()
  const { user, logout } = useAuth()
  const displayName = user?.name || 'Account'

  const handleSignOut = async () => {
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          className={className}
        >
          <div className={`flex h-7 w-7 items-center justify-center rounded-full ${dark ? 'bg-white/20 text-white' : 'bg-secondary text-white'}`}>
            <User className="h-4 w-4" />
          </div>
          <span className="hidden sm:inline max-w-28 truncate">{displayName}</span>
          <ChevronDown className={`h-4 w-4 ${dark ? 'text-white/80' : 'text-gray-500'}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href={dashboardHref}>Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={profileHref}>Profile</Link>
        </DropdownMenuItem>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Log out?</AlertDialogTitle>
              <AlertDialogDescription>
                You will need to sign in again to access your account and dashboards.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => void handleSignOut()}>
                Log out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
