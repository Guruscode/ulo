import type { BlogRecord } from '@/lib/server/blog/types'

import { apiRequest } from '@/lib/client/api-client'

export function listAdminBlogsRequest(input?: {
  limit?: number
  offset?: number
  category?: string
  status?: string
  search?: string
}) {
  const params = new URLSearchParams()
  if (input?.limit) params.set('limit', String(input.limit))
  if (input?.offset) params.set('offset', String(input.offset))
  if (input?.category && input.category !== 'all') params.set('category', input.category)
  if (input?.status && input.status !== 'all') params.set('status', input.status)
  if (input?.search) params.set('search', input.search)
  const query = params.toString()
  return apiRequest<{ blogs: BlogRecord[] }>(`/api/admin/blog${query ? `?${query}` : ''}`, { method: 'GET' })
}

export function createAdminBlogRequest(input: {
  title: string
  excerpt: string
  content: string
  image: string
  category: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
}) {
  return apiRequest<{ blog: BlogRecord }>('/api/admin/blog', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateAdminBlogRequest(id: string, input: {
  title: string
  excerpt: string
  content: string
  image: string
  category: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
}) {
  return apiRequest<{ blog: BlogRecord }>(`/api/admin/blog/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export function deleteAdminBlogRequest(id: string) {
  return apiRequest<Record<string, never>>(`/api/admin/blog/${id}`, { method: 'DELETE' })
}
