'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Home } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AddPropertyPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    yearBuilt: '',
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">ULO</span>
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
                        <SelectItem value="Commercial">Commercial</SelectItem>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Square Feet *
                    </label>
                    <Input
                      type="number"
                      name="sqft"
                      placeholder="0"
                      value={formData.sqft}
                      onChange={handleInputChange}
                      required
                      className="h-11"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year Built
                    </label>
                    <Input
                      type="number"
                      name="yearBuilt"
                      placeholder="2024"
                      value={formData.yearBuilt}
                      onChange={handleInputChange}
                      className="h-11"
                    />
                  </div>
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
