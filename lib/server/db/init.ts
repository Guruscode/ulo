import { getDbClient } from '@/lib/server/db/client'
import { seedPropertiesIfNeeded } from '@/lib/server/properties/service'

let initialized = false
let initializationPromise: Promise<void> | null = null

const USER_COLUMNS = [
  { name: 'id', sql: `ALTER TABLE users ADD COLUMN id TEXT` },
  { name: 'name', sql: `ALTER TABLE users ADD COLUMN name TEXT NOT NULL DEFAULT ''` },
  { name: 'email', sql: `ALTER TABLE users ADD COLUMN email TEXT NOT NULL DEFAULT ''` },
  { name: 'phone', sql: `ALTER TABLE users ADD COLUMN phone TEXT` },
  { name: 'password_hash', sql: `ALTER TABLE users ADD COLUMN password_hash TEXT NOT NULL DEFAULT ''` },
  { name: 'role', sql: `ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'))` },
  { name: 'is_active', sql: `ALTER TABLE users ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1` },
  { name: 'timezone', sql: `ALTER TABLE users ADD COLUMN timezone TEXT NOT NULL DEFAULT 'Africa/Lagos'` },
  { name: 'email_notifications', sql: `ALTER TABLE users ADD COLUMN email_notifications INTEGER NOT NULL DEFAULT 1` },
  { name: 'push_notifications', sql: `ALTER TABLE users ADD COLUMN push_notifications INTEGER NOT NULL DEFAULT 0` },
  { name: 'two_factor_enabled', sql: `ALTER TABLE users ADD COLUMN two_factor_enabled INTEGER NOT NULL DEFAULT 0` },
  { name: 'created_at', sql: `ALTER TABLE users ADD COLUMN created_at TEXT` },
  { name: 'updated_at', sql: `ALTER TABLE users ADD COLUMN updated_at TEXT` },
  { name: 'last_login_at', sql: `ALTER TABLE users ADD COLUMN last_login_at TEXT` },
] as const

