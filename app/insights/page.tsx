'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import HomeNav from '@/components/home/home-nav'
import HomeFooter from '@/components/home/home-footer'
import { Calendar, Clock, User, ArrowRight, Search, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

const insights = [
  {
    id: 1,
    title: 'The Rise of Real Estate Investment in Nigeria: 2024 Market Trends',
    excerpt:
      'Explore the latest market trends and investment opportunities in the Nigerian real estate sector. Discover which cities are experiencing significant growth.',
    author: 'Chisom Okonkwo',
    date: '2024-02-08',
    readTime: '5 min read',
    category: 'Market Trends',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop',
  },
  {
    id: 2,
    title: 'How to Maximize Your Real Estate Investment Returns',
    excerpt:
      'Learn proven strategies to maximize ROI on your property investments. From diversification to smart financing options.',
    author: 'Amara Ibrahim',
    date: '2024-02-07',
    readTime: '7 min read',
    category: 'Investment Tips',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
  },
  {
    id: 3,
    title: 'First-Time Home Buyer\'s Guide: Everything You Need to Know',
    excerpt:
      'A comprehensive guide for first-time home buyers covering financing, negotiation, and legal considerations.',
    author: 'Tunde Adeyemi',
    date: '2024-02-06',
    readTime: '8 min read',
    category: 'Buyer Guide',
    image: 'https://images.unsplash.com/photo-1562183241-bd70da2c4bb1?w=600&h=400&fit=crop',
  },
  {
    id: 4,
    title: 'Top 5 Neighborhoods for Young Professionals in Lagos',
    excerpt:
      'Discover the most desirable neighborhoods for young professionals in Lagos with excellent amenities and connectivity.',
    author: 'Zainab Hassan',
    date: '2024-02-05',
    readTime: '6 min read',
    category: 'Location Guides',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop',
  },
  {
    id: 5,
    title: 'The Future of Sustainable Housing in Africa',
    excerpt:
      'Explore how sustainable and eco-friendly housing solutions are reshaping the real estate landscape across Africa.',
    author: 'Chidi Nwosu',
    date: '2024-02-04',
    readTime: '6 min read',
    category: 'Sustainability',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop',
  },
  {
    id: 6,
    title: 'Commercial Real Estate: A Beginner\'s Investment Strategy',
    excerpt:
      'Understanding commercial real estate fundamentals and developing a solid strategy for commercial property investments.',
    author: 'Nia Okafor',
    date: '2024-02-03',
    readTime: '7 min read',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
  },
]

const categories = ['All', ...new Set(insights.map((i) => i.category))]

export default function InsightsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredInsights = insights.filter((insight) => {
    const matchesSearch = insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insight.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || insight.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

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
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-secondary">Real Estate Insights</h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Expert articles and market analysis to help you make informed real estate decisions
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
            <Input
              placeholder="Search insights..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 rounded-lg"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full ${selectedCategory === category ? 'bg-secondary text-white' : ''}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredInsights.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-foreground/60">No insights found matching your search.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Featured Article */}
            {filteredInsights[0] && (
              <Link href={`/insights/${filteredInsights[0].id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="relative h-96 rounded-lg overflow-hidden">
                    <img
                      src={filteredInsights[0].image || "/placeholder.svg"}
                      alt={filteredInsights[0].title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex flex-col justify-center space-y-4">
                    <div className="space-y-2">
                      <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-semibold uppercase tracking-wider">
                        {filteredInsights[0].category}
                      </span>
                      <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary">
                        {filteredInsights[0].title}
                      </h2>
                      <p className="text-lg text-foreground/70">{filteredInsights[0].excerpt}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/60">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {filteredInsights[0].author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(filteredInsights[0].date)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {filteredInsights[0].readTime}
                      </div>
                    </div>

                    <Button className="w-fit bg-secondary hover:bg-secondary/90 text-white group">
                      Read Full Article
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </motion.div>
              </Link>
            )}

            {/* Articles List */}
            {filteredInsights.slice(1).map((article, index) => (
              <Link key={article.id} href={`/insights/${article.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                      <div className="md:col-span-2 flex flex-col justify-between space-y-4">
                        <div>
                          <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
                            {article.category}
                          </span>
                          <h3 className="text-xl font-semibold text-secondary mb-2">{article.title}</h3>
                          <p className="text-foreground/70">{article.excerpt}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-foreground/60">
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5" />
                            {article.author}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(article.date)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            {article.readTime}
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-1">
                        <img
                          src={article.image || "/placeholder.svg"}
                          alt={article.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                  </div>
                </Card>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="bg-secondary/5 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary">Stay Updated</h2>
            <p className="text-lg text-foreground/70">Subscribe to get weekly insights on real estate trends</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input placeholder="Enter your email" type="email" className="rounded-lg" />
            <Button className="bg-secondary hover:bg-secondary/90 text-white">Subscribe</Button>
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  )
}
