'use client'

import React from "react"

import HomeNav from '@/components/home/home-nav'
import HomeFooter from '@/components/home/home-footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function SellPage() {
  const [formData, setFormData] = useState({
    propertyType: '',
    location: '',
    bedrooms: '',
    price: '',
    description: '',
    name: '',
    email: '',
    phone: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setFormData({
      propertyType: '',
      location: '',
      bedrooms: '',
      price: '',
      description: '',
      name: '',
      email: '',
      phone: '',
    })
    alert('Thank you! We will review your property and contact you shortly.')
  }

  const benefits = [
    'Reach millions of qualified buyers',
    'Professional property photos and staging',
    'Expert market analysis and pricing',
    'Dedicated sales agent support',
    'Multiple listing platforms',
    'Secure transaction management',
  ]

  return (
    <div className="min-h-screen bg-background">
      <HomeNav />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary/10 to-transparent pt-16 md:pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-4">
              Sell Your Property
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              List your property with us and connect with serious buyers. We help you maximize value and close deals faster.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary mb-8 text-center">Why Sell With Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-4 p-6 bg-white rounded-lg border border-gray-100 hover:border-secondary/30 transition">
              <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">{benefit}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg border border-gray-100 p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-secondary mb-8">List Your Property</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Property Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Property Details</h3>
              
              <div>
                <Label htmlFor="propertyType">Property Type</Label>
                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="">Select property type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter property location"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    placeholder="e.g. 3"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Expected Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 50000000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your property's key features and amenities"
                  rows={4}
                />
              </div>
            </div>

            {/* Your Details */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-semibold text-gray-900">Your Information</h3>
              
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
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
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-white flex-1">
                Submit Listing
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
