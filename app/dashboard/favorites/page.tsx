'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'

import DashboardLayout from '@/components/dashboard/dashboard-layout'
import PropertyCard from '@/components/home/property-card'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PropertyGridSkeleton } from '@/components/ui/page-skeletons'
import { ApiClientError } from '@/lib/client/api-error'
import { listSavedPropertiesRequest } from '@/lib/client/properties-client'
import { toHomeProperty } from '@/lib/properties/presentation'
import type { Property } from '@/components/home/types'

export default function DashboardFavoritesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadSaved = async () => {
      try {
        const response = await listSavedPropertiesRequest()
        setProperties(response.properties.map(toHomeProperty))
      } catch (error) {
        setError(error instanceof ApiClientError ? error.message : 'Unable to load saved properties.')
      } finally {
        setLoading(false)
      }
    }

    void loadSaved()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Saved Properties</h2>
          <p className="text-gray-600 text-sm mt-1">View and manage your saved properties</p>
        </div>

        {loading ? (
          <PropertyGridSkeleton count={6} />
        ) : error ? (
          <Card className="bg-white p-12 text-center text-red-600">{error}</Card>
        ) : properties.length === 0 ? (
          <Card className="bg-white p-12 text-center">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No saved properties yet</p>
            <p className="text-gray-500 text-sm mb-6">Properties you save will remain here until you remove them.</p>
            <Link href="/listings">
              <Button className="bg-secondary hover:bg-secondary/90 text-white">Browse Properties</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
