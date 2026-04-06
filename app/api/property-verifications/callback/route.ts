import { NextResponse } from 'next/server'

import { verifyPropertyVerificationPayment } from '@/lib/server/property-verifications/service'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const reference = url.searchParams.get('reference') || url.searchParams.get('trxref')
  const baseUrl = url.origin

  if (!reference) {
    return NextResponse.redirect(new URL('/verify-property/callback?status=error&message=Missing%20payment%20reference.', baseUrl))
  }

  try {
    const verificationRequest = await verifyPropertyVerificationPayment(reference)
    const redirectUrl = new URL('/verify-property/callback', baseUrl)
    redirectUrl.searchParams.set('status', 'success')
    redirectUrl.searchParams.set('reference', reference)
    redirectUrl.searchParams.set('tracking', verificationRequest.trackingCode)
    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to verify payment.'
    const redirectUrl = new URL('/verify-property/callback', baseUrl)
    redirectUrl.searchParams.set('status', 'error')
    redirectUrl.searchParams.set('reference', reference)
    redirectUrl.searchParams.set('message', message)
    return NextResponse.redirect(redirectUrl)
  }
}
