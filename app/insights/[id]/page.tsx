'use client'

import { use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import HomeNav from '@/components/home/home-nav'
import HomeFooter from '@/components/home/home-footer'
import { Calendar, Clock, User, ArrowLeft, Share2, ThumbsUp, MessageCircle } from 'lucide-react'
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
    content: `
      <p>The Nigerian real estate market has witnessed unprecedented growth in recent years. With increasing urbanization and population growth, the demand for quality housing and commercial properties continues to rise exponentially.</p>

      <h3>Market Overview</h3>
      <p>2024 marks a pivotal year for real estate investment in Nigeria. Lagos continues to dominate with a 45% share of national transactions, while emerging cities like Abuja and Port Harcourt show promising growth patterns. The sector is projected to grow by 12-15% year-over-year.</p>

      <h3>Key Growth Areas</h3>
      <ul>
        <li><strong>Residential Properties:</strong> High demand for premium and mid-range housing</li>
        <li><strong>Commercial Spaces:</strong> Growing office and retail demand from corporate entities</li>
        <li><strong>Mixed-Use Developments:</strong> Integration of residential, commercial, and recreational spaces</li>
        <li><strong>Affordable Housing:</strong> Government initiatives driving affordable housing projects</li>
      </ul>

      <h3>Investment Opportunities</h3>
      <p>For investors looking to capitalize on this growth, several opportunities present themselves:</p>
      <ul>
        <li>Buy and hold strategies in emerging neighborhoods</li>
        <li>Development partnerships with experienced developers</li>
        <li>Rental properties in high-demand areas</li>
        <li>Commercial real estate in business districts</li>
      </ul>

      <h3>Challenges and Solutions</h3>
      <p>While opportunities abound, investors must be aware of challenges such as regulatory complexities, financing constraints, and market volatility. Working with experienced real estate professionals can help navigate these obstacles effectively.</p>

      <h3>Future Outlook</h3>
      <p>The future of Nigerian real estate looks bright. With favorable demographic trends, increasing foreign investment, and government support for real estate development, 2024 and beyond present exceptional opportunities for both seasoned and first-time investors.</p>
    `,
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
    content: `
      <p>Real estate investment can be one of the most rewarding ways to build wealth. However, success requires strategy, patience, and knowledge. Here are proven methods to maximize your returns.</p>

      <h3>1. Location Intelligence</h3>
      <p>The most critical factor in real estate investment is location. Research neighborhoods with strong fundamentals: growing employment, excellent schools, low crime rates, and upcoming infrastructure projects. Emerging areas often offer better appreciation potential.</p>

      <h3>2. Portfolio Diversification</h3>
      <p>Don't put all your capital in one property. Diversify across different property types (residential, commercial, mixed-use) and locations to spread risk and maximize potential returns.</p>

      <h3>3. Smart Financing</h3>
      <p>Understanding financing options is crucial. Consider:</p>
      <ul>
        <li>Traditional mortgages with favorable interest rates</li>
        <li>Partnership financing for larger projects</li>
        <li>Leverage to amplify returns</li>
      </ul>

      <h3>4. Property Management Excellence</h3>
      <p>Well-managed properties generate consistent returns. Whether managing yourself or hiring professionals, focus on tenant quality, maintenance, and rent optimization.</p>

      <h3>5. Value-Add Strategies</h3>
      <p>Increase property value through strategic improvements:</p>
      <ul>
        <li>Renovations and upgrades</li>
        <li>Improved marketing and leasing</li>
        <li>Operational efficiencies</li>
        <li>Amenities enhancement</li>
      </ul>

      <h3>6. Market Timing</h3>
      <p>While timing the market perfectly is impossible, understanding market cycles helps. Buy when prices are undervalued and sell when appreciation is strong.</p>

      <h3>Conclusion</h3>
      <p>Maximizing real estate returns is a combination of smart analysis, strategic planning, and consistent execution. Partner with experienced professionals and stay informed about market trends to achieve your investment goals.</p>
    `,
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
    content: `
      <p>Buying your first home is an exciting milestone. To make the process smooth, here's everything you need to know.</p>

      <h3>Step 1: Assess Your Financial Situation</h3>
      <p>Before starting your search, understand your budget. Calculate how much you can afford considering down payment, monthly mortgage, taxes, and insurance.</p>

      <h3>Step 2: Get Pre-Approved for a Mortgage</h3>
      <p>Work with lenders to get pre-approved. This shows sellers you're serious and helps you negotiate effectively.</p>

      <h3>Step 3: Find the Right Property</h3>
      <p>Look for properties that fit your needs and budget. Consider:</p>
      <ul>
        <li>Location and neighborhood amenities</li>
        <li>Property condition and age</li>
        <li>Future appreciation potential</li>
        <li>Proximity to work and schools</li>
      </ul>

      <h3>Step 4: Make an Offer</h3>
      <p>Work with a real estate agent to submit a competitive offer. Be prepared to negotiate on price and terms.</p>

      <h3>Step 5: Home Inspection and Appraisal</h3>
      <p>Hire an inspector to examine the property thoroughly. Request an appraisal to ensure the property's value matches the purchase price.</p>

      <h3>Step 6: Finalize Financing</h3>
      <p>Complete your mortgage application and ensure all financing is in place before closing.</p>

      <h3>Step 7: Close the Deal</h3>
      <p>Review all closing documents, verify your loan terms, and sign the necessary paperwork.</p>

      <h3>Key Tips for Success</h3>
      <ul>
        <li>Don't make major purchases before closing</li>
        <li>Have your finances in order</li>
        <li>Hire a trusted real estate agent</li>
        <li>Conduct thorough due diligence</li>
        <li>Don't skip the home inspection</li>
      </ul>
    `,
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
    content: `
      <p>Lagos is Nigeria's economic hub, attracting young professionals from across the country. If you're relocating or looking for a new neighborhood, here are the top choices.</p>

      <h3>1. Victoria Island (VI)</h3>
      <p>Lagos's prime business district, VI offers upscale living, premium restaurants, and excellent nightlife. Perfect for professionals seeking vibrant urban living.</p>

      <h3>2. Ikoyi</h3>
      <p>Adjacent to VI, Ikoyi combines luxury with tranquility. Known for beautiful waterfront properties and exclusive communities, ideal for those seeking sophistication.</p>

      <h3>3. Lekki</h3>
      <p>Rapidly developing with modern amenities, quality restaurants, and entertainment options. Great for professionals seeking a perfect balance of urban conveniences and relaxation.</p>

      <h3>4. Yaba</h3>
      <p>Emerging as a tech and creative hub, Yaba offers affordable housing, vibrant nightlife, and a young, energetic community perfect for young professionals.</p>

      <h3>5. Surulere</h3>
      <p>Centrally located with good connectivity to major business districts. Offers more affordable options without compromising on amenities and accessibility.</p>

      <h3>Considerations</h3>
      <p>When choosing a neighborhood, consider:</p>
      <ul>
        <li>Commute time to your workplace</li>
        <li>Neighborhood safety and security</li>
        <li>Available amenities and entertainment</li>
        <li>Cost of living and property prices</li>
        <li>Community and social scene</li>
      </ul>
    `,
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
    content: `
      <p>As climate change concerns grow, the real estate industry is embracing sustainable housing solutions. Africa is leading this transformation.</p>

      <h3>The Sustainability Imperative</h3>
      <p>With rapid urbanization and environmental challenges, sustainable housing is no longer optional—it's essential. Green buildings reduce environmental impact while lowering operational costs.</p>

      <h3>Key Sustainable Features</h3>
      <ul>
        <li>Solar energy systems for power generation</li>
        <li>Water harvesting and recycling systems</li>
        <li>Energy-efficient building materials</li>
        <li>Proper waste management systems</li>
        <li>Green spaces and landscaping</li>
      </ul>

      <h3>Benefits of Sustainable Housing</h3>
      <ul>
        <li><strong>Cost Savings:</strong> Lower energy and water bills</li>
        <li><strong>Health Benefits:</strong> Improved air quality and natural lighting</li>
        <li><strong>Property Value:</strong> Increased resale value and market appeal</li>
        <li><strong>Environmental Impact:</strong> Reduced carbon footprint</li>
      </ul>

      <h3>African Innovation</h3>
      <p>African developers are leading the charge with innovative sustainable projects addressing local needs while maintaining affordability.</p>

      <h3>The Future</h3>
      <p>Expect to see more sustainable housing projects across Africa. Investors and developers embracing green building practices will capture growing demand from environmentally conscious homeowners.</p>
    `,
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
    content: `
      <p>Commercial real estate offers unique opportunities for investors seeking diversification and higher returns. Here's what beginners need to know.</p>

      <h3>Types of Commercial Properties</h3>
      <ul>
        <li><strong>Office Buildings:</strong> Corporate spaces for rent</li>
        <li><strong>Retail Spaces:</strong> Storefronts and shopping centers</li>
        <li><strong>Industrial Properties:</strong> Warehouses and manufacturing facilities</li>
        <li><strong>Mixed-Use Properties:</strong> Combination of residential and commercial</li>
      </ul>

      <h3>Advantages of Commercial Investing</h3>
      <ul>
        <li>Higher rental income potential</li>
        <li>Longer lease terms (3-10 years)</li>
        <li>Professional tenants with stable income</li>
        <li>Tax benefits and depreciation advantages</li>
        <li>Strong appreciation potential</li>
      </ul>

      <h3>Getting Started</h3>
      <p>Follow these steps:</p>
      <ul>
        <li>1. Research the commercial market in your area</li>
        <li>2. Understand commercial lending and financing</li>
        <li>3. Analyze cash flow and ROI carefully</li>
        <li>4. Hire experienced commercial real estate agents</li>
        <li>5. Start with smaller properties to learn</li>
      </ul>

      <h3>Key Metrics</h3>
      <p>Understand these important metrics:</p>
      <ul>
        <li><strong>NOI:</strong> Net Operating Income</li>
        <li><strong>Cap Rate:</strong> Capitalization Rate</li>
        <li><strong>Occupancy Rate:</strong> Percentage of rented space</li>
        <li><strong>Tenant Quality:</strong> Financial stability of tenants</li>
      </ul>

      <h3>Risks to Consider</h3>
      <p>Commercial investing carries risks including economic downturns, tenant turnover, and market saturation. Proper analysis and professional guidance are essential.</p>
    `,
  },
]

