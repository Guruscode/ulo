'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/providers/auth-provider'
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet'
import {
  Heart,
  Settings,
  User,
  BarChart3,
  Home,
  Building2,
  Menu,
  X,
  Bell,
  Search,
  CreditCard,
  LogOut,
} from 'lucide-react'
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
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { AuthenticatedUserMenu } from '@/components/auth/authenticated-user-menu'
import { toast } from 'sonner'

const navItems = [
  { id: 'overview', label: 'Dashboard', icon: BarChart3, href: '/dashboard' },
  { id: 'properties', label: 'Properties', icon: Home, href: '/dashboard/properties' },
  { id: 'hotels', label: 'Hotels', icon: Building2, href: '/dashboard/hotels' },
  { id: 'notifications', label: 'Notifications', icon: Bell, href: '/dashboard/notifications' },
  { id: 'favorites', label: 'Saved', icon: Heart, href: '/dashboard/favorites' },
  { id: 'subscriptions', label: 'Subscription', icon: CreditCard, href: '/dashboard/subscriptions' },
]

const bottomNavItems = [
  { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const displayName = user?.name || 'User'
  const canManageProperties = user?.role === 'admin' || user?.accountType === 'agent' || user?.accountType === 'landlord'
  const canManageHotels = user?.role === 'admin' || user?.accountType === 'agent' || user?.accountType === 'hotel_manager'
  const visibleNavItems = navItems.filter((item) => {
    if (item.id === 'properties') return canManageProperties
    if (item.id === 'hotels') return canManageHotels
    return true
  })

  const handleSignOut = async () => {
    try {
      await logout()
      toast.success('Signed out successfully.')
      router.push('/login')
      router.refresh()
    } catch (_error) {
      toast.error('Unable to sign out right now.')
    }
  }

  const isCollapsedDesktop = !sidebarOpen

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => {
    const showExpandedSidebar = isMobile || sidebarOpen

    return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div
        className={`h-20 flex items-center border-b border-gray-100 ${showExpandedSidebar ? 'justify-between px-4' : 'justify-center px-2'}`}
      >
        <Link
          href="/"
          className={`flex items-center ${showExpandedSidebar ? 'ml-2' : 'justify-center'}`}
          onClick={() => isMobile && setMobileMenuOpen(false)}
        >
          <Image
            src={showExpandedSidebar ? '/brand/logo-primary.svg' : '/brand/favicon-black.png'}
            alt="ULO"
            width={showExpandedSidebar ? 212 : 40}
            height={showExpandedSidebar ? 64 : 40}
            className={showExpandedSidebar ? 'h-14 w-auto' : 'h-10 w-10 object-contain'}
            priority
          />
        </Link>
        {isMobile && (
          <button onClick={() => setMobileMenuOpen(false)} className="p-2">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* User Info */}
      <div className={`border-b border-gray-100 ${showExpandedSidebar ? 'p-4' : 'px-2 py-4'}`}>
        <div className={`flex items-center ${showExpandedSidebar ? 'gap-3' : 'justify-center'}`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-secondary flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          {showExpandedSidebar ? (
            <div>
              <p className="font-semibold text-gray-900 text-sm">{displayName}</p>
              <p className="text-xs text-gray-500">{user?.email || 'Dashboard'}</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-4 px-3 overflow-y-auto">
        <div className="space-y-1">
          {visibleNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <TooltipProvider key={item.id} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      onClick={() => isMobile && setMobileMenuOpen(false)}
                      className={`w-full flex items-center rounded-lg font-medium text-sm transition-all ${
                        showExpandedSidebar ? 'justify-start gap-3 px-3 py-2.5' : 'justify-center px-0 py-3'
                      } ${
                        isActive
                          ? 'bg-secondary text-white'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      {showExpandedSidebar ? item.label : null}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsedDesktop && !isMobile ? (
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  ) : null}
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          {bottomNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <TooltipProvider key={item.id} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      onClick={() => isMobile && setMobileMenuOpen(false)}
                      className={`w-full flex items-center rounded-lg font-medium text-sm transition-all ${
                        showExpandedSidebar ? 'justify-start gap-3 px-3 py-2.5' : 'justify-center px-0 py-3'
                      } ${
                        isActive
                          ? 'bg-secondary text-white'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      {showExpandedSidebar ? item.label : null}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsedDesktop && !isMobile ? (
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  ) : null}
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </div>
      </div>

      {/* Sign Out */}
      <div className={`border-t border-gray-100 ${showExpandedSidebar ? 'p-4' : 'p-3'}`}>
        <AlertDialog>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className={`text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900 bg-transparent ${
                      showExpandedSidebar ? 'w-full justify-start' : 'w-full justify-center px-0'
                    }`}
                  >
                    <LogOut className={`w-4 h-4 ${showExpandedSidebar ? 'mr-2' : ''}`} />
                    {showExpandedSidebar ? 'Sign Out' : null}
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              {isCollapsedDesktop && !isMobile ? (
                <TooltipContent side="right">Sign Out</TooltipContent>
              ) : null}
            </Tooltip>
          </TooltipProvider>
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
      </div>
    </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <SidebarContent isMobile />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-h-screen ${
          sidebarOpen ? 'lg:max-w-[calc(100%-16rem)]' : 'lg:max-w-[calc(100%-5rem)]'
        }`}
      >
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 lg:px-6">
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-50 rounded-lg"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>

              {/* Desktop Toggle */}
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:flex p-2 hover:bg-gray-50 rounded-lg"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>

              {/* Search - Desktop Only */}
              <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 w-48 lg:w-64">
                <Search className="w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent border-none outline-none text-sm w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-3">
              {/* Notifications */}
              <Link href="/dashboard/notifications">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </Button>
              </Link>

              <AuthenticatedUserMenu
                dashboardHref="/dashboard"
                profileHref="/dashboard/profile"
                className="h-9 gap-2 border-gray-200 bg-white px-3"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 pb-24 lg:pb-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-2 py-2">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg transition-colors min-w-[64px] ${
                    isActive
                      ? 'text-secondary'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}
