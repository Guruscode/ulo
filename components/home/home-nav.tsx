'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/providers/auth-provider'
import { AuthenticatedUserMenu } from '@/components/auth/authenticated-user-menu'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
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
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function HomeNav() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { isAuthenticated, isLoading, user, logout } = useAuth()

  const navItems = [
    { href: '/', label: 'Home', key: 'home' },
    { href: '/listings', label: 'Property', key: 'property' },
    { href: '/agents', label: 'Agents', key: 'agents' },
    { href: '/hotels', label: 'Hotels', key: 'hotels' },
    { href: '/pricing', label: 'Pricing', key: 'pricing' },
    { href: '/blog', label: 'Blog', key: 'blog' },
    { href: '/help', label: 'Contact', key: 'contact' },
  ]

  const handleSignOut = async () => {
    await logout()
    setIsOpen(false)
    toast.success('Signed out successfully.')
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 mb-10">
      {/* Transparent gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent h-20" />
      
      <div className="relative max-w-full mx-auto px-6 sm:px-8 lg:px-16 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="z-10 ml-2 sm:ml-4 lg:ml-6 group">
          <Image
            src="/brand/logo-white.svg"
            alt="ULO"
            width={212}
            height={64}
            className="h-14 w-auto sm:h-16"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          {navItems.map(({ href, label, key }) => (
            <Link
              key={key}
              href={href}
              className="text-white text-sm font-medium hover:text-white/80 transition-colors duration-200 relative group"
            >
              {label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 lg:gap-4 z-10">
          {isLoading ? (
            <Button
              className="bg-white hover:bg-white text-gray-700 text-sm font-semibold px-3 lg:px-4 py-2.5 rounded-lg shadow-lg"
              disabled
            >
              Account
            </Button>
          ) : isAuthenticated ? (
            <AuthenticatedUserMenu
              dashboardHref={user?.role === 'admin' ? '/admin' : '/dashboard'}
              profileHref={user?.role === 'admin' ? '/admin/profile' : '/dashboard/profile'}
              className="bg-white hover:bg-white/90 text-gray-700 text-sm font-semibold px-3 lg:px-4 py-2.5 rounded-lg transition-all duration-200 shadow-lg"
            />
          ) : (
            <Link href="/login">
              <Button
                className="bg-white hover:bg-white/90 text-gray-700 text-sm font-semibold px-5 lg:px-6 py-2.5 rounded-lg transition-all duration-200 shadow-lg"
              >
                List Properties
              </Button>
            </Link>
          )}

          <button
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-200 backdrop-blur-sm"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 backdrop-blur-sm',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile menu */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 w-full bg-gradient-to-b from-gray-900/95 to-black/95 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out backdrop-blur-sm',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-end px-6 py-6">
            <button
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Nav Items */}
          <div className="flex-1 px-6 overflow-y-auto">
            <div className="space-y-1">
              {navItems.map(({ href, label, key }) => (
                <Link
                  key={key}
                  href={href}
                  className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 font-medium text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="border-t border-white/10 px-6 py-6 space-y-3">
            {isAuthenticated ? (
              <>
                <Link
                  href={user?.role === 'admin' ? '/admin' : '/dashboard'}
                  className="block text-center py-2.5 text-white/90 hover:text-white text-sm font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href={user?.role === 'admin' ? '/admin/profile' : '/dashboard/profile'}
                  className="block text-center py-2.5 text-white/90 hover:text-white text-sm font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="block w-full text-center py-2.5 text-white/90 hover:text-white text-sm font-medium transition-colors">
                      Log out
                    </button>
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
                      <AlertDialogAction onClick={() => void handleSignOut()}>Log out</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="block text-center py-2.5 text-white/90 hover:text-white text-sm font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>

                <Link
                  href="/login"
                  className="block text-center py-2.5 bg-white hover:bg-white/90 text-gray-700 rounded-full font-semibold text-sm transition-all shadow-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