export default function InsightDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const insight = insights.find((i) => i.id === Number(id))

  if (!insight) {
    return (
      <div className="min-h-screen bg-background">
        <HomeNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-3xl font-bold text-secondary mb-4">Article Not Found</h1>
          <p className="text-foreground/70 mb-6">The article you're looking for doesn't exist.</p>
          <Link href="/insights">
            <Button>Back to Insights</Button>
          </Link>
        </div>
        <HomeFooter />
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-background">
      <HomeNav />

      {/* Hero Image */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-96 md:h-screen max-h-96 md:max-h-96 overflow-hidden">
        <Image
          src={insight.image || "/placeholder.svg"}
          alt={insight.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </motion.section>

      {/* Article Content */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Back Button */}
          <Link href="/insights" className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80">
            <ArrowLeft className="w-4 h-4" />
            Back to Insights
          </Link>

          {/* Article Meta */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 items-center">
              <span className="inline-block bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium">
                {insight.category}
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-serif font-bold text-secondary leading-tight">{insight.title}</h1>

            <div className="flex flex-wrap gap-6 text-foreground/60 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{insight.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(insight.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{insight.readTime}</span>
              </div>
            </div>
          </div>

          {/* Article Body */}
          <div className="prose prose-lg max-w-none text-foreground/80">
            <div dangerouslySetInnerHTML={{ __html: insight.content }} />
          </div>

          {/* Engagement Section */}
          <div className="pt-8 border-t border-border flex gap-4 items-center justify-between">
            <div className="flex gap-4">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <ThumbsUp className="w-4 h-4" />
                Helpful
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Related Articles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="pt-12 border-t border-border space-y-6"
          >
            <h3 className="text-2xl font-bold text-secondary">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {insights
                .filter((i) => i.id !== insight.id && i.category === insight.category)
                .slice(0, 2)
                .map((article) => (
                  <Link key={article.id} href={`/insights/${article.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <div className="relative h-48 overflow-hidden">
                        <Image src={article.image || "/placeholder.svg"} alt={article.title} fill className="object-cover hover:scale-105 transition-transform" />
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-secondary font-medium mb-2">{article.category}</p>
                        <h4 className="font-semibold text-secondary line-clamp-2">{article.title}</h4>
                        <p className="text-xs text-foreground/60 mt-2">{article.readTime}</p>
                      </div>
                    </Card>
                  </Link>
                ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      <HomeFooter />
    </div>
  )
}
