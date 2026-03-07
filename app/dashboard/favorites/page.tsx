'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Heart } from 'lucide-react'
import DashboardLayout from '@/components/dashboard/dashboard-layout'

export default function DashboardFavoritesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Saved Properties</h2>
          <p className="text-gray-600 text-sm mt-1">
            View and manage your saved properties
          </p>
        </div>

        {/* Empty State */}
        <Card className="bg-white p-12 text-center">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No saved properties yet</p>
          <p className="text-gray-500 text-sm mb-6">
            Properties you save will appear here for easy access
          </p>
          <Link href="/listings">
            <Button className="bg-secondary hover:bg-secondary/90 text-white">
              Browse Properties
            </Button>
          </Link>
        </Card>
      </div>
    </DashboardLayout>
  )
}

