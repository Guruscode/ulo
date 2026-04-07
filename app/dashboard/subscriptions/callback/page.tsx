'use client'

import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { toast } from 'sonner'

import DashboardLayout from '@/components/dashboard/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ApiClientError } from '@/lib/client/api-error'
import { verifySubscriptionRequest } from '@/lib/client/subscriptions-client'

export default function SubscriptionCallbackPage() {
  return (
    <Suspense fallback={<SubscriptionCallbackFallback />}>
      <SubscriptionCallbackContent />
    </Suspense>
  )
}

function SubscriptionCallbackContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Verifying your Paystack payment...')

  useEffect(() => {
    const reference = searchParams.get('reference')

    if (!reference) {
      setStatus('error')
      setMessage('Missing transaction reference.')
      return
    }

    void (async () => {
      try {
        await verifySubscriptionRequest(reference)
        setStatus('success')
        setMessage('Your subscription has been activated successfully.')
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
    <DashboardLayout>
      <div className="mx-auto max-w-2xl py-8">
        <Card className="p-8 text-center">
          {status === 'loading' ? <Loader2 className="mx-auto h-10 w-10 animate-spin text-slate-500" /> : null}
          {status === 'success' ? <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" /> : null}
          {status === 'error' ? <XCircle className="mx-auto h-10 w-10 text-red-600" /> : null}

          <h1 className="mt-4 text-2xl font-semibold text-slate-900">Subscription Verification</h1>
          <p className="mt-2 text-slate-600">{message}</p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/dashboard/subscriptions">Back to subscriptions</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/properties">Go to properties</Link>
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}

function SubscriptionCallbackFallback() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl py-8">
        <Card className="p-8 text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-slate-500" />
          <h1 className="mt-4 text-2xl font-semibold text-slate-900">Subscription Verification</h1>
          <p className="mt-2 text-slate-600">Preparing payment verification...</p>
        </Card>
      </div>
    </DashboardLayout>
  )
}
