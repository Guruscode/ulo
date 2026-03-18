import Link from 'next/link'
import { Check } from 'lucide-react'

import HomeFooter from '@/components/home/home-footer'
import HomeNav from '@/components/home/home-nav'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { listPlansForActor } from '@/lib/server/subscriptions/service'

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

export default async function PricingPage() {
  const plans = await listPlansForActor()

  return (
    <div className="min-h-screen bg-background">
      <HomeNav />

      <section className="bg-gradient-to-br from-secondary/10 via-background to-secondary/5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 text-center">
            <h1 className="font-serif text-5xl font-bold text-secondary md:text-6xl">Pricing Plans</h1>
            <p className="mx-auto max-w-2xl text-xl text-foreground/70">
              Choose the plan that matches your listing volume. These prices and limits are managed live from the admin panel.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 pb-24 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 gap-6 ${plans.length >= 4 ? 'lg:grid-cols-4' : plans.length === 3 ? 'lg:grid-cols-3' : 'md:grid-cols-2'}`}>
          {plans.map((plan, index) => {
            const highlighted = index === 1 || (!plan.isFree && plan.priceAmount > 0 && index === 0)

            return (
              <Card
                key={plan.id}
                className={`relative flex h-full flex-col overflow-hidden ${
                  highlighted ? 'border-2 border-secondary shadow-lg' : 'border border-border hover:shadow-lg'
                }`}
              >
                {highlighted ? (
                  <div className="absolute right-0 top-0 rounded-bl-lg bg-secondary px-3 py-1 text-xs font-bold text-white">
                    POPULAR
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-secondary">{plan.name}</h3>
                      {plan.isFree ? <Badge variant="outline">Free</Badge> : null}
                    </div>
                    <p className="mt-1 text-sm text-foreground/60">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">
                      {plan.isFree ? 'Free' : formatMoney(plan.priceAmount)}
                    </span>
                    {!plan.isFree ? (
                      <span className="ml-2 text-sm text-foreground/50">/ {plan.billingInterval}</span>
                    ) : null}
                  </div>

                  <div className="mb-6 space-y-3 rounded-xl bg-slate-50 p-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/60">Property listings</span>
                      <span className="font-medium text-foreground">{limitLabel(plan.propertyLimit, 'listing')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/60">Hotels</span>
                      <span className="font-medium text-foreground">{limitLabel(plan.hotelLimit, 'hotel')}</span>
                    </div>
                  </div>

                  <div className="mb-6 flex-1 space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={`${plan.id}-${featureIndex}`} className="flex items-start gap-3 text-sm">
                        <Check className="mt-0.5 h-4 w-4 text-green-600" />
                        <span className="text-foreground/70">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    asChild
                    className={`w-full ${
                      highlighted ? 'bg-secondary text-white hover:bg-secondary/90' : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    <Link href="/signup">{plan.isFree ? 'Start Free' : 'Choose Plan'}</Link>
                  </Button>

                  <p className="mt-3 text-center text-xs text-foreground/50">
                    {plan.isFree ? 'Free access starts immediately after signup.' : 'Pay online for activation through Paystack.'}
                  </p>
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      <HomeFooter />
    </div>
  )
}
