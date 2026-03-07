'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check, X } from 'lucide-react'
import HomeNav from '@/components/home/home-nav'
import HomeFooter from '@/components/home/home-footer'
import { motion } from 'framer-motion'

const plans = [
  {
    name: 'Manager',
    price: '₦15,900',
    description: 'Perfect for individual property managers',
    features: [
      { label: 'Listings', value: '120' },
      { label: 'Auto PushUp', value: 'Every 15 days' },
      { label: 'Area Specialist', value: '1' },
      { label: 'Manual Push Up', value: '35' },
      { label: 'Premium', value: '20' },
      { label: 'Premium Gold', value: '-' },
      { label: 'Social Media Ads', value: '-' },
      { label: 'Banner Ads', value: '-' },
      { label: 'Sponsored Listings', value: '-' },
      { label: 'View Client Request', value: 'Yes' },
    ],
    popular: false,
  },
  {
    name: 'Premium',
    price: '₦27,900',
    description: 'Best for growing real estate businesses',
    features: [
      { label: 'Listings', value: '300' },
      { label: 'Auto PushUp', value: 'Every 9 days' },
      { label: 'Area Specialist', value: '1' },
      { label: 'Manual Push Up', value: '65' },
      { label: 'Premium', value: '60' },
      { label: 'Premium Gold', value: '-' },
      { label: 'Social Media Ads', value: '-' },
      { label: 'Banner Ads', value: '-' },
      { label: 'Sponsored Listings', value: '-' },
      { label: 'View Client Request', value: 'Yes' },
    ],
    popular: true,
  },
  {
    name: 'Gold',
    price: '₦119,900',
    description: 'For established agencies and teams',
    features: [
      { label: 'Listings', value: '3,000' },
      { label: 'Auto PushUp', value: 'Every 3 days' },
      { label: 'Area Specialist', value: '3' },
      { label: 'Manual Push Up', value: '300' },
      { label: 'Premium', value: '350' },
      { label: 'Premium Gold', value: '40' },
      { label: 'Social Media Ads', value: '2' },
      { label: 'Banner Ads', value: '-' },
      { label: 'Sponsored Listings', value: '3' },
      { label: 'View Client Request', value: 'Yes' },
    ],
    popular: false,
  },
  {
    name: 'Platinum',
    price: '₦169,900',
    description: 'Ultimate package for enterprise clients',
    features: [
      { label: 'Listings', value: 'Unlimited' },
      { label: 'Auto PushUp', value: 'Every 2 days' },
      { label: 'Area Specialist', value: '4' },
      { label: 'Manual Push Up', value: '500' },
      { label: 'Premium', value: '600' },
      { label: 'Premium Gold', value: '80' },
      { label: 'Social Media Ads', value: '2' },
      { label: 'Banner Ads', value: '1' },
      { label: 'Sponsored Listings', value: '5' },
      { label: 'View Client Request', value: 'Yes' },
    ],
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <HomeNav />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary/10 via-background to-secondary/5 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-secondary">Pricing Plans</h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Choose the perfect plan for your real estate business needs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`h-full flex flex-col relative overflow-hidden ${
                plan.popular 
                  ? 'border-2 border-secondary shadow-lg' 
                  : 'border border-border hover:shadow-lg'
              }`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    POPULAR
                  </div>
                )}
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-secondary">{plan.name}</h3>
                    <p className="text-sm text-foreground/60 mt-1">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  </div>

                  <div className="flex-1 space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-foreground/60">{feature.label}</span>
                        <span className={`font-medium ${feature.value === 'Yes' ? 'text-green-600' : feature.value === '-' ? 'text-foreground/30' : 'text-foreground'}`}>
                          {feature.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-secondary hover:bg-secondary/90 text-white' 
                        : 'bg-primary hover:bg-primary/90 text-white'
                    }`}
                  >
                    Buy Now
                  </Button>
                  
                  <p className="text-xs text-center text-foreground/50 mt-3">
                    Pay online for instant activation
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <HomeFooter />
    </div>
  )
}