const PROPERTY_COLUMNS = [
  { name: 'id', sql: `ALTER TABLE properties ADD COLUMN id TEXT` },
  { name: 'title', sql: `ALTER TABLE properties ADD COLUMN title TEXT NOT NULL DEFAULT ''` },
  { name: 'location', sql: `ALTER TABLE properties ADD COLUMN location TEXT NOT NULL DEFAULT ''` },
  { name: 'full_address', sql: `ALTER TABLE properties ADD COLUMN full_address TEXT NOT NULL DEFAULT ''` },
  { name: 'estate', sql: `ALTER TABLE properties ADD COLUMN estate TEXT` },
  { name: 'latitude', sql: `ALTER TABLE properties ADD COLUMN latitude REAL` },
  { name: 'longitude', sql: `ALTER TABLE properties ADD COLUMN longitude REAL` },
  { name: 'price_value', sql: `ALTER TABLE properties ADD COLUMN price_value INTEGER NOT NULL DEFAULT 0` },
  { name: 'currency', sql: `ALTER TABLE properties ADD COLUMN currency TEXT NOT NULL DEFAULT 'NGN'` },
  { name: 'pricing_period', sql: `ALTER TABLE properties ADD COLUMN pricing_period TEXT NOT NULL DEFAULT 'one-time'` },
  { name: 'type', sql: `ALTER TABLE properties ADD COLUMN type TEXT NOT NULL DEFAULT 'For Sale'` },
  { name: 'listed_by', sql: `ALTER TABLE properties ADD COLUMN listed_by TEXT NOT NULL DEFAULT 'Agent'` },
  { name: 'bedrooms', sql: `ALTER TABLE properties ADD COLUMN bedrooms INTEGER NOT NULL DEFAULT 0` },
  { name: 'bathrooms', sql: `ALTER TABLE properties ADD COLUMN bathrooms REAL NOT NULL DEFAULT 0` },
  { name: 'sqft', sql: `ALTER TABLE properties ADD COLUMN sqft INTEGER NOT NULL DEFAULT 0` },
  { name: 'year_built', sql: `ALTER TABLE properties ADD COLUMN year_built INTEGER` },
  { name: 'features_json', sql: `ALTER TABLE properties ADD COLUMN features_json TEXT NOT NULL DEFAULT '[]'` },
  { name: 'image_urls_json', sql: `ALTER TABLE properties ADD COLUMN image_urls_json TEXT NOT NULL DEFAULT '[]'` },
  { name: 'video_url', sql: `ALTER TABLE properties ADD COLUMN video_url TEXT` },
  { name: 'reference_code', sql: `ALTER TABLE properties ADD COLUMN reference_code TEXT NOT NULL DEFAULT ''` },
  { name: 'document_info', sql: `ALTER TABLE properties ADD COLUMN document_info TEXT` },
  { name: 'contact_name', sql: `ALTER TABLE properties ADD COLUMN contact_name TEXT NOT NULL DEFAULT ''` },
  { name: 'contact_phone', sql: `ALTER TABLE properties ADD COLUMN contact_phone TEXT NOT NULL DEFAULT ''` },
  { name: 'contact_email', sql: `ALTER TABLE properties ADD COLUMN contact_email TEXT NOT NULL DEFAULT ''` },
  { name: 'verification_status', sql: `ALTER TABLE properties ADD COLUMN verification_status TEXT NOT NULL DEFAULT 'not_requested'` },
  { name: 'approval_status', sql: `ALTER TABLE properties ADD COLUMN approval_status TEXT NOT NULL DEFAULT 'pending_review'` },
  { name: 'status', sql: `ALTER TABLE properties ADD COLUMN status TEXT NOT NULL DEFAULT 'active'` },
  { name: 'disclaimer_accepted', sql: `ALTER TABLE properties ADD COLUMN disclaimer_accepted INTEGER NOT NULL DEFAULT 0` },
  { name: 'description', sql: `ALTER TABLE properties ADD COLUMN description TEXT NOT NULL DEFAULT ''` },
  { name: 'featured', sql: `ALTER TABLE properties ADD COLUMN featured INTEGER NOT NULL DEFAULT 0` },
  { name: 'created_by_user_id', sql: `ALTER TABLE properties ADD COLUMN created_by_user_id TEXT NOT NULL DEFAULT ''` },
  { name: 'approved_by_user_id', sql: `ALTER TABLE properties ADD COLUMN approved_by_user_id TEXT` },
  { name: 'approved_at', sql: `ALTER TABLE properties ADD COLUMN approved_at TEXT` },
  { name: 'rejection_reason', sql: `ALTER TABLE properties ADD COLUMN rejection_reason TEXT` },
  { name: 'created_at', sql: `ALTER TABLE properties ADD COLUMN created_at TEXT` },
  { name: 'updated_at', sql: `ALTER TABLE properties ADD COLUMN updated_at TEXT` },
] as const

async function ensureUsersTableSchema() {
  const db = getDbClient()
  const result = await db.execute(`PRAGMA table_info(users)`)
  const existingColumns = new Set(result.rows.map((row) => String(row.name)))

  for (const column of USER_COLUMNS) {
    if (!existingColumns.has(column.name)) {
      await db.execute(column.sql)
    }
  }

  await db.execute(`
    UPDATE users
    SET
      password_hash = COALESCE(NULLIF(password_hash, ''), hashed_password, ''),
      role = COALESCE(role, 'user'),
      is_active = COALESCE(is_active, 1),
      timezone = COALESCE(timezone, 'Africa/Lagos'),
      email_notifications = COALESCE(email_notifications, 1),
      push_notifications = COALESCE(push_notifications, 0),
      two_factor_enabled = COALESCE(two_factor_enabled, 0),
      created_at = COALESCE(created_at, CURRENT_TIMESTAMP),
      updated_at = COALESCE(updated_at, created_at, CURRENT_TIMESTAMP)
  `)

  await db.execute(`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);`)
}

