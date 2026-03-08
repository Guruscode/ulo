'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  CreditCard,
  Check,
  Crown,
  Zap,
  Building,
  Calendar,
  AlertCircle,
} from 'lucide-react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/dashboard/dashboard-layout'

interface Plan {
  id: string
  name: string
  price: number
  interval: string
  icon: React.ReactNode
  features: string[]
  popular?: boolean
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 4999,
    interval: 'month',
    icon: <Building className="w-6 h-6" />,
    features: [
      'Up to 5 property listings',
      'Basic analytics',
      'Email support',
      'Standard visibility',
      '5 agent profiles',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9999,
    interval: 'month',
    icon: <Crown className="w-6 h-6" />,
    features: [
      'Up to 25 property listings',
      'Advanced analytics',
      'Priority support',
      'Featured listings',
      '25 agent profiles',
      'Custom branding',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 24999,
    interval: 'month',
    icon: <Zap className="w-6 h-6" />,
    features: [
      'Unlimited property listings',
      'Full analytics suite',
      '24/7 dedicated support',
      'Top visibility placement',
      'Unlimited agent profiles',
      'Custom branding',
      'API access',
      'White-label option',
    ],
  },
]

const currentSubscription = {
  plan: 'premium',
  status: 'active',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  amount: 9999,
}

export default function DashboardSubscriptionsPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)

  const formatCurrency = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`
  }

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId)
    setIsUpgradeOpen(false)
    setIsPaymentOpen(true)
  }

  const handlePayment = () => {
    setIsPaymentOpen(false)
    alert('Payment successful! Your subscription has been updated.')
  }

  const currentPlan = plans.find(p => p.id === currentSubscription.plan)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
            Subscription Plans
          </h1>
          <p className="text-slate-600 mt-1">
            Manage your subscription and billing
          </p>
        </div>

        {/* Current Subscription Card */}
        {currentSubscription && (
          <Card className="bg-white p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-secondary flex items-center justify-center">
                  {currentPlan?.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">{currentPlan?.name} Plan</h2>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <p className="text-slate-600 text-sm mt-1">
                    {formatCurrency(currentSubscription.amount)}/month • Renews on {currentSubscription.endDate}
                  </p>
                </div>
              </div>
              <Button 
                className="bg-secondary hover:bg-secondary/90 text-white"
                onClick={() => setIsUpgradeOpen(true)}
              >
                Upgrade Plan
              </Button>
            </div>
          </Card>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-white p-6 h-full flex flex-col ${plan.popular ? 'ring-2 ring-secondary' : ''}`}>
                {plan.popular && (
                  <Badge className="self-start mb-3 bg-secondary">Most Popular</Badge>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    plan.id === 'basic' ? 'bg-blue-100 text-blue-600' :
                    plan.id === 'premium' ? 'bg-purple-100 text-purple-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                    <p className="text-2xl font-bold text-slate-900">
                      {formatCurrency(plan.price)}
                      <span className="text-sm font-normal text-slate-500">/{plan.interval}</span>
                    </p>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${
                    plan.id === currentSubscription.plan
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      : plan.popular 
                        ? 'bg-secondary hover:bg-secondary/90 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                  onClick={() => {
                    if (plan.id !== currentSubscription.plan) {
                      setSelectedPlan(plan.id)
                      setIsUpgradeOpen(true)
                    }
                  }}
                  disabled={plan.id === currentSubscription.plan}
                >
                  {plan.id === currentSubscription.plan ? 'Current Plan' : 'Select Plan'}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Billing History */}
        <Card className="bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Billing History</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="font-medium text-slate-900">Premium Plan</p>
                  <p className="text-sm text-slate-500">January 1, 2024</p>
                </div>
              </div>
              <span className="font-semibold text-slate-900">{formatCurrency(9999)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="font-medium text-slate-900">Premium Plan</p>
                  <p className="text-sm text-slate-500">December 1, 2023</p>
                </div>
              </div>
              <span className="font-semibold text-slate-900">{formatCurrency(9999)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="font-medium text-slate-900">Premium Plan</p>
                  <p className="text-sm text-slate-500">November 1, 2023</p>
                </div>
              </div>
              <span className="font-semibold text-slate-900">{formatCurrency(9999)}</span>
            </div>
          </div>
        </Card>

        {/* Upgrade Dialog */}
        <Dialog open={isUpgradeOpen} onOpenChange={setIsUpgradeOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upgrade Your Plan</DialogTitle>
              <DialogDescription>
                You are about to upgrade to the {plans.find(p => p.id === selectedPlan)?.name} plan.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-600">New Plan</span>
                  <span className="font-semibold">{plans.find(p => p.id === selectedPlan)?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Amount</span>
                  <span className="font-semibold text-secondary">
                    {formatCurrency(plans.find(p => p.id === selectedPlan)?.price || 0)}/month
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUpgradeOpen(false)}>Cancel</Button>
              <Button className="bg-secondary hover:bg-secondary/90" onClick={() => handleUpgrade(selectedPlan!)}>
                Proceed to Payment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Payment Details</DialogTitle>
              <DialogDescription>
                Complete your payment to upgrade your plan.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Card Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="1234 5678 9012 3456"
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <input 
                    type="text" 
                    placeholder="MM/YY"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div className="space-y-2">
                  <Label>CVC</Label>
                  <input 
                    type="text" 
                    placeholder="123"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-yellow-800">This is a demo. No real payment will be processed.</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>Cancel</Button>
              <Button className="bg-secondary hover:bg-secondary/90" onClick={handlePayment}>
                Pay {formatCurrency(plans.find(p => p.id === selectedPlan)?.price || 0)}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

