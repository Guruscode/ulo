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
  User,
  Settings,
  Home,
  Building2,
  MapPin,
  Users,
  FileText,
  BarChart3,
  Menu,
  X,
  Bell,
  Search,
  Shield,
  CreditCard,
  LogOut,
} from 'lucide-react'
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
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
import { AuthenticatedUserMenu } from '@/components/auth/authenticated-user-menu'
import { toast } from 'sonner'

const navItems = [
  { id: 'overview', label: 'Overview', icon: BarChart3, href: '/admin' },
  { id: 'users', label: 'Users', icon: Users, href: '/admin/users' },
  { id: 'properties', label: ' Properties', icon: Home, href: '/admin/properties' },
  { id: 'hotels', label: 'Hotels', icon: Building2, href: '/admin/hotels' },
  { id: 'agents', label: 'Agents', icon: User, href: '/admin/agents' },
  { id: 'blog', label: 'Blog', icon: FileText, href: '/admin/blog' },
  { id: 'neighbourhoods', label: 'Neighbourhoods', icon: MapPin, href: '/admin/neighbourhoods' },
  { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, href: '/admin/subscriptions' },
]

const bottomNavItems = [
  { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const displayName = user?.name || 'Admin User'
  const displayEmail = user?.email || 'admin@ulo.com'

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

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Logo */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-slate-700">
        <Link href="/admin" className="ml-2 flex items-center" onClick={() => isMobile && setMobileMenuOpen(false)}>
          <Image
            src="/logo-transperient.png"
            alt="ULO Admin"
            width={212}
            height={64}
            className="h-14 w-auto"
            priority
          />
        </Link>
        {isMobile && (
          <button onClick={() => setMobileMenuOpen(false)} className="p-2">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        )}
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">{displayName}</p>
            <p className="text-xs text-slate-400">{displayEmail}</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-4 px-3 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <TooltipProvider key={item.id} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      onClick={() => isMobile && setMobileMenuOpen(false)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  </TooltipTrigger>
                  {!sidebarOpen && !isMobile && (
                    <TooltipContent side="right">
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-700">
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
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  </TooltipTrigger>
                  {!sidebarOpen && !isMobile && (
                    <TooltipContent side="right">
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </div>
      </div>

      {/* Sign Out */}
      <div className="p-4 border-t border-slate-700">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Log out?</AlertDialogTitle>
              <AlertDialogDescription>
                You will need to sign in again to access your admin account.
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

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-slate-900">
          <SidebarContent isMobile />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:max-w-[calc(100%-16rem)]">
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
          <div className="h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 lg:px-6">
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-50 rounded-lg"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>

              {/* Desktop Toggle */}
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:flex p-2 hover:bg-slate-50 rounded-lg"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>

              {/* Search - Desktop Only */}
              <div className="hidden md:flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 w-48 lg:w-64">
                <Search className="w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent border-none outline-none text-sm w-full text-slate-700"
                />
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-3">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>

              <AuthenticatedUserMenu
                dashboardHref="/admin"
                profileHref="/admin/profile"
                className="h-9 gap-2 border-slate-200 bg-white px-3"
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
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-2 py-2">
          <div className="flex items-center justify-around">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg transition-colors min-w-[64px] ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-slate-500 hover:text-slate-700'
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
