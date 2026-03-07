'use client'

import { use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import HomeNav from '@/components/home/home-nav'
import HomeFooter from '@/components/home/home-footer'
import { Mail, Phone, MapPin, Star, ArrowLeft, MessageCircle, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

const agents = [
  {
    id: 1,
    name: 'Chisom Okonkwo',
    title: 'Senior Real Estate Agent',
    location: 'Lagos, Nigeria',
    phone: '+234 801 234 5678',
    email: 'chisom@ulorealestate.com',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    rating: 4.9,
    reviews: 127,
    specialization: 'Luxury Residential',
    propertiesSold: 156,
    bio: 'With over 15 years of experience in the real estate industry, Chisom specializes in luxury residential properties across Lagos. Known for exceptional client service and market expertise.',
    languages: ['English', 'Yoruba'],
    yearsExperience: 15,
    topRatings: [
      { label: 'Communication', score: 5.0 },
      { label: 'Professionalism', score: 4.9 },
      { label: 'Market Knowledge', score: 4.8 },
      { label: 'Negotiation Skills', score: 4.9 },
    ],
    recentListings: 12,
  },
  {
    id: 2,
    name: 'Amara Ibrahim',
    title: 'Commercial Property Specialist',
    location: 'Abuja, Nigeria',
    phone: '+234 802 345 6789',
    email: 'amara@ulorealestate.com',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    rating: 4.8,
    reviews: 98,
    specialization: 'Commercial Real Estate',
    propertiesSold: 132,
    bio: 'Amara is a certified commercial real estate specialist with expertise in office, retail, and mixed-use properties. She has successfully closed over $50M in commercial transactions.',
    languages: ['English', 'Hausa'],
    yearsExperience: 12,
    topRatings: [
      { label: 'Market Analysis', score: 4.9 },
      { label: 'Professionalism', score: 4.8 },
      { label: 'Market Knowledge', score: 4.9 },
      { label: 'Deal Negotiation', score: 4.7 },
    ],
    recentListings: 8,
  },
  {
    id: 3,
    name: 'Tunde Adeyemi',
    title: 'Investment Property Agent',
    location: 'Lagos, Nigeria',
    phone: '+234 803 456 7890',
    email: 'tunde@ulorealestate.com',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    rating: 4.7,
    reviews: 112,
    specialization: 'Investment Properties',
    propertiesSold: 89,
    bio: 'Tunde focuses on investment properties with strong ROI potential. His analytical approach and market insights have helped hundreds of investors build profitable portfolios.',
    languages: ['English', 'Yoruba'],
    yearsExperience: 10,
    topRatings: [
      { label: 'ROI Analysis', score: 4.8 },
      { label: 'Market Knowledge', score: 4.7 },
      { label: 'Communication', score: 4.6 },
      { label: 'Follow-up', score: 4.7 },
    ],
    recentListings: 15,
  },
  {
    id: 4,
    name: 'Zainab Hassan',
    title: 'Residential Sales Agent',
    location: 'Port Harcourt, Nigeria',
    phone: '+234 804 567 8901',
    email: 'zainab@ulorealestate.com',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    rating: 4.9,
    reviews: 145,
    specialization: 'Residential Properties',
    propertiesSold: 198,
    bio: 'Zainab is the top-performing residential agent in Port Harcourt. Her warm personality and attention to detail make the home buying experience smooth and enjoyable.',
    languages: ['English', 'Igbo'],
    yearsExperience: 11,
    topRatings: [
      { label: 'Client Satisfaction', score: 4.9 },
      { label: 'Communication', score: 4.9 },
      { label: 'Professionalism', score: 4.9 },
      { label: 'Problem Solving', score: 4.8 },
    ],
    recentListings: 18,
  },
  {
    id: 5,
    name: 'Chidi Nwosu',
    title: 'Land & Development Agent',
    location: 'Enugu, Nigeria',
    phone: '+234 805 678 9012',
    email: 'chidi@ulorealestate.com',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    rating: 4.6,
    reviews: 87,
    specialization: 'Land Development',
    propertiesSold: 67,
    bio: 'Chidi specializes in land acquisition and development projects. He has strong connections with developers and government agencies, facilitating smooth land transactions.',
    languages: ['English', 'Igbo'],
    yearsExperience: 9,
    topRatings: [
      { label: 'Connections', score: 4.7 },
      { label: 'Market Knowledge', score: 4.6 },
      { label: 'Documentation', score: 4.6 },
      { label: 'Professionalism', score: 4.5 },
    ],
    recentListings: 6,
  },
  {
    id: 6,
    name: 'Nia Okafor',
    title: 'Rental Properties Specialist',
    location: 'Calabar, Nigeria',
    phone: '+234 806 789 0123',
    email: 'nia@ulorealestate.com',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    rating: 4.8,
    reviews: 103,
    specialization: 'Rental Properties',
    propertiesSold: 156,
    bio: 'Nia specializes in rental properties and property management. She helps investors find high-yield rental properties and manages ongoing tenant relations.',
    languages: ['English', 'Efik'],
    yearsExperience: 8,
    topRatings: [
      { label: 'Property Management', score: 4.8 },
      { label: 'Tenant Relations', score: 4.8 },
      { label: 'Market Knowledge', score: 4.7 },
      { label: 'Communication', score: 4.8 },
    ],
    recentListings: 10,
  },
]

export default function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const agent = agents.find((a) => a.id === Number(id))

  if (!agent) {
    return (
      <div className="min-h-screen bg-background">
        <HomeNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-3xl font-bold text-secondary mb-4">Agent Not Found</h1>
          <p className="text-foreground/70 mb-6">The agent you're looking for doesn't exist.</p>
          <Link href="/agents">
            <Button>Back to Agents</Button>
          </Link>
        </div>
        <HomeFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <HomeNav />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary/10 via-background to-secondary/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/agents" className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Agents
          </Link>
        </div>
      </section>

      {/* Agent Details */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
          {/* Agent Header */}
          <div className="flex flex-col md:flex-row gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="md:w-1/3"
            >
              <div className="relative h-80 w-full rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={agent.image || "/placeholder.svg"}
                  alt={agent.name}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="md:w-2/3 space-y-6">
              <div>
                <h1 className="text-5xl font-serif font-bold text-secondary mb-2">{agent.name}</h1>
                <p className="text-xl text-secondary font-semibold">{agent.title}</p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-secondary">{agent.rating}</span>
                  <span className="text-sm text-foreground/60">({agent.reviews} reviews)</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-secondary" />
                  <span className="text-foreground/70">{agent.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-secondary" />
                  <a href={`tel:${agent.phone}`} className="text-secondary hover:underline">{agent.phone}</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-secondary" />
                  <a href={`mailto:${agent.email}`} className="text-secondary hover:underline">{agent.email}</a>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-secondary hover:bg-secondary/90 text-white gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Contact Agent
                </Button>
                <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                  <Calendar className="w-4 h-4" />
                  Schedule Call
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Properties Sold', value: agent.propertiesSold },
              { label: 'Years Experience', value: `${agent.yearsExperience}+` },
              { label: 'Recent Listings', value: agent.recentListings },
            ].map((stat) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="bg-background border border-border rounded-lg p-6 text-center">
                <p className="text-3xl font-bold text-secondary mb-2">{stat.value}</p>
                <p className="text-sm text-foreground/60">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Bio */}
          <Card className="p-8 space-y-4">
            <h2 className="text-2xl font-bold text-secondary">About</h2>
            <p className="text-foreground/70 leading-relaxed">{agent.bio}</p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div>
                <h3 className="font-semibold text-secondary mb-3">Specialization</h3>
                <p className="text-foreground/70">{agent.specialization}</p>
              </div>
              <div>
                <h3 className="font-semibold text-secondary mb-3">Languages</h3>
                <p className="text-foreground/70">{agent.languages.join(', ')}</p>
              </div>
            </div>
          </Card>

          {/* Ratings */}
          <Card className="p-8 space-y-6">
            <h2 className="text-2xl font-bold text-secondary">Client Ratings</h2>
            <div className="space-y-4">
              {agent.topRatings.map((rating) => (
                <div key={rating.label} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">{rating.label}</span>
                    <span className="text-secondary font-bold">{rating.score}/5.0</span>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(rating.score / 5) * 100}%` }}
                      className="h-full bg-secondary"
                      transition={{ duration: 0.5, delay: 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </section>

      <HomeFooter />
    </div>
  )
}
