'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { ApiClientError } from '@/lib/client/api-error'
import { listHotelsRequest } from '@/lib/client/hotels-client'
import type { HotelRecord } from '@/lib/hotels/types'

export function usePublicHotels() {
  const [hotels, setHotels] = useState<HotelRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const response = await listHotelsRequest({ scope: 'public' })
        setHotels(response.hotels)
      } catch (error) {
        const message =
          error instanceof ApiClientError ? error.message : 'Unable to load hotels right now.'
        toast.error(message)
      } finally {
        setLoading(false)
      }
    }

    void loadHotels()
  }, [])

  return { hotels, loading }
}
