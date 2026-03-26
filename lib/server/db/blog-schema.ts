import { getDbClient } from '@/lib/server/db/client'

const BLOG_COLUMNS = [
  { name: 'id', sql: `ALTER TABLE blogs ADD COLUMN id TEXT PRIMARY KEY` },
  { name: 'slug', sql: `ALTER TABLE blogs ADD COLUMN slug TEXT UNIQUE` },
  { name: 'title', sql: `ALTER TABLE blogs ADD COLUMN title TEXT NOT NULL DEFAULT ''` },
  { name: 'excerpt', sql: `ALTER TABLE blogs ADD COLUMN excerpt TEXT NOT NULL DEFAULT ''` },
  { name: 'content', sql: `ALTER TABLE blogs ADD COLUMN content TEXT NOT NULL DEFAULT ''` },
  { name: 'image', sql: `ALTER TABLE blogs ADD COLUMN image TEXT NOT NULL DEFAULT ''` },
  { name: 'category', sql: `ALTER TABLE blogs ADD COLUMN category TEXT NOT NULL DEFAULT ''` },
  { name: 'author_id', sql: `ALTER TABLE blogs ADD COLUMN author_id TEXT NOT NULL DEFAULT ''` },
  { name: 'status', sql: `ALTER TABLE blogs ADD COLUMN status TEXT NOT NULL DEFAULT 'draft'` },
  { name: 'featured', sql: `ALTER TABLE blogs ADD COLUMN featured INTEGER NOT NULL DEFAULT 0` },
  { name: 'views', sql: `ALTER TABLE blogs ADD COLUMN views INTEGER NOT NULL DEFAULT 0` },
  { name: 'comments_count', sql: `ALTER TABLE blogs ADD COLUMN comments_count INTEGER NOT NULL DEFAULT 0` },
  { name: 'created_at', sql: `ALTER TABLE blogs ADD COLUMN created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP` },
  { name: 'updated_at', sql: `ALTER TABLE blogs ADD COLUMN updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP` },
] as const

const BLOG_COMMENT_COLUMNS = [
  { name: 'id', sql: `ALTER TABLE blog_comments ADD COLUMN id TEXT PRIMARY KEY` },
  { name: 'blog_id', sql: `ALTER TABLE blog_comments ADD COLUMN blog_id TEXT NOT NULL DEFAULT ''` },
  { name: 'user_id', sql: `ALTER TABLE blog_comments ADD COLUMN user_id TEXT NOT NULL DEFAULT ''` },
  { name: 'content', sql: `ALTER TABLE blog_comments ADD COLUMN content TEXT NOT NULL DEFAULT ''` },
  { name: 'created_at', sql: `ALTER TABLE blog_comments ADD COLUMN created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP` },
  { name: 'updated_at', sql: `ALTER TABLE blog_comments ADD COLUMN updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP` },
] as const

export async function ensureBlogsTableSchema() {
  const db = getDbClient()

  // Create table if not exists
  await db.execute(`
    CREATE TABLE IF NOT EXISTS blogs (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      image TEXT NOT NULL,
      category TEXT NOT NULL,
      author_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
      featured INTEGER NOT NULL DEFAULT 0,
      views INTEGER NOT NULL DEFAULT 0,
      comments_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  const result = await db.execute(`PRAGMA table_info(blogs)`)
  const existingColumns = new Set(result.rows.map((row: any) => String(row.name)))


  for (const column of BLOG_COLUMNS) {
    if (!existingColumns.has(column.name)) {
      await db.execute(column.sql)
    }
  }

  await db.execute(`CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug)`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status)`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_blogs_author_id ON blogs(author_id)`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category)`)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS blog_comments (
      id TEXT PRIMARY KEY,
      blog_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  const commentResult = await db.execute(`PRAGMA table_info(blog_comments)`)
  const existingCommentColumns = new Set(commentResult.rows.map((row: any) => String(row.name)))

  for (const column of BLOG_COMMENT_COLUMNS) {
    if (!existingCommentColumns.has(column.name)) {
      await db.execute(column.sql)
    }
  }

  await db.execute(`CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_id ON blog_comments(blog_id)`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_blog_comments_user_id ON blog_comments(user_id)`)
}
