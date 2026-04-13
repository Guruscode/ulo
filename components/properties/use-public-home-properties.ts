'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import type { Property } from '@/components/home/types'
import { ApiClientError } from '@/lib/client/api-error'
import { listPropertiesRequest } from '@/lib/client/properties-client'
import { toHomeProperty } from '@/lib/properties/presentation'

export function usePublicHomeProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const response = await listPropertiesRequest({ scope: 'public' })
        setProperties(response.properties.map(toHomeProperty))
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unable to load properties right now.'
        toast.error(message)
      } finally {
        setLoading(false)
      }
    }

    void loadProperties()
  }, [])

  return { properties, loading }
}
