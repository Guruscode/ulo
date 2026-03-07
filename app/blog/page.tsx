'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Calendar, ArrowRight, Search, User } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const articles = [
    {
      id: 1,
      title: '10 Tips for First-Time Home Buyers',
      excerpt:
        'Learn the essential steps and strategies to make your first home purchase a success. From mortgage pre-approval to inspections, we cover it all.',
      category: 'Buying Guide',
      author: 'Sarah Johnson',
      date: '2024-01-20',
      image: 'linear-gradient(135deg, #D4A574 0%, #C89968 100%)',
      readTime: '5 min read',
    },
    {
      id: 2,
      title: 'Real Estate Market Trends: What to Expect in 2024',
      excerpt:
        'An in-depth analysis of current market conditions, interest rates, and predictions for the upcoming year. Expert insights from our market analysts.',
      category: 'Market Analysis',
      author: 'Michael Chen',
      date: '2024-01-18',
      image: 'linear-gradient(135deg, #E8B8A0 0%, #D4A574 100%)',
      readTime: '7 min read',
    },
    {
      id: 3,
      title: 'Home Staging 101: Make Your Property Shine',
      excerpt:
        'Discover how to present your home in the best light to attract potential buyers. Professional staging tips and tricks.',
      category: 'Selling Guide',
      author: 'Emma Davis',
      date: '2024-01-15',
      image: 'linear-gradient(135deg, #C89968 0%, #B08860 100%)',
      readTime: '6 min read',
    },
    {
      id: 4,
      title: 'Navigating Property Taxes: A Comprehensive Guide',
      excerpt:
        'Understand the complexities of property taxes and how they affect your investment. Essential knowledge for all property owners.',
      category: 'Finance',
      author: 'James Wilson',
      date: '2024-01-12',
      image: 'linear-gradient(135deg, #B8956A 0%, #A28560 100%)',
      readTime: '8 min read',
    },
    {
      id: 5,
      title: 'Neighborhoods to Watch: Emerging Markets',
      excerpt:
        'Explore up-and-coming neighborhoods with strong growth potential. Perfect for investors looking for hidden gems.',
      category: 'Market Analysis',
      author: 'Lisa Anderson',
      date: '2024-01-10',
      image: 'linear-gradient(135deg, #D4B5A0 0%, #C0A090 100%)',
      readTime: '6 min read',
    },
    {
      id: 6,
      title: 'Investment Properties: Building Wealth Through Real Estate',
      excerpt:
        'A strategic guide to using real estate investments as a wealth-building tool. Learn from successful investors in our community.',
      category: 'Investment',
      author: 'Robert Martinez',
      date: '2024-01-08',
      image: 'linear-gradient(135deg, #E8C4B0 0%, #D4B5A0 100%)',
      readTime: '9 min read',
    },
  ]

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const categories = ['All', 'Buying Guide', 'Selling Guide', 'Market Analysis', 'Finance', 'Investment']
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filtered = filteredArticles.filter((article) =>
    selectedCategory === 'All' ? true : article.category === selectedCategory,
  )

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-[#f9f6f3]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-lg">U</span>
            </div>
            <span className="font-bold text-lg text-foreground">Ulo</span>
          </Link>
          <div className="hidden md:flex gap-8">
            <Link href="/listings" className="text-foreground/70 hover:text-foreground transition-colors">
              Properties
            </Link>
            <Link href="/blog" className="text-foreground font-medium">
              Blog
            </Link>
            <Link href="/dashboard" className="text-foreground/70 hover:text-foreground transition-colors">
              Dashboard
            </Link>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 text-balance">
            Insights & Resources
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl text-balance leading-relaxed">
            Expert advice, market analysis, and valuable tips to guide your real estate journey.
          </p>
        </motion.div>
      </section>

      {/* Search Section */}
      <section className="bg-white border-y border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Categories */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Categories</p>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-secondary/10 text-foreground hover:bg-secondary/20'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-foreground/60">
              No articles found. Try adjusting your search or category filters.
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {filtered.map((article) => (
              <motion.div key={article.id} variants={fadeInUp}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-white">
                  <div
                    className="h-48 bg-cover bg-center relative"
                    style={{ background: article.image }}
                  >
                    <div className="absolute top-4 left-4">
                      <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-primary">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-foreground/70 text-sm mb-4 line-clamp-2 flex-1">
                      {article.excerpt}
                    </p>

                    <div className="space-y-3 pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-xs text-foreground/60">
                        <User className="w-4 h-4" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-foreground/60">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(article.date).toLocaleDateString()}</span>
                        </div>
                        <span className="text-xs font-medium text-primary">{article.readTime}</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4 border-primary text-primary hover:bg-primary/5 bg-transparent"
                    >
                      Read More <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-16 text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-white/80 mb-8 text-lg max-w-2xl mx-auto">
            Get expert insights, market updates, and exclusive tips delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input placeholder="Enter your email" className="bg-white/20 border-white/30 text-white placeholder:text-white/60" />
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              Subscribe
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12 border-t border-foreground/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Browse</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li>
                  <Link href="/listings" className="hover:text-white transition-colors">
                    Properties
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Categories
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <span className="font-bold text-lg">Ulo</span>
            </div>
            <p className="text-white/60 text-sm">© 2024 Ulo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