async function ensurePropertiesTableSchema() {
  const db = getDbClient()
  const result = await db.execute(`PRAGMA table_info(properties)`)
  const existingColumns = new Set(result.rows.map((row) => String(row.name)))

  for (const column of PROPERTY_COLUMNS) {
    if (!existingColumns.has(column.name)) {
      await db.execute(column.sql)
    }
  }

  await db.execute(`
    UPDATE properties
    SET
      features_json = COALESCE(NULLIF(features_json, ''), '[]'),
      image_urls_json = COALESCE(NULLIF(image_urls_json, ''), '[]'),
      disclaimer_accepted = COALESCE(disclaimer_accepted, 0),
      featured = COALESCE(featured, 0),
      verification_status = COALESCE(verification_status, 'not_requested'),
      approval_status = COALESCE(approval_status, 'pending_review'),
      status = COALESCE(status, 'active'),
      created_at = COALESCE(created_at, CURRENT_TIMESTAMP),
      updated_at = COALESCE(updated_at, created_at, CURRENT_TIMESTAMP)
  `)

  await db.execute(`CREATE UNIQUE INDEX IF NOT EXISTS idx_properties_reference_code ON properties(reference_code);`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_properties_approval_status ON properties(approval_status);`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_properties_created_by_user_id ON properties(created_by_user_id);`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);`)
}

export async function initializeDatabase() {
  if (initialized) {
    return
  }

  if (initializationPromise) {
    return initializationPromise
  }

  initializationPromise = (async () => {
    const db = getDbClient()

    await db.batch(
      [
        `
          CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL CHECK (role IN ('user', 'admin')),
            is_active INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            last_login_at TEXT
          );
        `,
        `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`,
        `CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);`,
        `
          CREATE TABLE IF NOT EXISTS properties (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            location TEXT NOT NULL,
            full_address TEXT NOT NULL,
            estate TEXT,
            latitude REAL,
            longitude REAL,
            price_value INTEGER NOT NULL,
            currency TEXT NOT NULL CHECK (currency IN ('USD', 'NGN')),
            pricing_period TEXT NOT NULL CHECK (pricing_period IN ('one-time', 'month', 'week', 'day')),
            type TEXT NOT NULL CHECK (type IN ('For Sale', 'For Rent', 'Commercial', 'Land', 'Shortlet')),
            listed_by TEXT NOT NULL CHECK (listed_by IN ('Agent', 'Landlord', 'Dealer', 'Owner')),
            bedrooms INTEGER NOT NULL DEFAULT 0,
            bathrooms REAL NOT NULL DEFAULT 0,
            sqft INTEGER NOT NULL DEFAULT 0,
            year_built INTEGER,
            features_json TEXT NOT NULL DEFAULT '[]',
            image_urls_json TEXT NOT NULL DEFAULT '[]',
            video_url TEXT,
            reference_code TEXT NOT NULL UNIQUE,
            document_info TEXT,
            contact_name TEXT NOT NULL,
            contact_phone TEXT NOT NULL,
            contact_email TEXT NOT NULL,
            verification_status TEXT NOT NULL DEFAULT 'not_requested' CHECK (verification_status IN ('not_requested', 'requested', 'verified')),
            approval_status TEXT NOT NULL DEFAULT 'pending_review' CHECK (approval_status IN ('draft', 'pending_review', 'approved', 'rejected')),
            status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'pending')),
            disclaimer_accepted INTEGER NOT NULL DEFAULT 0,
            description TEXT NOT NULL,
            featured INTEGER NOT NULL DEFAULT 0,
            created_by_user_id TEXT NOT NULL,
            approved_by_user_id TEXT,
            approved_at TEXT,
            rejection_reason TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `,
      ].map((sql) => ({ sql })),
      'write'
    )

    await ensureUsersTableSchema()
    await ensurePropertiesTableSchema()

    initialized = true
    await seedPropertiesIfNeeded()
  })()

  try {
    await initializationPromise
  } finally {
    initializationPromise = null
  }
}
