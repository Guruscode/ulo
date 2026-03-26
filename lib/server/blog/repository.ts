import { randomUUID } from 'crypto'

import { initializeDatabase } from '@/lib/server/db/init'
import { getDbClient } from '@/lib/server/db/client'

import type { BlogCommentRecord, BlogRecord, BlogUpsertInput } from './types'

function mapBlogRow(row: Record<string, unknown>): BlogRecord {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    excerpt: String(row.excerpt),
    content: String(row.content),
    image: String(row.image),
    category: String(row.category),
    authorId: String(row.author_id),
    authorName: row.author_name ? String(row.author_name) : 'ULO Admin',
    authorRole: (row.author_role ? String(row.author_role) : 'admin') as BlogRecord['authorRole'],
    status: String(row.status) as BlogRecord['status'],
    views: Number(row.views || 0),
    commentsCount: Number(row.comments_count || 0),
    featured: Number(row.featured || 0) === 1,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

function mapCommentRow(row: Record<string, unknown>): BlogCommentRecord {
  return {
    id: String(row.id),
    blogId: String(row.blog_id),
    userId: String(row.user_id),
    userName: row.user_name ? String(row.user_name) : 'User',
    userProfileImageUrl: row.profile_image_url ? String(row.profile_image_url) : null,
    content: String(row.content),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

export async function createBlogRecord(input: BlogUpsertInput) {
  await initializeDatabase()
  const db = getDbClient()
  const id = randomUUID()

  await db.execute({
    sql: `
      INSERT INTO blogs (
        id, slug, title, excerpt, content, image, category, author_id, status, featured, views, comments_count, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
    args: [
      id,
      input.slug,
      input.title,
      input.excerpt,
      input.content,
      input.image,
      input.category,
      input.authorId,
      input.status,
      input.featured ? 1 : 0,
    ],
  })

  return getBlogRecord(id)
}

export async function getBlogRecord(id: string) {
  await initializeDatabase()
  const db = getDbClient()
  const result = await db.execute({
    sql: `
      SELECT b.*, u.name AS author_name, u.role AS author_role
      FROM blogs b
      LEFT JOIN users u ON b.author_id = u.id
      WHERE b.id = ?
      LIMIT 1
    `,
    args: [id],
  })

  const row = result.rows[0]
  return row ? mapBlogRow(row as Record<string, unknown>) : null
}

export async function getBlogRecordBySlug(slug: string) {
  await initializeDatabase()
  const db = getDbClient()
  const result = await db.execute({
    sql: `
      SELECT b.*, u.name AS author_name, u.role AS author_role
      FROM blogs b
      LEFT JOIN users u ON b.author_id = u.id
      WHERE b.slug = ?
      LIMIT 1
    `,
    args: [slug],
  })

  const row = result.rows[0]
  return row ? mapBlogRow(row as Record<string, unknown>) : null
}

export async function updateBlogRecord(id: string, input: Partial<BlogUpsertInput>) {
  await initializeDatabase()
  const db = getDbClient()
  const updates: string[] = []
  const args: Array<string | number> = []

  if (input.slug !== undefined) {
    updates.push('slug = ?')
    args.push(input.slug)
  }
  if (input.title !== undefined) {
    updates.push('title = ?')
    args.push(input.title)
  }
  if (input.excerpt !== undefined) {
    updates.push('excerpt = ?')
    args.push(input.excerpt)
  }
  if (input.content !== undefined) {
    updates.push('content = ?')
    args.push(input.content)
  }
  if (input.image !== undefined) {
    updates.push('image = ?')
    args.push(input.image)
  }
  if (input.category !== undefined) {
    updates.push('category = ?')
    args.push(input.category)
  }
  if (input.status !== undefined) {
    updates.push('status = ?')
    args.push(input.status)
  }
  if (input.featured !== undefined) {
    updates.push('featured = ?')
    args.push(input.featured ? 1 : 0)
  }

  if (updates.length === 0) {
    return getBlogRecord(id)
  }

  args.push(id)

  await db.execute({
    sql: `
      UPDATE blogs
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args,
  })

  return getBlogRecord(id)
}

export async function deleteBlogRecord(id: string) {
  await initializeDatabase()
  const db = getDbClient()
  await db.execute({ sql: `DELETE FROM blog_comments WHERE blog_id = ?`, args: [id] })
  await db.execute({ sql: `DELETE FROM blogs WHERE id = ?`, args: [id] })
}

export async function incrementBlogViews(id: string) {
  await initializeDatabase()
  const db = getDbClient()
  await db.execute({
    sql: `UPDATE blogs SET views = COALESCE(views, 0) + 1, updated_at = updated_at WHERE id = ?`,
    args: [id],
  })
}

export async function listBlogRecords(params: {
  limit?: number
  offset?: number
  category?: string
  status?: string
  search?: string
  featured?: boolean
}) {
  await initializeDatabase()
  const db = getDbClient()
  const conditions: string[] = []
  const args: Array<string | number> = []

  if (params.category) {
    conditions.push('b.category = ?')
    args.push(params.category)
  }
  if (params.status) {
    conditions.push('b.status = ?')
    args.push(params.status)
  }
  if (params.featured !== undefined) {
    conditions.push('b.featured = ?')
    args.push(params.featured ? 1 : 0)
  }
  if (params.search) {
    conditions.push('(LOWER(b.title) LIKE ? OR LOWER(b.excerpt) LIKE ?)')
    const q = `%${params.search.toLowerCase()}%`
    args.push(q, q)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  let sql = `
    SELECT b.*, u.name AS author_name, u.role AS author_role
    FROM blogs b
    LEFT JOIN users u ON b.author_id = u.id
    ${whereClause}
    ORDER BY b.created_at DESC
  `

  if (params.limit) {
    sql += ' LIMIT ?'
    args.push(params.limit)
  }
  if (params.offset) {
    sql += ' OFFSET ?'
    args.push(params.offset)
  }

  const result = await db.execute({ sql, args })
  return result.rows.map((row) => mapBlogRow(row as Record<string, unknown>))
}

export async function listBlogCommentRecords(blogId: string) {
  await initializeDatabase()
  const db = getDbClient()
  const result = await db.execute({
    sql: `
      SELECT c.*, u.name AS user_name, u.profile_image_url
      FROM blog_comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.blog_id = ?
      ORDER BY c.created_at DESC
    `,
    args: [blogId],
  })

  return result.rows.map((row) => mapCommentRow(row as Record<string, unknown>))
}

export async function getBlogCommentRecord(commentId: string) {
  await initializeDatabase()
  const db = getDbClient()
  const result = await db.execute({
    sql: `
      SELECT c.*, u.name AS user_name, u.profile_image_url
      FROM blog_comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
      LIMIT 1
    `,
    args: [commentId],
  })

  const row = result.rows[0]
  return row ? mapCommentRow(row as Record<string, unknown>) : null
}

export async function createBlogCommentRecord(input: { blogId: string; userId: string; content: string }) {
  await initializeDatabase()
  const db = getDbClient()
  const id = randomUUID()

  await db.execute({
    sql: `
      INSERT INTO blog_comments (id, blog_id, user_id, content, created_at, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
    args: [id, input.blogId, input.userId, input.content],
  })

  await db.execute({
    sql: `UPDATE blogs SET comments_count = COALESCE(comments_count, 0) + 1 WHERE id = ?`,
    args: [input.blogId],
  })

  return getBlogCommentRecord(id)
}

export async function deleteBlogCommentRecord(commentId: string) {
  await initializeDatabase()
  const db = getDbClient()
  const existing = await db.execute({
    sql: `SELECT blog_id FROM blog_comments WHERE id = ? LIMIT 1`,
    args: [commentId],
  })
  const row = existing.rows[0]
  if (!row) {
    return
  }

  await db.execute({ sql: `DELETE FROM blog_comments WHERE id = ?`, args: [commentId] })
  await db.execute({
    sql: `UPDATE blogs SET comments_count = CASE WHEN comments_count > 0 THEN comments_count - 1 ELSE 0 END WHERE id = ?`,
    args: [String(row.blog_id)],
  })
}
