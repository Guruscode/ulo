'use client'

import { use } from 'react'
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
  ArrowLeft,
  CheckCircle,
  Clock,
  Users,
} from 'lucide-react'
import { motion } from 'framer-motion'

const services = [
  {
    id: 'property-valuation',
    slug: 'property-valuation',
    title: 'Property Valuation',
    description: 'Get an accurate market valuation of your property from our experienced appraisers',
    icon: DollarSign,
    features: ['Professional Assessment', 'Market Analysis', 'Detailed Report'],
    fullDescription: 'Our professional appraisers provide comprehensive property valuations using latest market data and industry standards. Perfect for sales, loans, insurance, or investment decisions.',
    benefits: [
      'Accurate market-based valuations',
      'Detailed property analysis report',
      'Fast turnaround time',
      'Certified appraisers with years of experience',
      'Updated market comparables',
      'Professional documentation',
    ],
    process: [
      { step: 1, title: 'Initial Consultation', description: 'Discuss your property and valuation needs' },
      { step: 2, title: 'Property Inspection', description: 'Thorough physical inspection and documentation' },
      { step: 3, title: 'Market Research', description: 'Analyze comparable properties and market trends' },
      { step: 4, title: 'Report Generation', description: 'Prepare comprehensive valuation report' },
    ],
    pricing: 'Starting from ₦50,000 for residential properties',
    timeline: '3-5 business days',
    color: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    id: 'legal-documentation',
    slug: 'legal-documentation',
    title: 'Legal Documentation',
    description: 'Complete legal support including title verification and document preparation',
    icon: FileCheck,
    features: ['Title Search', 'Document Prep', 'Legal Review'],
    fullDescription: 'Comprehensive legal services to ensure smooth property transactions. Our legal experts handle all documentation requirements and compliance matters.',
    benefits: [
      'Complete title verification',
      'Document preparation and review',
      'Legal compliance assurance',
      'Expert legal consultation',
      'Fast document processing',
      'Peace of mind with expert guidance',
    ],
    process: [
      { step: 1, title: 'Document Collection', description: 'Gather all necessary property documents' },
      { step: 2, title: 'Title Verification', description: 'Verify ownership and check for liens' },
      { step: 3, title: 'Legal Review', description: 'Review all transaction documents' },
      { step: 4, title: 'Finalization', description: 'Prepare and finalize all legal documents' },
    ],
    pricing: 'Starting from ₦75,000 for document preparation',
    timeline: '5-7 business days',
    color: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    id: 'property-management',
    slug: 'property-management',
    title: 'Property Management',
    description: 'Full property management services including maintenance and tenant relations',
    icon: Home,
    features: ['Tenant Management', 'Maintenance', 'Rent Collection'],
    fullDescription: 'Professional property management services to maximize your investment returns while minimizing your involvement. We handle everything from tenant relations to maintenance.',
    benefits: [
      'Professional tenant screening',
      'Rent collection and accounting',
      'Regular maintenance and repairs',
      '24/7 emergency support',
      'Detailed financial reporting',
      'Legal compliance management',
    ],
    process: [
      { step: 1, title: 'Initial Assessment', description: 'Evaluate property and discuss goals' },
      { step: 2, title: 'Tenant Management', description: 'Screen and place quality tenants' },
      { step: 3, title: 'Ongoing Maintenance', description: 'Regular inspections and repairs' },
      { step: 4, title: 'Financial Reporting', description: 'Monthly statements and rent collection' },
    ],
    pricing: '8-10% of monthly rental income',
    timeline: 'Ongoing service',
    color: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    id: 'home-inspection',
    slug: 'home-inspection',
    title: 'Home Inspection',
    description: 'Thorough inspection services to ensure property quality before purchase',
    icon: Shield,
    features: ['Structural Assessment', 'System Check', 'Detailed Report'],
    fullDescription: 'Comprehensive home inspections to identify potential issues before you buy. Our certified inspectors examine every aspect of the property.',
    benefits: [
      'Complete structural assessment',
      'All systems and utilities check',
      'Detailed inspection report with photos',
      'Professional recommendations',
      'Expert inspector consultation',
      'Help negotiate repairs or price',
    ],
    process: [
      { step: 1, title: 'Scheduling', description: 'Schedule inspection at your convenience' },
      { step: 2, title: 'Property Walk-through', description: 'Thorough inspection of entire property' },
      { step: 3, title: 'Documentation', description: 'Photo and video documentation of findings' },
      { step: 4, title: 'Report Delivery', description: 'Comprehensive report with recommendations' },
    ],
    pricing: 'Starting from ₦40,000 for residential properties',
    timeline: '2-3 business days for report',
    color: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  {
    id: 'investment-consultation',
    slug: 'investment-consultation',
    title: 'Investment Consultation',
    description: 'Expert advice on real estate investments tailored to your financial goals',
    icon: Zap,
    features: ['Market Analysis', 'ROI Projection', 'Strategy Planning'],
    fullDescription: 'Get expert guidance on real estate investment strategies tailored to your financial goals. Our consultants analyze market trends and identify lucrative opportunities.',
    benefits: [
      'Personalized investment strategy',
      'Detailed market analysis',
      'ROI and cash flow projections',
      'Risk assessment and mitigation',
      'Portfolio diversification advice',
      'Ongoing market insights',
    ],
    process: [
      { step: 1, title: 'Goal Setting', description: 'Discuss your investment goals and timeline' },
      { step: 2, title: 'Market Analysis', description: 'Analyze market trends and opportunities' },
      { step: 3, title: 'Strategy Development', description: 'Create personalized investment plan' },
      { step: 4, title: 'Implementation Support', description: 'Guide through investment execution' },
    ],
    pricing: 'Starting from ₦100,000 for consultation',
    timeline: 'Initial consultation within 48 hours',
    color: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
  {
    id: 'fast-transactions',
    slug: 'fast-transactions',
    title: 'Fast Transactions',
    description: 'Expedited property sales and purchases with minimal delays',
    icon: Clock,
    features: ['Quick Closing', 'Hassle-Free', '24/7 Support'],
    fullDescription: 'Accelerate your property transaction with our fast-track service. We handle all the complexity so you can close quickly and confidently.',
    benefits: [
      'Quick closing in 7-14 days',
      'Dedicated transaction manager',
      '24/7 customer support',
      'Streamlined documentation',
      'No hidden fees or surprises',
      'Guaranteed completion',
    ],
    process: [
      { step: 1, title: 'Quick Assessment', description: 'Rapid property and buyer/seller assessment' },
      { step: 2, title: 'Documentation Fast-track', description: 'Expedited document preparation' },
      { step: 3, title: 'Verification', description: 'Accelerated title and legal checks' },
      { step: 4, title: 'Closing', description: 'Swift and secure transaction completion' },
    ],
    pricing: 'Competitive rates with no hidden charges',
    timeline: '7-14 days to closing',
    color: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
  },
]

export default function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const service = services.find((s) => s.slug === slug)

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <HomeNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-3xl font-bold text-secondary mb-4">Service Not Found</h1>
          <p className="text-foreground/70 mb-6">The service you're looking for doesn't exist.</p>
          <Link href="/services">
            <Button>Back to Services</Button>
          </Link>
        </div>
        <HomeFooter />
      </div>
    )
  }

  const IconComponent = service.icon

  return (
    <div className="min-h-screen bg-background">
      <HomeNav />

      {/* Hero Section */}
      <section className={`${service.color} py-16 md:py-24`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Link href="/services" className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80">
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Link>

            <div className="flex items-start gap-6">
              <div className={`${service.iconColor} p-4 rounded-lg bg-white/50 backdrop-blur-sm`}>
                <IconComponent className="w-12 h-12" />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-serif font-bold text-secondary mb-4">{service.title}</h1>
                <p className="text-xl text-foreground/70 max-w-2xl">{service.fullDescription}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: DollarSign, label: 'Pricing', value: service.pricing },
            { icon: Clock, label: 'Timeline', value: service.timeline },
            { icon: Users, label: 'Expert Support', value: 'Available 24/7' },
          ].map((info) => {
            const InfoIcon = info.icon
            return (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-background border border-border rounded-lg p-6 space-y-2"
              >
                <InfoIcon className="w-6 h-6 text-secondary" />
                <p className="font-semibold text-secondary">{info.label}</p>
                <p className="text-foreground/70">{info.value}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="space-y-16">
          {/* Benefits */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-serif font-bold text-secondary mb-4">Why Choose This Service?</h2>
              <p className="text-foreground/70">Discover the key advantages that make our service the best choice for your needs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {service.benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                  <span className="text-foreground/80">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Process */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-serif font-bold text-secondary mb-4">How It Works</h2>
              <p className="text-foreground/70">Follow our proven process to get the best results.</p>
            </div>

            <div className="space-y-4">
              {service.process.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 p-6 border border-border rounded-lg hover:border-secondary transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-secondary text-white font-bold">
                      {item.step}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary mb-1">{item.title}</h3>
                    <p className="text-foreground/70">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-secondary/10 border border-secondary/20 rounded-lg p-12 text-center space-y-6"
          >
            <div>
              <h3 className="text-3xl font-bold text-secondary mb-2">Ready to Get Started?</h3>
              <p className="text-foreground/70">Let our experts help you with {service.title.toLowerCase()}</p>
            </div>
            <Button className="bg-secondary hover:bg-secondary/90 text-white px-8 py-3 text-lg">
              Request {service.title} Now
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <HomeFooter />
    </div>
  )
}
