'use client'

import { useEffect, useState } from 'react'
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
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function HomeNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isLoading, user, logout } = useAuth()
  const isHomePage = pathname === '/'
  const useLightNav = !hasScrolled

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

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 32)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 mb-10">
      <div
        className={cn(
          'absolute inset-0 h-24 transition-all duration-300',
          useLightNav
            ? 'bg-gradient-to-b from-black/45 via-black/18 to-transparent'
            : isHomePage
              ? 'border-b border-slate-200/80 bg-white/92 shadow-sm backdrop-blur-xl'
              : 'border-b border-slate-200/80 bg-white/92 shadow-sm backdrop-blur-xl',
        )}
      />
      
      <div className="relative mx-auto flex h-24 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link href="/" className="z-10 ml-2 sm:ml-4 lg:ml-6 group">
          <Image
            src={useLightNav ? '/brand/logo-white.svg' : '/brand/logo-navy.svg'}
            alt="ULO"
            width={212}
            height={64}
            className="h-12 w-auto sm:h-14"
            priority
          />
        </Link>

        <div
          className={cn(
            'absolute left-1/2 hidden -translate-x-1/2 items-center rounded-full px-4 py-3 backdrop-blur-xl transition-all duration-300 lg:flex',
            useLightNav
              ? 'border border-white/18 bg-white/8 shadow-[0_18px_50px_rgba(0,0,0,0.18)]'
              : 'border border-slate-200 bg-white/90 shadow-[0_16px_40px_rgba(15,23,42,0.08)]',
          )}
        >
          {navItems.map(({ href, label, key }) => (
            <Link
              key={key}
              href={href}
              className={cn(
                'relative rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200',
                useLightNav
                  ? 'text-white/92 hover:bg-white/8 hover:text-white'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950',
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 lg:gap-4 z-10">
          {isLoading ? (
            <Button
              className={cn(
                'rounded-full px-4 py-2.5 text-sm font-semibold backdrop-blur-md',
                useLightNav
                  ? 'border border-white/15 bg-white/14 text-white shadow-lg hover:bg-white/18'
                  : 'border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50',
              )}
              disabled
            >
              Account
            </Button>
          ) : isAuthenticated ? (
            <AuthenticatedUserMenu
              dashboardHref={user?.role === 'admin' ? '/admin' : '/dashboard'}
              profileHref={user?.role === 'admin' ? '/admin/profile' : '/dashboard/profile'}
              className={cn(
                'rounded-full px-4 py-2.5 text-sm font-semibold backdrop-blur-md transition-all duration-200',
                useLightNav
                  ? 'border border-white/15 bg-white/14 text-white shadow-lg hover:bg-white/20'
                  : 'border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50',
              )}
            />
          ) : (
            <div className="hidden items-center gap-3 lg:flex">
              <Link
                href="/signup"
                className={cn(
                  'text-sm font-medium transition',
                  useLightNav ? 'text-white/88 hover:text-white' : 'text-slate-600 hover:text-slate-950',
                )}
              >
                Sign up
              </Link>
              <Link href="/login">
                <Button
                  className={cn(
                    'rounded-full px-5 py-2.5 text-sm font-semibold backdrop-blur-md transition-all duration-200',
                    useLightNav
                      ? 'border border-white/20 bg-white/18 text-white shadow-lg hover:bg-white/24'
                      : 'border border-slate-200 bg-slate-950 text-white shadow-sm hover:bg-slate-800',
                  )}
                >
                  List Properties
                </Button>
              </Link>
            </div>
          )}

          {!isAuthenticated && !isLoading ? (
            <Link href="/login" className="lg:hidden">
              <Button
                className={cn(
                  'rounded-full px-4 py-2.5 text-sm font-semibold backdrop-blur-md transition-all duration-200',
                  useLightNav
                    ? 'border border-white/20 bg-white/14 text-white shadow-lg hover:bg-white/20'
                    : 'border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50',
                )}
              >
                Login
              </Button>
            </Link>
          ) : null}

          <button
            className={cn(
              'rounded-full p-2 backdrop-blur-sm transition-all duration-200 lg:hidden',
              useLightNav
                ? 'border border-white/15 bg-white/10 text-white hover:bg-white/16'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
            )}
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
          <div className="flex items-center justify-between px-6 py-6">
            <Image
              src="/brand/logo-white.svg"
              alt="ULO"
              width={140}
              height={42}
              className="h-10 w-auto"
            />
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
