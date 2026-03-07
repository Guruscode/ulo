'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import HomeNav from '@/components/home/home-nav'
import HomeFooter from '@/components/home/home-footer'
import {
  Home,
  FileCheck,
  DollarSign,
  MapPin,
  Shield,
  Zap,
  ArrowRight,
  Building2,
  TrendingUp,
} from 'lucide-react'
import { motion } from 'framer-motion'

const services = [
  {
    id: 1,
    slug: 'property-valuation',
    title: 'Property Valuation',
    description: 'Get an accurate market valuation of your property from our experienced appraisers',
    icon: DollarSign,
    features: ['Professional Assessment', 'Market Analysis', 'Detailed Report'],
    color: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    id: 2,
    slug: 'legal-documentation',
    title: 'Legal Documentation',
    description: 'Complete legal support including title verification and document preparation',
    icon: FileCheck,
    features: ['Title Search', 'Document Prep', 'Legal Review'],
    color: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    id: 3,
    slug: 'property-management',
    title: 'Property Management',
    description: 'Full property management services including maintenance and tenant relations',
    icon: Building2,
    features: ['Tenant Management', 'Maintenance', 'Rent Collection'],
    color: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    id: 4,
    slug: 'home-inspection',
    title: 'Home Inspection',
    description: 'Thorough inspection services to ensure property quality before purchase',
    icon: Shield,
    features: ['Structural Assessment', 'System Check', 'Detailed Report'],
    color: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  {
    id: 5,
    slug: 'investment-consultation',
    title: 'Investment Consultation',
    description: 'Expert advice on real estate investments tailored to your financial goals',
    icon: TrendingUp,
    features: ['Market Analysis', 'ROI Projection', 'Strategy Planning'],
    color: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
  {
    id: 6,
    slug: 'fast-transactions',
    title: 'Fast Transactions',
    description: 'Expedited property sales and purchases with minimal delays',
    icon: Zap,
    features: ['Quick Closing', 'Hassle-Free', '24/7 Support'],
    color: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
  },
]

export default function ServicesPage() {
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
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-secondary">Our Services</h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Comprehensive real estate services designed to simplify your property journey
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Link key={service.id} href={`/services/${service.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col cursor-pointer">
                  <div className={`${service.color} p-6`}>
                    <Icon className={`w-12 h-12 ${service.iconColor}`} />
                  </div>

                  <div className="p-6 flex-1 flex flex-col space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-secondary">{service.title}</h3>
                      <p className="text-sm text-foreground/70 mt-2">{service.description}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-secondary uppercase tracking-wide">Key Features:</p>
                      <ul className="space-y-1">
                        {service.features.map((feature) => (
                          <li key={feature} className="text-sm text-foreground/60 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button variant="outline" className="w-full mt-4 group bg-transparent">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-secondary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center space-y-12"
          >
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-secondary">Why Choose Our Services</h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                We provide end-to-end solutions with industry expertise and customer-centric approach
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Expert Team', description: 'Experienced professionals with proven track records' },
                { title: 'Transparent Pricing', description: 'Clear, upfront costs with no hidden charges' },
                { title: '24/7 Support', description: 'Always available when you need assistance' },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-lg p-6 space-y-3">
                  <h3 className="text-lg font-semibold text-secondary">{item.title}</h3>
                  <p className="text-sm text-foreground/70">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-secondary to-secondary/80 rounded-2xl p-12 text-center text-white space-y-6"
        >
          <h2 className="text-4xl font-serif font-bold">Ready to Get Started?</h2>
          <p className="text-lg text-white/90">Contact us today to explore how our services can help you</p>
          <Link href="/login">
            <Button size="lg" className="bg-white text-secondary hover:bg-white/90">
              Get Started Now
            </Button>
          </Link>
        </motion.div>
      </section>

      <HomeFooter />
    </div>
  )
}
