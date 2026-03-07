'use client';

import { Card } from '@/components/ui/card'
import { Building2, Eye, MessageSquare, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

const stats = [
  {
    label: 'Total Properties',
    value: '24',
    change: '+3 this month',
    icon: Building2,
    color: 'from-blue-500 to-blue-600',
  },
  {
    label: 'Total Views',
    value: '2,547',
    change: '+240 this week',
    icon: Eye,
    color: 'from-purple-500 to-purple-600',
  },
  {
    label: 'Inquiries',
    value: '68',
    change: '+12 pending',
    icon: MessageSquare,
    color: 'from-orange-500 to-orange-600',
  },
  {
    label: 'Growth',
    value: '24.5%',
    change: '+4.2% vs last month',
    icon: TrendingUp,
    color: 'from-green-500 to-green-600',
  },
]

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-green-600 text-xs font-medium mt-2">{stat.change}</p>
                </div>
                <div
                  className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg text-white`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
