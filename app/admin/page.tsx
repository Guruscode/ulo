'use client'

import Link from 'next/link'
import { Building2, FileText, Home, MessageSquare, Plus, Users } from 'lucide-react'
import { motion } from 'framer-motion'

import { LiveAdminDashboard } from '@/components/admin/live-admin-dashboard'
import AdminLayout from '@/components/admin/admin-layout'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const quickLinks = [
  { label: 'Add User', href: '/admin/users', icon: Users },
  { label: 'Add Property', href: '/admin/properties', icon: Home },
  { label: 'Add Hotel', href: '/admin/hotels', icon: Building2 },
  { label: 'Add Blog Post', href: '/admin/blog', icon: FileText },
]

const recentActivities = [
  {
    id: 1,
    title: 'Property moderation is live',
    description: 'Property submissions remain hidden until approved by admin.',
    time: 'Now',
    icon: Home,
    color: 'bg-green-100 text-green-600',
  },
  {
    id: 2,
    title: 'Hotel workflows are live',
    description: 'Hotels, rooms, and bookings now persist in Turso.',
    time: 'Now',
    icon: Building2,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    id: 3,
    title: 'Reservation management is available',
    description: 'Admin and hotel owners can update booking status from dashboards.',
    time: 'Now',
    icon: MessageSquare,
    color: 'bg-yellow-100 text-yellow-600',
  },
]

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] || 'Admin'

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-4 sm:space-y-6">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">Welcome back, {firstName}! 👋</h1>
          <p className="text-slate-600 mt-1 text-sm sm:text-base">Your live platform metrics and moderation surfaces are below.</p>
        </div>

        <motion.div variants={fadeInUp} initial="initial" animate="animate">
          <LiveAdminDashboard />
        </motion.div>

        <motion.div variants={fadeInUp} initial="initial" animate="animate">
          <Card className="bg-white p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {quickLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link key={link.label} href={link.href}>
                    <Button variant="outline" className="w-full h-10 sm:h-12 border-slate-200 hover:bg-slate-50 hover:border-blue-300 bg-transparent text-xs sm:text-sm">
                      <Icon className="w-4 h-4 mr-1.5 sm:mr-2" />
                      {link.label}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <motion.div variants={fadeInUp} initial="initial" animate="animate">
            <Card className="bg-white p-4 sm:p-6 h-full">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4">Operational Notes</h2>
              <div className="space-y-3 sm:space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon
                  return (
                    <div key={activity.id} className="flex items-start gap-3 p-3 border border-slate-100 rounded-lg">
                      <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900 text-sm">{activity.title}</p>
                        <p className="text-xs sm:text-sm text-slate-500">{activity.description}</p>
                      </div>
                      <span className="text-xs text-slate-400 flex-shrink-0">{activity.time}</span>
                    </div>
                  )
                })}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp} initial="initial" animate="animate">
            <Card className="bg-white p-4 sm:p-6 h-full">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4">Data Model</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-700">Properties</span>
                  <span className="font-bold text-slate-900">Turso-backed</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-700">Hotels & Rooms</span>
                  <span className="font-bold text-slate-900">Turso-backed</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-700">Bookings</span>
                  <span className="font-bold text-slate-900">Turso-backed</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-700">Moderation</span>
                  <span className="font-bold text-green-600">Approval enforced</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </AdminLayout>
  )
}
