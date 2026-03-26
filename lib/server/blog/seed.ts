import { getDbClient } from '../db/client'
import { seededBlogs } from './seed-data'
import type { BlogUpsertInput } from './types'
import { createBlogRecord } from './repository'


export async function seedBlogsIfNeeded() {
  const db = getDbClient()
  
  const countResult = await db.execute('SELECT COUNT(*) as count FROM blogs')
  const currentCount = Number(countResult.rows[0].count)

  if (currentCount > 0) {
    console.log('[DB] Blogs already seeded (count:', currentCount, ')')
    return
  }

  console.log('[DB] Seeding blogs...')
  
  for (const blogInput of seededBlogs) {
    try {
      const id = await createBlogRecord(blogInput)
      console.log('[DB] Seeded blog:', blogInput.title, id)
    } catch (error) {
      console.error('[DB] Failed to seed blog', blogInput.title, error)
    }
  }

  console.log('[DB] Blogs seeding complete')
}

