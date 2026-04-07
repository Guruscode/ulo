'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ApiClientError } from '@/lib/client/api-error'
import {
  getCurrentSubscriptionRequest,
  initializeSubscriptionCheckoutRequest,
  listSubscriptionPlansRequest,
} from '@/lib/client/subscriptions-client'
import type { SubscriptionPlanRecord, UserSubscriptionRecord } from '@/lib/subscriptions/types'
import { ArrowLeft, Check, CreditCard, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

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

export default function AddPropertyPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [plans, setPlans] = useState<SubscriptionPlanRecord[]>([])
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlanRecord | null>(null)
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscriptionRecord | null>(null)
  const [plansLoading, setPlansLoading] = useState(true)
  const [checkoutPlanId, setCheckoutPlanId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    features: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.currentTarget
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
    }))
  }

  React.useEffect(() => {
    const loadSubscriptions = async () => {
      setPlansLoading(true)
      try {
        const [plansResponse, currentResponse] = await Promise.all([
          listSubscriptionPlansRequest(),
          getCurrentSubscriptionRequest(),
        ])
        setPlans(plansResponse.plans)
        setCurrentPlan(currentResponse.plan)
        setCurrentSubscription(currentResponse.subscription)
      } catch (error) {
        toast.error(error instanceof ApiClientError ? error.message : 'Unable to load subscription plans.')
      } finally {
        setPlansLoading(false)
      }
    }

    void loadSubscriptions()
  }, [])

  const startCheckout = async (plan: SubscriptionPlanRecord) => {
    if (plan.isFree) {
      toast.message('You are already covered by the free plan.')
      return
    }

    setCheckoutPlanId(plan.id)
    try {
      const response = await initializeSubscriptionCheckoutRequest(plan.id)
      window.location.href = response.authorizationUrl
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : 'Unable to start subscription checkout.')
      setCheckoutPlanId(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      console.log('[v0] Property added:', formData)
      router.push('/dashboard?tab=properties')
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="ml-2 sm:ml-4 flex items-center">
            <Image
              src="/brand/logo-primary.svg"
              alt="ULO"
              width={212}
              height={64}
              className="h-14 w-auto"
              priority
            />
          </Link>
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className="text-gray-700 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Add New Property
            </h1>
            <p className="text-gray-600 mb-8">
              Fill in the details below to list a new property
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Basic Information
                </h2>
                <div className="space-y-4">
                  {formData.type !== 'Land' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Title *
                      </label>
                      <Input
                        type="text"
                        name="title"
                        placeholder="e.g., Modern Downtown Loft"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="h-11"
                      />
                    </div>
                  ) : null}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      placeholder="Describe the property in detail..."
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <Input
                      type="text"
                      name="location"
                      placeholder="e.g., Downtown District, City Name"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Property Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Type *
                    </label>
                    <Select value={formData.type} onValueChange={handleSelectChange}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="For Sale">For Sale</SelectItem>
                        <SelectItem value="For Rent">For Rent</SelectItem>
                        <SelectItem value="Land">Land</SelectItem>
                        <SelectItem value="Shortlet">Shortlet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <Input
                      type="number"
                      name="price"
                      placeholder="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      className="h-11"
                    />
                  </div>

                  {formData.type !== 'Land' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bedrooms *
                      </label>
                      <Input
                        type="number"
                        name="bedrooms"
                        placeholder="0"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        required
                        className="h-11"
                      />
                    </div>
                  ) : null}

                  {formData.type !== 'Land' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bathrooms *
                      </label>
                      <Input
                        type="number"
                        name="bathrooms"
                        placeholder="0"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        required
                        className="h-11"
                      />
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Features */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Features</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Features
                  </label>
                  <textarea
                    name="features"
                    placeholder="e.g., Pool, Garden, Gym, Security, Parking..."
                    value={formData.features}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Subscription Plans
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Your current tier controls how many listings you can publish from this account.
                </p>

                {plansLoading ? (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-500">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentPlan ? (
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Current tier</p>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-semibold text-gray-900">{currentPlan.name}</h3>
                              <Badge variant="outline">{currentSubscription?.status || 'active'}</Badge>
                              {currentPlan.isFree ? <Badge variant="outline">Free</Badge> : null}
                            </div>
                            <p className="mt-2 text-sm text-gray-600">{currentPlan.description}</p>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>{limitLabel(currentPlan.propertyLimit, 'property listing')}</p>
                            <p>{limitLabel(currentPlan.hotelLimit, 'hotel listing')}</p>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <div className="grid gap-4 lg:grid-cols-3">
                      {plans.map((plan) => {
                        const isCurrent = currentPlan?.id === plan.id
                        const isBusy = checkoutPlanId === plan.id

                        return (
                          <div key={plan.id} className="rounded-xl border border-gray-200 bg-white p-5">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                                <p className="mt-1 text-sm text-gray-600">{plan.description}</p>
                              </div>
                              {plan.isFree ? <Badge variant="outline">Free</Badge> : null}
                            </div>

                            <div className="mt-4">
                              <p className="text-2xl font-bold text-gray-900">
                                {plan.isFree ? 'Free' : formatMoney(plan.priceAmount)}
                              </p>
                              {!plan.isFree ? (
                                <p className="text-sm text-gray-500">per {plan.billingInterval}</p>
                              ) : null}
                            </div>

                            <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                              <p>{limitLabel(plan.propertyLimit, 'property listing')}</p>
                              <p>{limitLabel(plan.hotelLimit, 'hotel listing')}</p>
                            </div>

                            <div className="mt-4 space-y-2 text-sm text-gray-600">
                              {plan.features.map((feature, index) => (
                                <div key={`${plan.id}-${index}`} className="flex items-start gap-2">
                                  <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </div>

                            <Button
                              type="button"
                              className="mt-5 w-full"
                              variant={isCurrent ? 'outline' : 'default'}
                              disabled={isCurrent || isBusy}
                              onClick={() => void startCheckout(plan)}
                            >
                              {isBusy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
                              {isCurrent ? 'Current Tier' : plan.isFree ? 'Included' : 'Subscribe Here'}
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-8 border-t border-gray-200">
                <Link href="/dashboard" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-gray-200 hover:bg-gray-50 bg-transparent"
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-secondary hover:bg-secondary/90 text-white h-11"
                >
                  {isLoading ? 'Publishing...' : 'Publish Property'}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
