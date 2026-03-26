'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

const COOKIE_CONSENT_KEY = 'ulo-cookie-consent'

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = window.localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      setIsVisible(true)
    }

    const handleOpen = () => {
      setIsVisible(true)
    }

    window.addEventListener('open-cookie-banner', handleOpen)
    return () => window.removeEventListener('open-cookie-banner', handleOpen)
  }, [])

  const handleConsent = (value: 'accepted' | 'declined') => {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, value)
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-3xl space-y-1">
          <p className="text-sm font-semibold text-slate-900">We use cookies</p>
          <p className="text-sm text-slate-600">
            We use cookies to keep you signed in, improve performance, and understand how people use ULO.
            Read our{' '}
            <Link href="/privacy" className="font-medium text-secondary hover:text-secondary/80">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link href="/terms" className="font-medium text-secondary hover:text-secondary/80">
              Terms
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="border-slate-300" onClick={() => handleConsent('declined')}>
            Decline
          </Button>
          <Button className="bg-secondary text-white hover:bg-secondary/90" onClick={() => handleConsent('accepted')}>
            Accept Cookies
          </Button>
        </div>
      </div>
    </div>
  )
}
