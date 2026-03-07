'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Heart,
  Settings,
  Plus,
  Eye,
} from 'lucide-react'
import { motion } from 'framer-motion'
import DashboardStats from '@/components/dashboard/dashboard-stats'
import DashboardLayout from '@/components/dashboard/dashboard-layout'

export default function DashboardPage() {
  const [userData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
  })

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-4 sm:space-y-6"
      >
        {/* Welcome Section */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Welcome back, {userData.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Here&apos;s what&apos;s happening with your properties today.
          </p>
        </div>

        {/* Statistics - Responsive grid */}
        <motion.div variants={fadeInUp} initial="initial" animate="animate">
          <DashboardStats />
        </motion.div>

        {/* Quick Actions Card */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <Card className="bg-white p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <Link href="/dashboard/properties">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-white h-10 sm:h-11 text-sm">
                  <Plus className="w-4 h-4 mr-1.5 sm:mr-2" />
                  Add Property
                </Button>
              </Link>
              <Link href="/listings">
                <Button
                  variant="outline"
                  className="w-full h-10 sm:h-11 border-gray-200 hover:bg-gray-50 bg-transparent text-sm"
                >
                  <Eye className="w-4 h-4 mr-1.5 sm:mr-2" />
                  View Listings
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button
                  variant="outline"
                  className="w-full h-10 sm:h-11 border-gray-200 hover:bg-gray-50 bg-transparent text-sm"
                >
                  <Settings className="w-4 h-4 mr-1.5 sm:mr-2" />
                  Contact Support
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* Recent Activity Card */}
        <motion.div variants={fadeInUp} initial="initial" animate="animate">
          <Card className="bg-white p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg">
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Plus className="w-4 h-4 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm">New property added</p>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">Modern Downtown Loft was added</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg">
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm">Property views increased</p>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">Luxury Waterfront Villa reached 500+ views</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg">
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm">New saved property</p>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">You saved Suburban Family Home</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}

