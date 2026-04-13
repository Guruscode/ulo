import { z } from 'zod'

import type { AuthUser } from '@/lib/auth/types'
import { ApiError } from '@/lib/server/http/api-error'

import type { BlogCommentRecord, BlogRecord } from './types'
import {
  createBlogCommentRecord,
  createBlogRecord,
  deleteBlogCommentRecord,
  deleteBlogRecord,
  getBlogCommentRecord,
  getBlogRecord,
  getBlogRecordBySlug,
  incrementBlogViews,
  listBlogCommentRecords,
  listBlogRecords,
  updateBlogRecord,
} from './repository'

const blogUpsertSchema = z.object({
  title: z.string().trim().min(3, 'Title is required.'),
  excerpt: z.string().trim().min(10, 'Excerpt is required.'),
  content: z.string().trim().min(20, 'Content is required.'),
  image: z.string().trim().min(1, 'Image is required.'),
  category: z.string().trim().min(2, 'Category is required.'),
  status: z.enum(['draft', 'published', 'archived']),
  featured: z.boolean().optional().default(false),
})

const blogCommentSchema = z.object({
  content: z.string().trim().min(2, 'Comment is too short.').max(1000, 'Comment is too long.'),
})

function requireAdmin(actor: AuthUser) {
  if (actor.role !== 'admin') {
    throw new ApiError(403, 'FORBIDDEN', 'Admin access is required.')
  }
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function listBlogs(input: { limit?: number; offset?: number; category?: string; status?: string; search?: string } = {}) {
  return listBlogRecords(input)
}

export async function getPublishedBlogBySlug(slug: string): Promise<BlogRecord> {
  const blog = await getBlogRecordBySlug(slug)
  if (!blog || blog.status !== 'published') {
    throw new ApiError(404, 'BLOG_NOT_FOUND', 'Blog post not found.')
  }
  await incrementBlogViews(blog.id)
  return (await getBlogRecord(blog.id)) as BlogRecord
}

export async function getBlogBySlugForAdmin(actor: AuthUser, slug: string) {
  requireAdmin(actor)
  const blog = await getBlogRecordBySlug(slug)
  if (!blog) {
    throw new ApiError(404, 'BLOG_NOT_FOUND', 'Blog post not found.')
  }
  return blog
}

export async function listBlogsForAdmin(actor: AuthUser, input: { limit?: number; offset?: number; category?: string; status?: string; search?: string } = {}) {
  requireAdmin(actor)
  return listBlogRecords(input)
}

export async function createBlogForAdmin(actor: AuthUser, input: unknown) {
  requireAdmin(actor)
  const parsed = blogUpsertSchema.safeParse(input)
  if (!parsed.success) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Please correct the blog fields.', parsed.error.flatten())
  }

  const created = await createBlogRecord({
    ...parsed.data,
    slug: slugify(parsed.data.title),
    authorId: actor.id,
  })

  if (!created) {
    throw new ApiError(500, 'BLOG_CREATE_FAILED', 'Unable to create blog post.')
  }

  return created
}

export async function updateBlogForAdmin(actor: AuthUser, id: string, input: unknown) {
  requireAdmin(actor)
  const existing = await getBlogRecord(id)
  if (!existing) {
    throw new ApiError(404, 'BLOG_NOT_FOUND', 'Blog post not found.')
  }

  const parsed = blogUpsertSchema.safeParse(input)
  if (!parsed.success) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Please correct the blog fields.', parsed.error.flatten())
  }

  const updated = await updateBlogRecord(id, {
    ...parsed.data,
    slug: slugify(parsed.data.title),
  })

  if (!updated) {
    throw new ApiError(500, 'BLOG_UPDATE_FAILED', 'Unable to update blog post.')
  }

  return updated
}

export async function deleteBlogForAdmin(actor: AuthUser, id: string) {
  requireAdmin(actor)
  const existing = await getBlogRecord(id)
  if (!existing) {
    throw new ApiError(404, 'BLOG_NOT_FOUND', 'Blog post not found.')
  }
  await deleteBlogRecord(id)
}

export async function listCommentsForBlogSlug(slug: string): Promise<BlogCommentRecord[]> {
  const blog = await getBlogRecordBySlug(slug)
  if (!blog || blog.status !== 'published') {
    throw new ApiError(404, 'BLOG_NOT_FOUND', 'Blog post not found.')
  }
  return listBlogCommentRecords(blog.id)
}

export async function addCommentToBlogSlug(actor: AuthUser, slug: string, input: unknown) {
  const blog = await getBlogRecordBySlug(slug)
  if (!blog || blog.status !== 'published') {
    throw new ApiError(404, 'BLOG_NOT_FOUND', 'Blog post not found.')
  }

  const parsed = blogCommentSchema.safeParse(input)
  if (!parsed.success) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Please enter a valid comment.', parsed.error.flatten())
  }

  const comment = await createBlogCommentRecord({
    blogId: blog.id,
    userId: actor.id,
    content: parsed.data.content,
  })

  if (!comment) {
    throw new ApiError(500, 'COMMENT_CREATE_FAILED', 'Unable to save comment.')
  }

  return comment
}

export async function deleteBlogCommentForUser(actor: AuthUser, commentId: string) {
  const comment = await getBlogCommentRecord(commentId)
  if (!comment) {
    throw new ApiError(404, 'COMMENT_NOT_FOUND', 'Comment not found.')
  }
  if (actor.role !== 'admin' && comment.userId !== actor.id) {
    throw new ApiError(403, 'FORBIDDEN', 'You can only delete your own comment.')
  }
  await deleteBlogCommentRecord(commentId)
}
