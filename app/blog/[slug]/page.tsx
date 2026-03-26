import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MessageSquare, User } from 'lucide-react'
import { notFound } from 'next/navigation'

import { BlogComments } from '@/components/blog/blog-comments'
import HomeFooter from '@/components/home/home-footer'
import HomeNav from '@/components/home/home-nav'
import { Card } from '@/components/ui/card'
import { getPublishedBlogBySlug, listCommentsForBlogSlug } from '@/lib/server/blog/service'
import { ApiError } from '@/lib/server/http/api-error'

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    const [blog, comments] = await Promise.all([
      getPublishedBlogBySlug(slug),
      listCommentsForBlogSlug(slug),
    ])

    return (
      <div className="min-h-screen bg-background">
        <HomeNav />
        <div className="pt-24">
          <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Link href="/blog" className="text-secondary hover:text-secondary/80 text-sm font-medium">Back to Blog</Link>
            <div className="mt-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">{blog.category}</p>
              <h1 className="mt-3 text-4xl md:text-5xl font-bold text-foreground text-balance">{blog.title}</h1>
              <p className="mt-4 text-lg text-foreground/70">{blog.excerpt}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-foreground/60">
                <span className="inline-flex items-center gap-2"><User className="h-4 w-4" />{blog.authorName}</span>
                <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4" />{new Date(blog.createdAt).toLocaleDateString()}</span>
                <span className="inline-flex items-center gap-2"><MessageSquare className="h-4 w-4" />{blog.commentsCount} comments</span>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="relative h-[320px] overflow-hidden rounded-3xl bg-slate-100">
              <Image src={blog.image} alt={blog.title} fill className="object-cover" sizes="100vw" />
            </div>
            <Card className="mt-8 p-8">
              <div className="whitespace-pre-wrap leading-8 text-foreground/80">{blog.content}</div>
            </Card>
          </section>

          <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-20">
            <BlogComments slug={slug} initialComments={comments} initialCommentsCount={blog.commentsCount} />
          </section>
        </div>
        <HomeFooter />
      </div>
    )
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound()
    }

    throw error
  }
}
