'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import HomeNav from '@/components/home/home-nav'
import HomeFooter from '@/components/home/home-footer'
import { MapPin, Search, UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

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
  },
]

export default function AgentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSpecialization, setFilterSpecialization] = useState('All')

  const specializations = ['All', ...new Set(agents.map((a) => a.specialization))]

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialization = filterSpecialization === 'All' || agent.specialization === filterSpecialization
    return matchesSearch && matchesSpecialization
  })

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
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-secondary">Meet Our Agents</h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Connect with experienced real estate professionals dedicated to finding your perfect property
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="w-full md:w-80 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
              <Input
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 rounded-lg"
              />
            </div>
            
            {/* Register as Agent CTA */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-secondary hover:bg-secondary/90 text-white rounded-lg">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register as Agent
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-[500px]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-2xl font-serif">Register as an Agent</AlertDialogTitle>
                  <AlertDialogDescription className="text-base">
                    Join our team of expert real estate agents and help clients find their dream properties across Nigeria.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input placeholder="Enter your full name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input type="email" placeholder="Enter your email" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input type="tel" placeholder="Enter your phone number" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Specialization</label>
                    <select className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm">
                      <option value="">Select your specialization</option>
                      <option value="residential">Residential Properties</option>
                      <option value="commercial">Commercial Real Estate</option>
                      <option value="land">Land & Development</option>
                      <option value="rental">Rental Properties</option>
                      <option value="investment">Investment Properties</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Years of Experience</label>
                    <select className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm">
                      <option value="">Select experience level</option>
                      <option value="0-1">0-1 years</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5+">5+ years</option>
                    </select>
                  </div>
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                  <AlertDialogAction className="w-full sm:w-auto bg-secondary hover:bg-secondary/90">
                    Submit Application
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="flex flex-wrap gap-2">
            {specializations.map((spec) => (
              <Button
                key={spec}
                variant={filterSpecialization === spec ? 'default' : 'outline'}
                onClick={() => setFilterSpecialization(spec)}
                className={`rounded-full ${
                  filterSpecialization === spec ? 'bg-secondary text-white' : ''
                }`}
              >
                {spec}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAgents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Agent Image */}
                <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-secondary/10 to-secondary/5">
                  <img
                    src={agent.image || "/placeholder.svg"}
                    alt={agent.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Agent Info */}
                <div className="p-4 flex flex-col space-y-2">
                  <div>
                    <h3 className="font-semibold text-secondary">{agent.name}</h3>
                    <p className="text-xs text-foreground/60">{agent.title}</p>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-xs text-foreground/70">
                    <MapPin className="w-3 h-3 text-secondary" />
                    {agent.location}
                  </div>

                  {/* CTA - Contact Agent */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="w-full bg-secondary hover:bg-secondary/90 text-white text-sm mt-2">
                        Contact Agent
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="sm:max-w-[400px]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Sign In Required</AlertDialogTitle>
                        <AlertDialogDescription>
                          Please sign in to contact this agent and access their services.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                        <Link href="/login" className="w-full sm:w-auto">
                          <AlertDialogAction className="w-full bg-secondary hover:bg-secondary/90">
                            Sign In
                          </AlertDialogAction>
                        </Link>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-foreground/60">No agents found matching your criteria.</p>
          </div>
        )}
      </section>

      <HomeFooter />
    </div>
  )
}
