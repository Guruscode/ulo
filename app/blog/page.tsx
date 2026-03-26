'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar, Search, User } from 'lucide-react'

import HomeFooter from '@/components/home/home-footer'
import HomeNav from '@/components/home/home-nav'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ApiClientError } from '@/lib/client/api-error'
import { listBlogsRequest } from '@/lib/client/blog-client'
import type { BlogRecord } from '@/lib/server/blog/types'

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const response = await listBlogsRequest({ status: 'published', limit: 50 })
        setBlogs(response.blogs)
      } catch (loadError) {
        setError(loadError instanceof ApiClientError ? loadError.message : 'Unable to load blog posts.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadBlogs()
  }, [])

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(blogs.map((blog) => blog.category))).sort((a, b) => a.localeCompare(b))],
    [blogs]
  )

  const filteredBlogs = useMemo(
    () =>
      blogs.filter((blog) => {
        const matchesSearch =
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.authorName.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory
        return matchesSearch && matchesCategory
      }),
    [blogs, searchTerm, selectedCategory]
  )

  return (
    <>
      <HomeNav />
      <div className="pt-20">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 text-balance">Insights & Resources</h1>
          <p className="text-xl text-foreground/70 max-w-2xl text-balance leading-relaxed">
            Market analysis, buying guides, and property updates managed directly by the ULO admin team.
          </p>
        </section>

        <section className="bg-white border-y border-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

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
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {isLoading ? <Card className="p-10 text-center">Loading blog posts...</Card> : null}
          {error ? <Card className="p-10 text-center text-red-600">{error}</Card> : null}
          {!isLoading && !error && filteredBlogs.length === 0 ? (
            <Card className="p-10 text-center text-foreground/70">No articles found for your current filters.</Card>
          ) : null}

          {!isLoading && !error && filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
                <Card key={blog.id} className="overflow-hidden h-full flex flex-col bg-white hover:shadow-xl transition-shadow">
                  <div className="relative h-52 bg-slate-100">
                    <Image src={blog.image} alt={blog.title} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 100vw" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-primary">
                        {blog.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-lg font-bold text-foreground mb-3 line-clamp-2">{blog.title}</h2>
                    <p className="text-foreground/70 text-sm mb-4 line-clamp-3 flex-1">{blog.excerpt}</p>

                    <div className="space-y-3 pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-xs text-foreground/60">
                        <User className="w-4 h-4" />
                        <span>{blog.authorName}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-foreground/60">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span>{blog.commentsCount} comments</span>
                      </div>
                    </div>

                    <Link href={`/blog/${blog.slug}`} className="mt-4">
                      <Button variant="outline" size="sm" className="w-full border-primary text-primary hover:bg-primary/5 bg-transparent">
                        Read More <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : null}
        </section>

        <HomeFooter />
      </div>
    </>
  )
}
