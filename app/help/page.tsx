'use client'

import React from "react"

import HomeNav from '@/components/home/home-nav'
import HomeFooter from '@/components/home/home-footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ArrowRight, Mail, Phone, MessageSquare, Search } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Support request:', formData)
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    })
    alert('Thank you for contacting us! We will respond within 24 hours.')
  }

  const faqs = [
    {
      question: 'How do I list my property?',
      answer: 'To list your property, click on "List Property" in the navigation menu or go to your dashboard. Fill in the property details, add photos, and submit. Our team will review and approve your listing within 24 hours.',
    },
    {
      question: 'What documents are required to sell my property?',
      answer: 'We typically require: property deed, identification card, proof of ownership, and recent property photos. The exact requirements may vary depending on the property type and location.',
    },
    {
      question: 'How can I search for properties?',
      answer: 'Use our search bar on the home page or browse through categories like Buy, Rent, Shortlet, and Apartments. You can filter by location, price, property type, and other features.',
    },
    {
      question: 'What are the listing fees?',
      answer: 'We offer both free and premium listing options. Free listings are displayed for 30 days. Premium listings offer extended visibility and featured placement. Check our pricing page for details.',
    },
    {
      question: 'How do I contact a property agent?',
      answer: 'Go to the "Find Agent" section to browse available agents. You can view their profiles, ratings, and contact them directly through the platform or via the phone number provided.',
    },
    {
      question: 'Is my personal information secure?',
      answer: 'Yes, we use industry-standard encryption and security measures to protect all user data. Your information is never shared with third parties without your consent.',
    },
    {
      question: 'How long does the property approval process take?',
      answer: 'Typically, property listings are reviewed and approved within 24 hours. During busy periods, it may take up to 48 hours. You will receive an email notification once your listing is approved.',
    },
    {
      question: 'Can I edit my listing after it\'s posted?',
      answer: 'Yes, you can edit your listing anytime from your dashboard. Changes are usually reflected within a few minutes.',
    },
  ]

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      description: 'support@uloproperty.com',
      action: 'Send Email',
    },
    {
      icon: Phone,
      title: 'Phone',
      description: '+234 700 000 0000',
      action: 'Call Now',
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Available 9 AM - 6 PM',
      action: 'Start Chat',
    },
  ]

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      <HomeNav />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary/10 to-transparent pt-16 md:pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-4">
              How Can We Help?
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions or get in touch with our support team.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <div key={index} className="bg-white rounded-lg border border-gray-100 p-8 text-center hover:border-secondary/30 transition">
                <Icon className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-6">{method.description}</p>
                <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/5 w-full bg-transparent">
                  {method.action}
                </Button>
              </div>
            )
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary mb-8">Frequently Asked Questions</h2>

        {/* Search FAQ */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search FAQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
        </div>

        {/* FAQ Accordion */}
        {filteredFaqs.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-2">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-gray-100 rounded-lg px-6">
                <AccordionTrigger className="py-4 hover:no-underline hover:text-secondary">
                  <span className="text-left font-semibold text-gray-900">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-12 text-gray-600">
            No results found for "{searchQuery}". Please try a different search.
          </div>
        )}
      </section>

      {/* Contact Form */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg border border-gray-100 p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-secondary mb-8">Still Have Questions?</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Please describe your issue or question..."
                rows={5}
                required
              />
            </div>

            <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-white w-full">
              Send Message
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </div>
      </section>

      <HomeFooter />
    </div>
  )
}
