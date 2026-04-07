'use client'

import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Loader2, Search, XCircle } from 'lucide-react'
import { toast } from 'sonner'

import HomeFooter from '@/components/home/home-footer'
import HomeNav from '@/components/home/home-nav'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ApiClientError } from '@/lib/client/api-error'
import { verifyPropertyVerificationPaymentRequest } from '@/lib/client/property-verification-client'

export default function VerifyPropertyCallbackPage() {
  return (
    <Suspense fallback={<VerifyPropertyCallbackFallback />}>
      <VerifyPropertyCallbackContent />
    </Suspense>
  )
}

function VerifyPropertyCallbackContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Verifying your payment...')
  const [trackingCode, setTrackingCode] = useState('')

  useEffect(() => {
    const callbackStatus = searchParams.get('status')
    const callbackTracking = searchParams.get('tracking')
    const callbackMessage = searchParams.get('message')
    const reference = searchParams.get('reference')

    if (callbackStatus === 'success') {
      setTrackingCode(callbackTracking || '')
      setStatus('success')
      setMessage('Payment confirmed. Your verification request is now in review, and your tracking code has been sent by email.')
      return
    }

    if (callbackStatus === 'error') {
      setStatus('error')
      setMessage(callbackMessage || 'Unable to verify your payment right now.')
      return
    }

    if (!reference) {
      setStatus('error')
      setMessage('Missing payment reference.')
      return
    }

    void (async () => {
      try {
        const response = await verifyPropertyVerificationPaymentRequest(reference)
        setTrackingCode(response.request.trackingCode)
        setStatus('success')
        setMessage('Payment confirmed. Your verification request is now in review, and your tracking code has been sent by email.')
      } catch (error) {
        const nextMessage =
          error instanceof ApiClientError ? error.message : 'Unable to verify your payment right now.'
        setStatus('error')
        setMessage(nextMessage)
        toast.error(nextMessage)
      }
    })()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-[#fcfcfb]">
      <HomeNav />
      <main className="px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Card className="rounded-[32px] border border-slate-200 p-10 text-center shadow-sm">
            {status === 'loading' ? <Loader2 className="mx-auto h-12 w-12 animate-spin text-slate-500" /> : null}
            {status === 'success' ? <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" /> : null}
            {status === 'error' ? <XCircle className="mx-auto h-12 w-12 text-red-600" /> : null}

            <h1 className="mt-6 text-4xl font-semibold text-slate-950">Property Verification</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">{message}</p>

            {trackingCode ? (
              <div className="mt-8 rounded-3xl bg-slate-50 px-6 py-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Tracking Code</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{trackingCode}</p>
              </div>
            ) : null}

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-2xl px-8">
                <Link href={trackingCode ? `/verify-property?tracking=${encodeURIComponent(trackingCode)}` : '/verify-property'}>
                  <Search className="h-4 w-4" />
                  Track application
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-2xl px-8">
                <Link href="/listings">Back to listings</Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
      <HomeFooter />
    </div>
  )
}

function VerifyPropertyCallbackFallback() {
  return (
    <div className="min-h-screen bg-[#fcfcfb]">
      <HomeNav />
      <main className="px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Card className="rounded-[32px] border border-slate-200 p-10 text-center shadow-sm">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-slate-500" />
            <h1 className="mt-6 text-4xl font-semibold text-slate-950">Property Verification</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">Preparing payment verification...</p>
          </Card>
        </div>
      </main>
      <HomeFooter />
    </div>
  )
}
