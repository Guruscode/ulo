import type { BlogCommentRecord, BlogRecord } from '@/lib/server/blog/types'
import { apiRequest } from './api-client'

export async function listBlogsRequest(input?: {
  limit?: number
  offset?: number
  category?: string
  status?: string
  search?: string
}) {
  const params = new URLSearchParams()
  if (input?.limit) params.set('limit', input.limit.toString())
  if (input?.offset) params.set('offset', input.offset.toString())
  if (input?.category) params.set('category', input.category)
  if (input?.status) params.set('status', input.status)
  if (input?.search) params.set('search', input.search)
  const query = params.toString()
  return apiRequest<{ blogs: BlogRecord[] }>('/api/blog' + (query ? '?' + query : ''), { method: 'GET' })
}

export function getBlogRequest(slug: string) {
  return apiRequest<{ blog: BlogRecord }>('/api/blog/' + slug, { method: 'GET' })
}

export function listBlogCommentsRequest(slug: string) {
  return apiRequest<{ comments: BlogCommentRecord[] }>(`/api/blog/${slug}/comments`, { method: 'GET' })
}

export function createBlogCommentRequest(slug: string, input: { content: string }) {
  return apiRequest<{ comment: BlogCommentRecord }>(`/api/blog/${slug}/comments`, {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function deleteBlogCommentRequest(id: string) {
  return apiRequest<Record<string, never>>(`/api/blog/comments/${id}`, { method: 'DELETE' })
}
