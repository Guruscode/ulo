'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Users, 
  Home, 
  Building2, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Heart,
  MessageSquare,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import AdminLayout from '@/components/admin/admin-layout'

// Mock data for statistics
const stats = [
  {
    title: 'Total Users',
    value: '12,345',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'blue',
  },
  {
    title: 'Properties',
    value: '3,456',
    change: '+8.2%',
    trend: 'up',
    icon: Home,
    color: 'green',
  },
  {
    title: 'Hotels',
    value: '892',
    change: '+5.3%',
    trend: 'up',
    icon: Building2,
    color: 'purple',
  },
  {
    title: 'Blog Posts',
    value: '245',
    change: '-2.1%',
    trend: 'down',
    icon: FileText,
    color: 'orange',
  },
]

const recentActivities = [
  {
    id: 1,
    type: 'user',
    title: 'New user registered',
    description: 'John Doe signed up as a new agent',
    time: '2 minutes ago',
    icon: Users,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 2,
    type: 'property',
    title: 'Property added',
    description: 'Modern Downtown Loft was added to listings',
    time: '15 minutes ago',
    icon: Home,
    color: 'bg-green-100 text-green-600',
  },
  {
    id: 3,
    type: 'hotel',
    title: 'Hotel updated',
    description: 'Grand Hotel Lagos updated their rates',
    time: '1 hour ago',
    icon: Building2,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    id: 4,
    type: 'inquiry',
    title: 'New inquiry',
    description: 'New inquiry for Luxury Waterfront Villa',
    time: '2 hours ago',
    icon: MessageSquare,
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    id: 5,
    type: 'property',
    title: 'Property sold',
    description: 'Suburban Family Home was marked as sold',
    time: '3 hours ago',
    icon: DollarSign,
    color: 'bg-green-100 text-green-600',
  },
]

const quickLinks = [
  { label: 'Add User', href: '/admin/users', icon: Users },
  { label: 'Add Property', href: '/admin/properties', icon: Home },
  { label: 'Add Hotel', href: '/admin/hotels', icon: Building2 },
  { label: 'Add Blog Post', href: '/admin/blog', icon: FileText },
]

const colorMap: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
}

export default function AdminDashboardPage() {
  const [adminData] = useState({
    name: 'Admin User',
    email: 'admin@ulo.com',
    role: 'Super Admin',
  })

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  return (
    <AdminLayout>
      <TooltipProvider delayDuration={0}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 sm:space-y-6"
        >
          {/* Welcome Section */}
          <div className="mb-4 sm:mb-8">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
              Welcome back, {adminData.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">
              Here&apos;s what&apos;s happening with your platform today.
            </p>
          </div>

          {/* Statistics Grid */}
          <motion.div variants={fadeInUp} initial="initial" animate="animate">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.title}
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: index * 0.1 }}
                  >
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Card className="bg-white p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="flex items-start justify-between">
                              <div className={`p-2 sm:p-3 rounded-xl ${colorMap[stat.color]}`}>
                                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                              </div>
                              <div className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${
                                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {stat.trend === 'up' ? (
                                  <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                ) : (
                                  <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                )}
                                {stat.change}
                              </div>
                            </div>
                            <div className="mt-3 sm:mt-4">
                              <p className="text-2xl sm:text-3xl font-bold text-slate-900">{stat.value}</p>
                              <p className="text-xs sm:text-sm text-slate-500 mt-1">{stat.title}</p>
                            </div>
                          </Card>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View {stat.title} details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={fadeInUp} initial="initial" animate="animate">
            <Card className="bg-white p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {quickLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <TooltipProvider key={link.label} delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={link.href}>
                            <Button
                              variant="outline"
                              className="w-full h-10 sm:h-12 border-slate-200 hover:bg-slate-50 hover:border-blue-300 bg-transparent text-xs sm:text-sm"
                            >
                              <Icon className="w-4 h-4 mr-1.5 sm:mr-2" />
                              {link.label}
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Navigate to {link.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
                })}
              </div>
            </Card>
          </motion.div>

          {/* Recent Activity and Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Recent Activity */}
            <motion.div variants={fadeInUp} initial="initial" animate="animate">
              <Card className="bg-white p-4 sm:p-6 h-full">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4">
                  Recent Activity
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {recentActivities.map((activity) => {
                    const Icon = activity.icon
                    return (
                      <TooltipProvider key={activity.id} delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-start gap-3 p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                              <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-slate-900 text-sm">{activity.title}</p>
                                <p className="text-xs sm:text-sm text-slate-500 truncate">{activity.description}</p>
                              </div>
                              <span className="text-xs text-slate-400 flex-shrink-0">{activity.time}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Activity occurred {activity.time}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  })}
                </div>
              </Card>
            </motion.div>

            {/* Platform Overview */}
            <motion.div variants={fadeInUp} initial="initial" animate="animate">
              <Card className="bg-white p-4 sm:p-6 h-full">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4">
                  Platform Overview
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-slate-500" />
                      <span className="text-sm text-slate-700">Total Views</span>
                    </div>
                    <span className="font-bold text-slate-900">156,789</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-slate-500" />
                      <span className="text-sm text-slate-700">Saved Properties</span>
                    </div>
                    <span className="font-bold text-slate-900">8,234</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-slate-500" />
                      <span className="text-sm text-slate-700">Inquiries</span>
                    </div>
                    <span className="font-bold text-slate-900">1,245</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-slate-500" />
                      <span className="text-sm text-slate-700">Conversion Rate</span>
                    </div>
                    <span className="font-bold text-green-600">4.8%</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </TooltipProvider>
    </AdminLayout>
  )
}

