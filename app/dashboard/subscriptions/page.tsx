'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Check, Copy, CreditCard, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import DashboardLayout from '@/components/dashboard/dashboard-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ApiClientError } from '@/lib/client/api-error'
import {
  getCurrentSubscriptionRequest,
  initializeSubscriptionCheckoutRequest,
  listSubscriptionPlansRequest,
  listSubscriptionsRequest,
} from '@/lib/client/subscriptions-client'
import type { SubscriptionPaymentMethod, SubscriptionPlanRecord, UserSubscriptionRecord } from '@/lib/subscriptions/types'

function formatMoney(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(value?: string | null) {
  if (!value) return 'N/A'
  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
  }).format(new Date(value))
}

function limitLabel(value: number, label: string) {
  if (value < 0) return `Unlimited ${label}`
  return `${value} ${label}${value === 1 ? '' : 's'}`
}

export default function DashboardSubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlanRecord[]>([])
  const [history, setHistory] = useState<UserSubscriptionRecord[]>([])
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlanRecord | null>(null)
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscriptionRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutPlanId, setCheckoutPlanId] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<SubscriptionPaymentMethod>('paystack')
  const [manualPayment, setManualPayment] = useState({
    bankName: 'Access Bank',
    accountName: 'ULO TECHNOLOGIES',
    accountNumber: '0012345678',
  })

  const loadData = async () => {
    setLoading(true)
    try {
      const [plansResponse, currentResponse, historyResponse] = await Promise.all([
        listSubscriptionPlansRequest(),
        getCurrentSubscriptionRequest(),
        listSubscriptionsRequest(),
      ])
      setPlans(plansResponse.plans)
      setCurrentPlan(currentResponse.plan)
      setCurrentSubscription(currentResponse.subscription)
      setHistory(historyResponse.subscriptions)
      setPaymentMethod(currentResponse.paymentMethod)
      if ('manualPayment' in currentResponse && currentResponse.manualPayment) {
        setManualPayment(currentResponse.manualPayment)
      }
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : 'Unable to load subscriptions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  const currentPlanFeatures = useMemo(() => {
    if (!currentPlan) return []
    return [
      ...currentPlan.features,
      limitLabel(currentPlan.propertyLimit, 'property listing'),
      limitLabel(currentPlan.hotelLimit, 'hotel listing'),
    ]
  }, [currentPlan])

  const startCheckout = async (plan: SubscriptionPlanRecord) => {
    if (plan.isFree) {
      toast.message('You are already covered by the free plan.')
      return
    }

    setCheckoutPlanId(plan.id)
    try {
      const response = await initializeSubscriptionCheckoutRequest(plan.id)
      if (response.paymentProvider === 'manual' && response.whatsappUrl) {
        toast.success('Pending subscription created. Send your receipt on WhatsApp for admin approval.')
        window.location.href = response.whatsappUrl
        return
      }

      if (response.authorizationUrl) {
        window.location.href = response.authorizationUrl
        return
      }

      toast.error('Unable to continue with subscription payment.')
    } catch (error) {
      toast.error(
        error instanceof ApiClientError
          ? error.message
          : paymentMethod === 'account'
            ? 'Unable to create pending manual subscription.'
            : 'Unable to start Paystack checkout.'
      )
      setCheckoutPlanId(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">Subscription Plans</h1>
          <p className="mt-1 text-slate-600">
            Your plan controls how many properties and hotels you can publish.
          </p>
        </div>

        {loading ? (
          <Card className="p-12 text-center text-slate-500">
            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          </Card>
        ) : (
          <>
            {currentPlan ? (
              <Card className="p-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold text-slate-900">{currentPlan.name}</h2>
                      <Badge className="bg-emerald-100 text-emerald-700">
                        {currentSubscription ? currentSubscription.status : 'active'}
                      </Badge>
                      {currentPlan.isFree ? <Badge variant="outline">Free</Badge> : null}
                    </div>
                    <p className="text-sm text-slate-600">{currentPlan.description}</p>
                    <p className="text-sm text-slate-500">
                      {currentPlan.isFree
                        ? 'Fallback plan'
                        : `${formatMoney(currentPlan.priceAmount)} / ${currentPlan.billingInterval}`}
                      {currentSubscription?.endsAt ? ` • Renews until ${formatDate(currentSubscription.endsAt)}` : ''}
                    </p>
                  </div>
                  <div className="rounded-xl border bg-slate-50 p-4 text-sm text-slate-600 lg:min-w-80">
                    <p className="font-medium text-slate-900">Your current access</p>
                    <ul className="mt-3 space-y-2">
                      {currentPlanFeatures.map((feature, index) => (
                        <li key={`${currentPlan?.id ?? 'plan'}-${index}`} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-3">
              {plans.map((plan) => {
                const isCurrent = currentPlan?.id === plan.id
                const isBusy = checkoutPlanId === plan.id
                return (
                  <Card key={plan.id} className="flex h-full flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
                        <p className="mt-1 text-sm text-slate-600">{plan.description}</p>
                      </div>
                      {plan.isFree ? <Badge variant="outline">Free</Badge> : null}
                    </div>

                    <div className="mt-5">
                      <p className="text-3xl font-bold text-slate-900">
                        {plan.isFree ? 'Free' : formatMoney(plan.priceAmount)}
                      </p>
                      {!plan.isFree ? (
                        <p className="text-sm text-slate-500">per {plan.billingInterval}</p>
                      ) : null}
                    </div>

                    <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                      <p>{limitLabel(plan.propertyLimit, 'property listing')}</p>
                      <p>{limitLabel(plan.hotelLimit, 'hotel listing')}</p>
                    </div>

                    <ul className="mt-5 flex-1 space-y-3 text-sm text-slate-600">
                      {plan.features.map((feature, index) => (
                        <li key={`${plan.id}-${index}`} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="mt-6"
                      disabled={isCurrent || isBusy}
                      onClick={() => void startCheckout(plan)}
                    >
                      {isBusy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
                      {isCurrent ? 'Current Plan' : plan.isFree ? 'Included' : paymentMethod === 'paystack' ? 'Subscribe with Paystack' : 'Pay with Account Number'}
                    </Button>
                  </Card>
                )
              })}
            </div>

            <Card className="p-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Payment Method</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Admin has enabled {paymentMethod === 'paystack' ? 'Paystack checkout' : 'account transfer'} for subscriptions.
                </p>
              </div>

              {paymentMethod === 'account' ? (
                <div className="mt-5 rounded-2xl border bg-slate-50 p-5">
                  <p className="text-sm text-slate-600">Transfer the subscription amount to the account below, then notify the admin for activation.</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-xl border bg-white p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500">Bank</p>
                      <p className="mt-2 font-semibold text-slate-900">{manualPayment.bankName}</p>
                    </div>
                    <div className="rounded-xl border bg-white p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500">Account Name</p>
                      <p className="mt-2 font-semibold text-slate-900">{manualPayment.accountName}</p>
                    </div>
                    <div className="rounded-xl border bg-white p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500">Account Number</p>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <p className="font-semibold text-slate-900">{manualPayment.accountNumber}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            await navigator.clipboard.writeText(manualPayment.accountNumber)
                            toast.success('Account number copied.')
                          }}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl border border-dashed bg-white p-4 text-sm text-slate-600">
                    After payment, click your plan button. A pending subscription will be created and WhatsApp will open so you can send your receipt to admin.
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border bg-slate-50 p-5 text-sm text-slate-600">
                  Complete your subscription directly with Paystack when you select a paid plan.
                </div>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Billing History</h2>
                  <p className="mt-1 text-sm text-slate-600">Track your current and previous subscription payments.</p>
                </div>
                <Link className="text-sm font-medium text-slate-700 underline-offset-4 hover:underline" href="/dashboard/properties">
                  Manage listings
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {history.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-6 text-sm text-slate-500">
                    No subscription transactions yet.
                  </div>
                ) : (
                  history.map((item) => (
                    <div key={item.id} className="flex flex-col gap-3 rounded-xl border p-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{item.planName}</p>
                        <p className="text-sm text-slate-500">
                          {formatMoney(item.amount)} • {item.paymentProvider} • {item.billingInterval}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        <Badge variant="outline">{item.status}</Badge>
                        <span>Started {formatDate(item.startsAt || item.createdAt)}</span>
                        <span>Ends {formatDate(item.endsAt)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="border-dashed p-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Listing access follows your plan</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    If you hit your property or hotel limit, upgrade here before creating another listing.
                  </p>
                </div>
                <Button asChild variant="outline">
                  <Link href="/dashboard/hotels">
                    Continue to dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
