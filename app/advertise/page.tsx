'use client'

import React from "react"

import HomeNav from '@/components/home/home-nav'
import HomeFooter from '@/components/home/home-footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowRight, Zap, Target, BarChart3, Users } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function AdvertisePage() {
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    website: '',
    description: '',
    contactName: '',
    email: '',
    phone: '',
    budget: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setFormData({
      businessName: '',
      businessType: '',
      website: '',
      description: '',
      contactName: '',
      email: '',
      phone: '',
      budget: '',
    })
    alert('Thank you! Our team will review your request and contact you shortly.')
  }

  const packages = [
    {
      name: 'Starter',
      price: '₦50,000',
      features: ['Featured listing', '30 days', 'Email support', 'Basic analytics'],
      icon: Zap,
    },
    {
      name: 'Professional',
      price: '₦150,000',
      features: ['Premium placement', '90 days', 'Phone & email support', 'Advanced analytics', 'Social media boost'],
      icon: Target,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: ['Maximum visibility', '180+ days', 'Dedicated account manager', 'Full analytics suite', 'Custom campaigns'],
      icon: BarChart3,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <HomeNav />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary/10 to-transparent pt-16 md:pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-4">
              Advertise With Us
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Reach thousands of property seekers and investors. Grow your business with our targeted advertising solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Advertising Packages */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary mb-12 text-center">Advertising Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => {
            const Icon = pkg.icon
            return (
              <div key={index} className={`rounded-lg border p-8 transition ${index === 1 ? 'border-secondary bg-secondary/5' : 'border-gray-100'}`}>
                <div className="flex items-center gap-3 mb-6">
                  <Icon className="w-8 h-8 text-secondary" />
                  <h3 className="text-2xl font-bold text-gray-900">{pkg.name}</h3>
                </div>
                <div className="mb-6">
                  <p className="text-3xl font-bold text-secondary">{pkg.price}</p>
                  {pkg.price !== 'Custom' && <p className="text-sm text-gray-600">per campaign</p>}
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-secondary rounded-full" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className={index === 1 ? 'w-full bg-secondary hover:bg-secondary/90 text-white' : 'w-full border-secondary text-secondary hover:bg-secondary/5'} variant={index === 1 ? 'default' : 'outline'}>
                  Get Started
                </Button>
              </div>
            )
          })}
        </div>
      </section>

      {/* Why Advertise */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white rounded-lg border border-gray-100 my-12">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary mb-8">Why Advertise With Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex gap-4">
            <Users className="w-8 h-8 text-secondary flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Massive Audience Reach</h3>
              <p className="text-gray-600">Connect with thousands of active property seekers, investors, and tenants on our platform.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <BarChart3 className="w-8 h-8 text-secondary flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Detailed Analytics</h3>
              <p className="text-gray-600">Track your ad performance with comprehensive analytics and engagement metrics.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Target className="w-8 h-8 text-secondary flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Targeted Campaigns</h3>
              <p className="text-gray-600">Reach your ideal audience with location and interest-based targeting options.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Zap className="w-8 h-8 text-secondary flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Quick Setup</h3>
              <p className="text-gray-600">Get your campaigns live in minutes with our simple and intuitive platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg border border-gray-100 p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-secondary mb-8">Get Started Today</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Business Information</h3>
              
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Your business name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="businessType">Business Type</Label>
                <select
                  id="businessType"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="">Select business type</option>
                  <option value="realEstate">Real Estate Agency</option>
                  <option value="developer">Property Developer</option>
                  <option value="construction">Construction Company</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about your business"
                  rows={4}
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-semibold text-gray-900">Contact Information</h3>
              
              <div>
                <Label htmlFor="contactName">Contact Name</Label>
                <Input
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+234 000 000 0000"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="budget">Budget Range</Label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="">Select budget range</option>
                  <option value="under50">Under ₦50,000</option>
                  <option value="50-100">₦50,000 - ₦100,000</option>
                  <option value="100-500">₦100,000 - ₦500,000</option>
                  <option value="above500">Above ₦500,000</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-white flex-1">
                Submit Inquiry
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </section>

      <HomeFooter />
    </div>
  )
}
