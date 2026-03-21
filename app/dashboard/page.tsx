'use client'

import Link from 'next/link'
import { Eye, Plus, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

import LiveDashboardStats from '@/components/dashboard/live-dashboard-stats'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function DashboardPage() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] || 'there'

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-4 sm:space-y-6">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Welcome back, {firstName}! 👋</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Your live property and hotel data is shown below.</p>
        </div>

        <motion.div variants={fadeInUp} initial="initial" animate="animate">
          <LiveDashboardStats />
        </motion.div>

        <motion.div variants={fadeInUp} initial="initial" animate="animate">
          <Card className="bg-white p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <Link href="/dashboard/properties">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-white h-10 sm:h-11 text-sm">
                  <Plus className="w-4 h-4 mr-1.5 sm:mr-2" />
                  Add Property
                </Button>
              </Link>
              <Link href="/dashboard/hotels">
                <Button variant="outline" className="w-full h-10 sm:h-11 border-gray-200 hover:bg-gray-50 bg-transparent text-sm">
                  <Eye className="w-4 h-4 mr-1.5 sm:mr-2" />
                  Manage Hotels
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button variant="outline" className="w-full h-10 sm:h-11 border-gray-200 hover:bg-gray-50 bg-transparent text-sm">
                  <Settings className="w-4 h-4 mr-1.5 sm:mr-2" />
                  Profile Settings
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* <motion.div variants={fadeInUp} initial="initial" animate="animate">
          <Card className="bg-white p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Live Workflow Notes</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="rounded-lg border border-gray-100 p-3">
                <p className="font-medium text-gray-900 text-sm">Property approval is enforced</p>
                <p className="text-xs sm:text-sm text-gray-500">New or edited property listings stay hidden from the public site until admin approval.</p>
              </div>
              <div className="rounded-lg border border-gray-100 p-3">
                <p className="font-medium text-gray-900 text-sm">Hotels now support rooms and bookings</p>
                <p className="text-xs sm:text-sm text-gray-500">Create hotels with room inventory and manage reservation requests directly from your dashboard.</p>
              </div>
              <div className="rounded-lg border border-gray-100 p-3">
                <p className="font-medium text-gray-900 text-sm">Stats are database-backed</p>
                <p className="text-xs sm:text-sm text-gray-500">Dashboard figures now come from Turso instead of hardcoded placeholder values.</p>
              </div>
            </div>
          </Card>
        </motion.div> */}
      </motion.div>
    </DashboardLayout>
  )
}
