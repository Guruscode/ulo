import type { UserRole } from '@/lib/auth/types'

export type BlogStatus = 'draft' | 'published' | 'archived'

export interface BlogRecord {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  category: string
  authorId: string
  authorName: string
  authorRole: UserRole
  status: BlogStatus
  views: number
  commentsCount: number
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface BlogCommentRecord {
  id: string
  blogId: string
  userId: string
  userName: string
  userProfileImageUrl?: string | null
  content: string
  createdAt: string
  updatedAt: string
}

export interface BlogUpsertInput {
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  category: string
  authorId: string
  status: BlogStatus
  featured?: boolean
}
