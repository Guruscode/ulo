'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, Copy, CreditCard, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ApiClientError } from '@/lib/client/api-error'
import {
  getCurrentSubscriptionRequest,
  initializeSubscriptionCheckoutRequest,
  listSubscriptionPlansRequest,
} from '@/lib/client/subscriptions-client'
import type { SubscriptionPaymentMethod, SubscriptionPlanRecord, UserSubscriptionRecord } from '@/lib/subscriptions/types'

function formatMoney(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)
}

function limitLabel(value: number, label: string) {
  if (value < 0) return `Unlimited ${label}`
  return `${value} ${label}${value === 1 ? '' : 's'}`
}

export function SubscriptionPaymentModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [loading, setLoading] = useState(false)
  const [plans, setPlans] = useState<SubscriptionPlanRecord[]>([])
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlanRecord | null>(null)
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscriptionRecord | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<SubscriptionPaymentMethod>('paystack')
  const [manualPayment, setManualPayment] = useState({
    bankName: 'Access Bank',
    accountName: 'ULO TECHNOLOGIES',
    accountNumber: '0012345678',
  })
  const [checkoutPlanId, setCheckoutPlanId] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return

    const loadData = async () => {
      setLoading(true)
      try {
        const [plansResponse, currentResponse] = await Promise.all([
          listSubscriptionPlansRequest(),
          getCurrentSubscriptionRequest(),
        ])
        setPlans(plansResponse.plans)
        setCurrentPlan(currentResponse.plan)
        setCurrentSubscription(currentResponse.subscription)
        setPaymentMethod(currentResponse.paymentMethod)
        if (currentResponse.manualPayment) {
          setManualPayment(currentResponse.manualPayment)
        }
      } catch (error) {
        toast.error(error instanceof ApiClientError ? error.message : 'Unable to load subscription plans.')
      } finally {
        setLoading(false)
      }
    }

    void loadData()
  }, [open])

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
        toast.success('Pending subscription created. WhatsApp will open so you can send proof of payment.')
        window.location.href = response.whatsappUrl
        return
      }

      if (response.authorizationUrl) {
        window.location.href = response.authorizationUrl
        return
      }

      toast.error('Unable to continue with subscription payment.')
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : 'Unable to start subscription payment.')
    } finally {
      setCheckoutPlanId(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Subscription Plans</DialogTitle>
          <DialogDescription>
            Complete subscription payment here without leaving your current page.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <Card className="p-10 text-center text-slate-500">
            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          </Card>
        ) : (
          <div className="space-y-6">
            {currentPlan ? (
              <Card className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-slate-900">{currentPlan.name}</h3>
                      <Badge className="bg-emerald-100 text-emerald-700">
                        {currentSubscription ? currentSubscription.status : 'active'}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{currentPlan.description}</p>
                  </div>
                  <div className="rounded-xl border bg-slate-50 p-4 text-sm text-slate-600 lg:min-w-80">
                    <p className="font-medium text-slate-900">Current access</p>
                    <ul className="mt-3 space-y-2">
                      {currentPlanFeatures.map((feature, index) => (
                        <li key={`${currentPlan.id}-${index}`} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ) : null}

            <Card className="p-5">
              <h3 className="text-lg font-semibold text-slate-900">Payment Method</h3>
              <p className="mt-1 text-sm text-slate-600">
                Admin has enabled {paymentMethod === 'paystack' ? 'Paystack checkout' : 'account transfer'}.
              </p>
              {paymentMethod === 'account' ? (
                <div className="mt-4 rounded-2xl border bg-slate-50 p-5">
                  <div className="grid gap-3 md:grid-cols-3">
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
                </div>
              ) : null}
            </Card>

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
                      {!plan.isFree ? <p className="text-sm text-slate-500">per {plan.billingInterval}</p> : null}
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

                    <Button className="mt-6" disabled={isCurrent || isBusy} onClick={() => void startCheckout(plan)}>
                      {isBusy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
                      {isCurrent ? 'Current Plan' : plan.isFree ? 'Included' : paymentMethod === 'paystack' ? 'Pay Now' : 'Pay And Send Proof'}
                    </Button>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
