'use client'

import { useEffect, useMemo, useState } from 'react'
import { CreditCard, Landmark, Loader2, Pencil, Plus } from 'lucide-react'
import { toast } from 'sonner'

import AdminLayout from '@/components/admin/admin-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ApiClientError } from '@/lib/client/api-error'
import {
  createSubscriptionPlanRequest,
  deleteAdminSubscriptionRequest,
  deleteSubscriptionPlanRequest,
  getAdminSubscriptionSettingsRequest,
  listSubscriptionPlansRequest,
  listSubscriptionsRequest,
  updateAdminSubscriptionRequest,
  updateAdminSubscriptionSettingsRequest,
  updateSubscriptionPlanRequest,
} from '@/lib/client/subscriptions-client'
import type { SubscriptionPaymentMethod, SubscriptionPlanRecord, UserSubscriptionRecord } from '@/lib/subscriptions/types'

type PlanForm = {
  name: string
  slug: string
  description: string
  priceAmount: string
  billingInterval: 'month' | 'year'
  propertyLimit: string
  hotelLimit: string
  features: string
  isFree: boolean
  isActive: boolean
  paystackPlanCode: string
}

const EMPTY_FORM: PlanForm = {
  name: '',
  slug: '',
  description: '',
  priceAmount: '0',
  billingInterval: 'month',
  propertyLimit: '1',
  hotelLimit: '0',
  features: '',
  isFree: false,
  isActive: true,
  paystackPlanCode: '',
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(value?: string | null) {
  if (!value) return 'N/A'
  return new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium' }).format(new Date(value))
}

function toFormState(plan: SubscriptionPlanRecord): PlanForm {
  return {
    name: plan.name,
    slug: plan.slug,
    description: plan.description,
    priceAmount: String(plan.priceAmount),
    billingInterval: plan.billingInterval,
    propertyLimit: String(plan.propertyLimit),
    hotelLimit: String(plan.hotelLimit),
    features: plan.features.join(', '),
    isFree: plan.isFree,
    isActive: plan.isActive,
    paystackPlanCode: plan.paystackPlanCode || '',
  }
}

function toPayload(form: PlanForm) {
  return {
    name: form.name.trim(),
    slug: form.slug.trim(),
    description: form.description.trim(),
    priceAmount: Number(form.priceAmount),
    billingInterval: form.billingInterval,
    propertyLimit: Number(form.propertyLimit),
    hotelLimit: Number(form.hotelLimit),
    features: form.features.split(',').map((item) => item.trim()).filter(Boolean),
    isFree: form.isFree,
    isActive: form.isActive,
    paystackPlanCode: form.paystackPlanCode.trim() || null,
  }
}

function statusClass(status: UserSubscriptionRecord['status']) {
  switch (status) {
    case 'active':
      return 'bg-emerald-100 text-emerald-700'
    case 'pending':
      return 'bg-amber-100 text-amber-700'
    case 'cancelled':
      return 'bg-slate-100 text-slate-700'
    default:
      return 'bg-red-100 text-red-700'
  }
}

export default function AdminSubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlanRecord[]>([])
  const [subscriptions, setSubscriptions] = useState<UserSubscriptionRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [savingPlan, setSavingPlan] = useState(false)
  const [planDialogOpen, setPlanDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlanRecord | null>(null)
  const [form, setForm] = useState<PlanForm>(EMPTY_FORM)
  const [actingSubscriptionId, setActingSubscriptionId] = useState<string | null>(null)
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null)
  const [deletingSubscriptionId, setDeletingSubscriptionId] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<SubscriptionPaymentMethod>('paystack')
  const [paymentDetails, setPaymentDetails] = useState({
    bankName: 'Access Bank',
    accountName: 'ULO TECHNOLOGIES',
    accountNumber: '0012345678',
  })
  const [savingPaymentMethod, setSavingPaymentMethod] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const [plansResponse, subscriptionsResponse, settingsResponse] = await Promise.all([
        listSubscriptionPlansRequest(),
        listSubscriptionsRequest(),
        getAdminSubscriptionSettingsRequest(),
      ])
      setPlans(plansResponse.plans)
      setSubscriptions(subscriptionsResponse.subscriptions)
      setPaymentMethod(settingsResponse.method)
      setPaymentDetails({
        bankName: settingsResponse.bankName,
        accountName: settingsResponse.accountName,
        accountNumber: settingsResponse.accountNumber,
      })
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : 'Unable to load subscription data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  const metrics = useMemo(() => ({
    totalPlans: plans.length,
    activePlans: plans.filter((plan) => plan.isActive).length,
    activeSubscriptions: subscriptions.filter((item) => item.status === 'active').length,
    monthlyValue: subscriptions
      .filter((item) => item.status === 'active')
      .reduce((total, item) => total + item.amount, 0),
  }), [plans, subscriptions])

  const openCreatePlan = () => {
    setEditingPlan(null)
    setForm(EMPTY_FORM)
    setPlanDialogOpen(true)
  }

  const openEditPlan = (plan: SubscriptionPlanRecord) => {
    setEditingPlan(plan)
    setForm(toFormState(plan))
    setPlanDialogOpen(true)
  }

  const savePlan = async () => {
    setSavingPlan(true)
    try {
      if (editingPlan) {
        await updateSubscriptionPlanRequest(editingPlan.id, toPayload(form))
        toast.success('Subscription plan updated.')
      } else {
        await createSubscriptionPlanRequest(toPayload(form))
        toast.success('Subscription plan created.')
      }
      setPlanDialogOpen(false)
      setEditingPlan(null)
      setForm(EMPTY_FORM)
      await loadData()
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : 'Unable to save subscription plan.')
    } finally {
      setSavingPlan(false)
    }
  }

  const deletePlan = async (planId: string) => {
    const plan = plans.find((item) => item.id === planId)
    if (!plan) return

    const confirmed = window.confirm(
      `Delete the "${plan.name}" plan? This cannot be undone.`
    )
    if (!confirmed) return

    setDeletingPlanId(planId)
    try {
      await deleteSubscriptionPlanRequest(planId)
      toast.success('Subscription plan deleted.')
      await loadData()
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : 'Unable to delete subscription plan.')
    } finally {
      setDeletingPlanId(null)
    }
  }

  const deleteSubscription = async (subscriptionId: string) => {
    const subscription = subscriptions.find((item) => item.id === subscriptionId)
    if (!subscription) return

    const confirmed = window.confirm(
      `Delete subscription for ${subscription.userName || subscription.userEmail || 'this user'}? This cannot be undone.`
    )
    if (!confirmed) return

    setDeletingSubscriptionId(subscriptionId)
    try {
      await deleteAdminSubscriptionRequest(subscriptionId)
      toast.success('Subscription deleted.')
      await loadData()
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : 'Unable to delete subscription.')
    } finally {
      setDeletingSubscriptionId(null)
    }
  }

  const updateStatus = async (
    subscriptionId: string,
    status: 'active' | 'expired' | 'cancelled'
  ) => {
    setActingSubscriptionId(subscriptionId)
    try {
      await updateAdminSubscriptionRequest(subscriptionId, status)
      toast.success('Subscription status updated.')
      await loadData()
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : 'Unable to update subscription status.')
    } finally {
      setActingSubscriptionId(null)
    }
  }

  const updatePaymentMethod = async (method: SubscriptionPaymentMethod) => {
    setSavingPaymentMethod(true)
    try {
      const response = await updateAdminSubscriptionSettingsRequest({
        method,
        ...paymentDetails,
      })
      setPaymentMethod(response.method)
      setPaymentDetails({
        bankName: response.bankName,
        accountName: response.accountName,
        accountNumber: response.accountNumber,
      })
      toast.success('Subscription payment method updated.')
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : 'Unable to update payment method.')
    } finally {
      setSavingPaymentMethod(false)
    }
  }

  const savePaymentDetails = async () => {
    setSavingPaymentMethod(true)
    try {
      const response = await updateAdminSubscriptionSettingsRequest({
        method: paymentMethod,
        ...paymentDetails,
      })
      setPaymentMethod(response.method)
      setPaymentDetails({
        bankName: response.bankName,
        accountName: response.accountName,
        accountNumber: response.accountNumber,
      })
      toast.success('Account payment details saved.')
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : 'Unable to save account payment details.')
    } finally {
      setSavingPaymentMethod(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">Subscription Management</h1>
            <p className="mt-1 text-slate-600">
              Define subscription plans, review paid users, and manage active access.
            </p>
          </div>
          <Button onClick={openCreatePlan}>
            <Plus className="mr-2 h-4 w-4" />
            Add plan
          </Button>
        </div>

        {loading ? (
          <Card className="p-12 text-center text-slate-500">
            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          </Card>
        ) : (
          <>
            <Card className="p-6">
              <div className="flex flex-col gap-5">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Subscription Payment Method</h2>
                  <p className="mt-1 text-sm text-slate-600">This controls what users see on the subscription page. Only one method is active at a time.</p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <Button
                    type="button"
                    variant={paymentMethod === 'paystack' ? 'default' : 'outline'}
                    disabled={savingPaymentMethod}
                    onClick={() => void updatePaymentMethod('paystack')}
                    className="justify-start"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Use Paystack
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === 'account' ? 'default' : 'outline'}
                    disabled={savingPaymentMethod}
                    onClick={() => void updatePaymentMethod('account')}
                    className="justify-start"
                  >
                    <Landmark className="mr-2 h-4 w-4" />
                    Use Account Number
                  </Button>
                </div>

                <div className="rounded-xl border bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="font-medium text-slate-900">
                    Current method: {paymentMethod === 'paystack' ? 'Paystack' : 'Account Number'}
                  </p>
                  <p className="mt-1">
                    {paymentMethod === 'paystack'
                      ? 'Users will be redirected to Paystack when subscribing to a paid plan.'
                      : 'Users will see the account details to transfer subscription payment manually.'}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Bank Name</Label>
                    <Input
                      value={paymentDetails.bankName}
                      onChange={(event) => setPaymentDetails({ ...paymentDetails, bankName: event.target.value })}
                      placeholder="e.g. Access Bank"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Name</Label>
                    <Input
                      value={paymentDetails.accountName}
                      onChange={(event) => setPaymentDetails({ ...paymentDetails, accountName: event.target.value })}
                      placeholder="Business account name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Number</Label>
                    <Input
                      value={paymentDetails.accountNumber}
                      onChange={(event) => setPaymentDetails({ ...paymentDetails, accountNumber: event.target.value })}
                      placeholder="Bank account number"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={() => void savePaymentDetails()} disabled={savingPaymentMethod}>
                    Save Account Details
                  </Button>
                </div>
              </div>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Card className="p-5"><p className="text-sm text-slate-500">Total plans</p><p className="mt-2 text-3xl font-bold text-slate-900">{metrics.totalPlans}</p></Card>
              <Card className="p-5"><p className="text-sm text-slate-500">Active plans</p><p className="mt-2 text-3xl font-bold text-slate-900">{metrics.activePlans}</p></Card>
              <Card className="p-5"><p className="text-sm text-slate-500">Active subscriptions</p><p className="mt-2 text-3xl font-bold text-slate-900">{metrics.activeSubscriptions}</p></Card>
              <Card className="p-5"><p className="text-sm text-slate-500">Active value</p><p className="mt-2 text-3xl font-bold text-slate-900">{formatMoney(metrics.monthlyValue)}</p></Card>
            </div>

            <Card className="p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Plans</h2>
                  <p className="mt-1 text-sm text-slate-600">These limits are enforced before users create properties or hotels.</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                {plans.map((plan) => (
                  <Card key={plan.id} className="border bg-slate-50 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                          {plan.isFree ? <Badge variant="outline">Free</Badge> : null}
                          <Badge className={plan.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}>
                            {plan.isActive ? 'Active' : 'Hidden'}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{plan.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditPlan(plan)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={plan.isFree || deletingPlanId === plan.id}
                          onClick={() => void deletePlan(plan.id)}
                        >
                          {deletingPlanId === plan.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Delete
                        </Button>
                      </div>
                    </div>

                    <p className="mt-4 text-2xl font-bold text-slate-900">
                      {plan.isFree ? 'Free' : formatMoney(plan.priceAmount)}
                    </p>
                    <p className="text-sm text-slate-500">{plan.billingInterval} billing</p>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg border bg-white p-3">
                        <p className="text-slate-500">Properties</p>
                        <p className="font-semibold text-slate-900">{plan.propertyLimit < 0 ? 'Unlimited' : plan.propertyLimit}</p>
                      </div>
                      <div className="rounded-lg border bg-white p-3">
                        <p className="text-slate-500">Hotels</p>
                        <p className="font-semibold text-slate-900">{plan.hotelLimit < 0 ? 'Unlimited' : plan.hotelLimit}</p>
                      </div>
                    </div>

                    <ul className="mt-4 space-y-2 text-sm text-slate-600">
                      {plan.features.map((feature) => (
                        <li key={feature}>• {feature}</li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Current User Subscriptions</h2>
                <p className="mt-1 text-sm text-slate-600">Review pending payments and control user access.</p>
              </div>

              <div className="mt-5 space-y-4">
                {subscriptions.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-6 text-sm text-slate-500">
                    No subscription records yet.
                  </div>
                ) : (
                  subscriptions.map((subscription) => {
                    const busy = actingSubscriptionId === subscription.id
                    return (
                      <div key={subscription.id} className="flex flex-col gap-4 rounded-xl border p-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-slate-900">{subscription.userName || 'Unknown user'}</p>
                            <Badge className={statusClass(subscription.status)}>{subscription.status}</Badge>
                            <Badge variant="outline">{subscription.planName}</Badge>
                          </div>
                          <p className="text-sm text-slate-600">{subscription.userEmail || 'No email'}</p>
                          <p className="text-sm text-slate-500">
                            {formatMoney(subscription.amount)} • {subscription.paymentProvider} • Ref: {subscription.paymentReference || 'N/A'}
                          </p>
                          <p className="text-sm text-slate-500">
                            Start: {formatDate(subscription.startsAt || subscription.createdAt)} • End: {formatDate(subscription.endsAt)}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <Select
                            disabled={busy}
                            value={subscription.status === 'pending' ? 'pending' : subscription.status}
                            onValueChange={(value) => {
                              if (value === 'pending') return
                              void updateStatus(subscription.id, value as 'active' | 'expired' | 'cancelled')
                            }}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="active">Activate</SelectItem>
                              <SelectItem value="expired">Expire</SelectItem>
                              <SelectItem value="cancelled">Cancel</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={deletingSubscriptionId === subscription.id}
                            onClick={() => void deleteSubscription(subscription.id)}
                          >
                            {deletingSubscriptionId === subscription.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Delete
                          </Button>
                          {busy ? <Loader2 className="h-4 w-4 animate-spin text-slate-500" /> : null}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </Card>
          </>
        )}

        <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPlan ? 'Edit Subscription Plan' : 'Create Subscription Plan'}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value.toLowerCase().replace(/\s+/g, '-') })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Price Amount (NGN)</Label>
                <Input type="number" min="0" value={form.priceAmount} onChange={(event) => setForm({ ...form, priceAmount: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Billing Interval</Label>
                <Select value={form.billingInterval} onValueChange={(value) => setForm({ ...form, billingInterval: value as 'month' | 'year' })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Monthly</SelectItem>
                    <SelectItem value="year">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Property Limit</Label>
                <Input type="number" value={form.propertyLimit} onChange={(event) => setForm({ ...form, propertyLimit: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Hotel Limit</Label>
                <Input type="number" value={form.hotelLimit} onChange={(event) => setForm({ ...form, hotelLimit: event.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Features (comma separated)</Label>
                <Textarea value={form.features} onChange={(event) => setForm({ ...form, features: event.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Paystack Plan Code (optional)</Label>
                <Input value={form.paystackPlanCode} onChange={(event) => setForm({ ...form, paystackPlanCode: event.target.value })} />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4 md:col-span-2">
                <div>
                  <p className="font-medium text-slate-900">Free plan</p>
                  <p className="text-sm text-slate-500">Free plans skip checkout and work as fallback access.</p>
                </div>
                <Switch checked={form.isFree} onCheckedChange={(checked) => setForm({ ...form, isFree: checked, priceAmount: checked ? '0' : form.priceAmount })} />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4 md:col-span-2">
                <div>
                  <p className="font-medium text-slate-900">Plan is active</p>
                  <p className="text-sm text-slate-500">Inactive plans stay in the database but do not show to users.</p>
                </div>
                <Switch checked={form.isActive} onCheckedChange={(checked) => setForm({ ...form, isActive: checked })} />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setPlanDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => void savePlan()} disabled={savingPlan}>
                {savingPlan ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
