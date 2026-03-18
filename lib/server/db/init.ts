import { getDbClient } from '@/lib/server/db/client'
import { seedHotelsIfNeeded } from '@/lib/server/hotels/service'
import { seedPropertiesIfNeeded } from '@/lib/server/properties/service'
import { seedSubscriptionPlansIfNeeded } from '@/lib/server/subscriptions/service'

let initialized = false
let initializationPromise: Promise<void> | null = null

const USER_COLUMNS = [
  { name: 'id', sql: `ALTER TABLE users ADD COLUMN id TEXT` },
  { name: 'name', sql: `ALTER TABLE users ADD COLUMN name TEXT NOT NULL DEFAULT ''` },
  { name: 'email', sql: `ALTER TABLE users ADD COLUMN email TEXT NOT NULL DEFAULT ''` },
  { name: 'phone', sql: `ALTER TABLE users ADD COLUMN phone TEXT` },
  { name: 'address', sql: `ALTER TABLE users ADD COLUMN address TEXT` },
  { name: 'state', sql: `ALTER TABLE users ADD COLUMN state TEXT` },
  { name: 'local_government', sql: `ALTER TABLE users ADD COLUMN local_government TEXT` },
  { name: 'account_type', sql: `ALTER TABLE users ADD COLUMN account_type TEXT NOT NULL DEFAULT 'user'` },
  { name: 'approval_status', sql: `ALTER TABLE users ADD COLUMN approval_status TEXT NOT NULL DEFAULT 'approved'` },
  { name: 'identity_type', sql: `ALTER TABLE users ADD COLUMN identity_type TEXT` },
  { name: 'identity_number', sql: `ALTER TABLE users ADD COLUMN identity_number TEXT` },
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

const HOTEL_COLUMNS = [
  { name: 'id', sql: `ALTER TABLE hotels ADD COLUMN id TEXT` },
  { name: 'slug', sql: `ALTER TABLE hotels ADD COLUMN slug TEXT NOT NULL DEFAULT ''` },
  { name: 'name', sql: `ALTER TABLE hotels ADD COLUMN name TEXT NOT NULL DEFAULT ''` },
  { name: 'location', sql: `ALTER TABLE hotels ADD COLUMN location TEXT NOT NULL DEFAULT ''` },
  { name: 'description', sql: `ALTER TABLE hotels ADD COLUMN description TEXT NOT NULL DEFAULT ''` },
  { name: 'rating', sql: `ALTER TABLE hotels ADD COLUMN rating REAL NOT NULL DEFAULT 0` },
  { name: 'review_count', sql: `ALTER TABLE hotels ADD COLUMN review_count INTEGER NOT NULL DEFAULT 0` },
  { name: 'price_value', sql: `ALTER TABLE hotels ADD COLUMN price_value INTEGER NOT NULL DEFAULT 0` },
  { name: 'images_json', sql: `ALTER TABLE hotels ADD COLUMN images_json TEXT NOT NULL DEFAULT '[]'` },
  { name: 'amenities_json', sql: `ALTER TABLE hotels ADD COLUMN amenities_json TEXT NOT NULL DEFAULT '[]'` },
  { name: 'contact_phone', sql: `ALTER TABLE hotels ADD COLUMN contact_phone TEXT NOT NULL DEFAULT ''` },
  { name: 'contact_email', sql: `ALTER TABLE hotels ADD COLUMN contact_email TEXT NOT NULL DEFAULT ''` },
  { name: 'contact_address', sql: `ALTER TABLE hotels ADD COLUMN contact_address TEXT NOT NULL DEFAULT ''` },
  { name: 'approval_status', sql: `ALTER TABLE hotels ADD COLUMN approval_status TEXT NOT NULL DEFAULT 'pending_review'` },
  { name: 'status', sql: `ALTER TABLE hotels ADD COLUMN status TEXT NOT NULL DEFAULT 'active'` },
  { name: 'featured', sql: `ALTER TABLE hotels ADD COLUMN featured INTEGER NOT NULL DEFAULT 0` },
  { name: 'created_by_user_id', sql: `ALTER TABLE hotels ADD COLUMN created_by_user_id TEXT NOT NULL DEFAULT ''` },
  { name: 'approved_by_user_id', sql: `ALTER TABLE hotels ADD COLUMN approved_by_user_id TEXT` },
  { name: 'approved_at', sql: `ALTER TABLE hotels ADD COLUMN approved_at TEXT` },
  { name: 'rejection_reason', sql: `ALTER TABLE hotels ADD COLUMN rejection_reason TEXT` },
  { name: 'created_at', sql: `ALTER TABLE hotels ADD COLUMN created_at TEXT` },
  { name: 'updated_at', sql: `ALTER TABLE hotels ADD COLUMN updated_at TEXT` },
] as const

const HOTEL_ROOM_COLUMNS = [
  { name: 'id', sql: `ALTER TABLE hotel_rooms ADD COLUMN id TEXT` },
  { name: 'hotel_id', sql: `ALTER TABLE hotel_rooms ADD COLUMN hotel_id TEXT NOT NULL DEFAULT ''` },
  { name: 'name', sql: `ALTER TABLE hotel_rooms ADD COLUMN name TEXT NOT NULL DEFAULT ''` },
  { name: 'description', sql: `ALTER TABLE hotel_rooms ADD COLUMN description TEXT NOT NULL DEFAULT ''` },
  { name: 'price', sql: `ALTER TABLE hotel_rooms ADD COLUMN price TEXT NOT NULL DEFAULT ''` },
  { name: 'price_value', sql: `ALTER TABLE hotel_rooms ADD COLUMN price_value INTEGER NOT NULL DEFAULT 0` },
  { name: 'max_guests', sql: `ALTER TABLE hotel_rooms ADD COLUMN max_guests INTEGER NOT NULL DEFAULT 1` },
  { name: 'bed_type', sql: `ALTER TABLE hotel_rooms ADD COLUMN bed_type TEXT NOT NULL DEFAULT ''` },
  { name: 'size', sql: `ALTER TABLE hotel_rooms ADD COLUMN size TEXT NOT NULL DEFAULT ''` },
  { name: 'amenities_json', sql: `ALTER TABLE hotel_rooms ADD COLUMN amenities_json TEXT NOT NULL DEFAULT '[]'` },
  { name: 'images_json', sql: `ALTER TABLE hotel_rooms ADD COLUMN images_json TEXT NOT NULL DEFAULT '[]'` },
  { name: 'available', sql: `ALTER TABLE hotel_rooms ADD COLUMN available INTEGER NOT NULL DEFAULT 1` },
  { name: 'created_at', sql: `ALTER TABLE hotel_rooms ADD COLUMN created_at TEXT` },
  { name: 'updated_at', sql: `ALTER TABLE hotel_rooms ADD COLUMN updated_at TEXT` },
] as const

const HOTEL_BOOKING_COLUMNS = [
  { name: 'id', sql: `ALTER TABLE hotel_bookings ADD COLUMN id TEXT` },
  { name: 'hotel_id', sql: `ALTER TABLE hotel_bookings ADD COLUMN hotel_id TEXT NOT NULL DEFAULT ''` },
  { name: 'room_id', sql: `ALTER TABLE hotel_bookings ADD COLUMN room_id TEXT NOT NULL DEFAULT ''` },
  { name: 'guest_name', sql: `ALTER TABLE hotel_bookings ADD COLUMN guest_name TEXT NOT NULL DEFAULT ''` },
  { name: 'guest_email', sql: `ALTER TABLE hotel_bookings ADD COLUMN guest_email TEXT NOT NULL DEFAULT ''` },
  { name: 'guest_phone', sql: `ALTER TABLE hotel_bookings ADD COLUMN guest_phone TEXT NOT NULL DEFAULT ''` },
  { name: 'guest_origin', sql: `ALTER TABLE hotel_bookings ADD COLUMN guest_origin TEXT NOT NULL DEFAULT ''` },
  { name: 'adults', sql: `ALTER TABLE hotel_bookings ADD COLUMN adults INTEGER NOT NULL DEFAULT 1` },
  { name: 'children', sql: `ALTER TABLE hotel_bookings ADD COLUMN children INTEGER NOT NULL DEFAULT 0` },
  { name: 'check_in_date', sql: `ALTER TABLE hotel_bookings ADD COLUMN check_in_date TEXT NOT NULL DEFAULT ''` },
  { name: 'check_out_date', sql: `ALTER TABLE hotel_bookings ADD COLUMN check_out_date TEXT NOT NULL DEFAULT ''` },
  { name: 'departure_time', sql: `ALTER TABLE hotel_bookings ADD COLUMN departure_time TEXT` },
  { name: 'status', sql: `ALTER TABLE hotel_bookings ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'` },
  { name: 'created_by_user_id', sql: `ALTER TABLE hotel_bookings ADD COLUMN created_by_user_id TEXT` },
  { name: 'created_at', sql: `ALTER TABLE hotel_bookings ADD COLUMN created_at TEXT` },
  { name: 'updated_at', sql: `ALTER TABLE hotel_bookings ADD COLUMN updated_at TEXT` },
] as const

const SIGNUP_VERIFICATION_COLUMNS = [
  { name: 'id', sql: `ALTER TABLE signup_verifications ADD COLUMN id TEXT` },
  { name: 'name', sql: `ALTER TABLE signup_verifications ADD COLUMN name TEXT NOT NULL DEFAULT ''` },
  { name: 'email', sql: `ALTER TABLE signup_verifications ADD COLUMN email TEXT NOT NULL DEFAULT ''` },
  { name: 'phone', sql: `ALTER TABLE signup_verifications ADD COLUMN phone TEXT NOT NULL DEFAULT ''` },
  { name: 'address', sql: `ALTER TABLE signup_verifications ADD COLUMN address TEXT NOT NULL DEFAULT ''` },
  { name: 'state', sql: `ALTER TABLE signup_verifications ADD COLUMN state TEXT NOT NULL DEFAULT ''` },
  { name: 'local_government', sql: `ALTER TABLE signup_verifications ADD COLUMN local_government TEXT NOT NULL DEFAULT ''` },
  { name: 'account_type', sql: `ALTER TABLE signup_verifications ADD COLUMN account_type TEXT NOT NULL DEFAULT 'user'` },
  { name: 'identity_type', sql: `ALTER TABLE signup_verifications ADD COLUMN identity_type TEXT` },
  { name: 'identity_number', sql: `ALTER TABLE signup_verifications ADD COLUMN identity_number TEXT` },
  { name: 'password_hash', sql: `ALTER TABLE signup_verifications ADD COLUMN password_hash TEXT NOT NULL DEFAULT ''` },
  { name: 'otp_hash', sql: `ALTER TABLE signup_verifications ADD COLUMN otp_hash TEXT NOT NULL DEFAULT ''` },
  { name: 'expires_at', sql: `ALTER TABLE signup_verifications ADD COLUMN expires_at TEXT NOT NULL DEFAULT ''` },
  { name: 'consumed_at', sql: `ALTER TABLE signup_verifications ADD COLUMN consumed_at TEXT` },
  { name: 'attempts', sql: `ALTER TABLE signup_verifications ADD COLUMN attempts INTEGER NOT NULL DEFAULT 0` },
  { name: 'created_at', sql: `ALTER TABLE signup_verifications ADD COLUMN created_at TEXT` },
  { name: 'updated_at', sql: `ALTER TABLE signup_verifications ADD COLUMN updated_at TEXT` },
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
      account_type = COALESCE(account_type, CASE WHEN role = 'admin' THEN 'agent' ELSE 'user' END),
      approval_status = COALESCE(approval_status, CASE WHEN role = 'admin' THEN 'approved' ELSE 'approved' END),
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
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_users_account_type ON users(account_type);`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_users_approval_status ON users(approval_status);`)
}

async function ensurePropertiesTableSchema() {
  const db = getDbClient()
  const result = await db.execute(`PRAGMA table_info(properties)`)
  const existingColumns = new Set(result.rows.map((row) => String(row.name)))
  const idColumn = result.rows.find((row) => String(row.name) === 'id')

  // Older databases used an integer primary key for properties.id, which breaks
  // the current UUID-based inserts with SQLITE_MISMATCH. Rebuild into the current schema.
  if (idColumn && String(idColumn.type || '').toUpperCase().includes('INT')) {
    await db.execute(`ALTER TABLE properties RENAME TO properties_legacy`)
    await db.execute(`
      CREATE TABLE properties (
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
      )
    `)
    await db.execute(`
      INSERT INTO properties (
        id, title, location, full_address, estate, latitude, longitude, price_value, currency, pricing_period,
        type, listed_by, bedrooms, bathrooms, sqft, year_built, features_json, image_urls_json, video_url,
        reference_code, document_info, contact_name, contact_phone, contact_email, verification_status,
        approval_status, status, disclaimer_accepted, description, featured, created_by_user_id,
        approved_by_user_id, approved_at, rejection_reason, created_at, updated_at
      )
      SELECT
        CAST(id AS TEXT),
        COALESCE(title, ''),
        COALESCE(location, ''),
        COALESCE(full_address, ''),
        estate,
        latitude,
        longitude,
        COALESCE(price_value, 0),
        COALESCE(currency, 'NGN'),
        COALESCE(pricing_period, 'one-time'),
        COALESCE(type, 'For Sale'),
        COALESCE(listed_by, 'Agent'),
        COALESCE(bedrooms, 0),
        COALESCE(bathrooms, 0),
        COALESCE(sqft, 0),
        year_built,
        COALESCE(NULLIF(features_json, ''), '[]'),
        COALESCE(NULLIF(image_urls_json, ''), '[]'),
        video_url,
        COALESCE(NULLIF(reference_code, ''), 'LEGACY-' || CAST(id AS TEXT)),
        document_info,
        COALESCE(contact_name, ''),
        COALESCE(contact_phone, ''),
        COALESCE(contact_email, ''),
        COALESCE(verification_status, 'not_requested'),
        COALESCE(approval_status, 'pending_review'),
        COALESCE(status, 'active'),
        COALESCE(disclaimer_accepted, 0),
        COALESCE(description, ''),
        COALESCE(featured, 0),
        COALESCE(created_by_user_id, 'legacy-import'),
        approved_by_user_id,
        approved_at,
        rejection_reason,
        COALESCE(created_at, CURRENT_TIMESTAMP),
        COALESCE(updated_at, created_at, CURRENT_TIMESTAMP)
      FROM properties_legacy
    `)
    await db.execute(`DROP TABLE properties_legacy`)
    return ensurePropertiesTableSchema()
  }

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

async function ensureHotelsTableSchema() {
  const db = getDbClient()

  const hotelsInfo = await db.execute(`PRAGMA table_info(hotels)`)
  const existingHotelColumns = new Set(hotelsInfo.rows.map((row) => String(row.name)))
  for (const column of HOTEL_COLUMNS) {
    if (!existingHotelColumns.has(column.name)) {
      await db.execute(column.sql)
    }
  }
  await db.execute(`
    UPDATE hotels
    SET
      images_json = COALESCE(NULLIF(images_json, ''), '[]'),
      amenities_json = COALESCE(NULLIF(amenities_json, ''), '[]'),
      approval_status = COALESCE(approval_status, 'pending_review'),
      status = COALESCE(status, 'active'),
      featured = COALESCE(featured, 0),
      created_at = COALESCE(created_at, CURRENT_TIMESTAMP),
      updated_at = COALESCE(updated_at, created_at, CURRENT_TIMESTAMP)
  `)
  await db.execute(`CREATE UNIQUE INDEX IF NOT EXISTS idx_hotels_slug ON hotels(slug);`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_hotels_created_by_user_id ON hotels(created_by_user_id);`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_hotels_approval_status ON hotels(approval_status);`)

  const roomsInfo = await db.execute(`PRAGMA table_info(hotel_rooms)`)
  const existingRoomColumns = new Set(roomsInfo.rows.map((row) => String(row.name)))
  for (const column of HOTEL_ROOM_COLUMNS) {
    if (!existingRoomColumns.has(column.name)) {
      await db.execute(column.sql)
    }
  }
  await db.execute(`
    UPDATE hotel_rooms
    SET
      amenities_json = COALESCE(NULLIF(amenities_json, ''), '[]'),
      images_json = COALESCE(NULLIF(images_json, ''), '[]'),
      price = COALESCE(NULLIF(price, ''), CAST(price_value AS TEXT), ''),
      available = COALESCE(available, 1),
      created_at = COALESCE(created_at, CURRENT_TIMESTAMP),
      updated_at = COALESCE(updated_at, created_at, CURRENT_TIMESTAMP)
  `)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_hotel_rooms_hotel_id ON hotel_rooms(hotel_id);`)

  const bookingsInfo = await db.execute(`PRAGMA table_info(hotel_bookings)`)
  const existingBookingColumns = new Set(bookingsInfo.rows.map((row) => String(row.name)))
  for (const column of HOTEL_BOOKING_COLUMNS) {
    if (!existingBookingColumns.has(column.name)) {
      await db.execute(column.sql)
    }
  }
  await db.execute(`
    UPDATE hotel_bookings
    SET
      status = COALESCE(status, 'pending'),
      guest_email = COALESCE(guest_email, ''),
      adults = COALESCE(adults, 1),
      children = COALESCE(children, 0),
      created_at = COALESCE(created_at, CURRENT_TIMESTAMP),
      updated_at = COALESCE(updated_at, created_at, CURRENT_TIMESTAMP)
  `)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_hotel_bookings_hotel_id ON hotel_bookings(hotel_id);`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_hotel_bookings_status ON hotel_bookings(status);`)
}

async function ensureSignupVerificationsTableSchema() {
  const db = getDbClient()
  const result = await db.execute(`PRAGMA table_info(signup_verifications)`)
  const existingColumns = new Set(result.rows.map((row) => String(row.name)))

  for (const column of SIGNUP_VERIFICATION_COLUMNS) {
    if (!existingColumns.has(column.name)) {
      await db.execute(column.sql)
    }
  }

  await db.execute(`
    UPDATE signup_verifications
    SET
      attempts = COALESCE(attempts, 0),
      created_at = COALESCE(created_at, CURRENT_TIMESTAMP),
      updated_at = COALESCE(updated_at, created_at, CURRENT_TIMESTAMP)
  `)

  await db.execute(`CREATE INDEX IF NOT EXISTS idx_signup_verifications_email ON signup_verifications(email);`)
}

async function ensureSavedPropertiesSchema() {
  const db = getDbClient()
  const savedInfo = await db.execute(`PRAGMA table_info(saved_properties)`)
  const savedColumns = new Set(savedInfo.rows.map((row) => String(row.name)))
  const savedDefinitions = [
    { name: 'id', sql: `ALTER TABLE saved_properties ADD COLUMN id TEXT` },
    { name: 'user_id', sql: `ALTER TABLE saved_properties ADD COLUMN user_id TEXT NOT NULL DEFAULT ''` },
    { name: 'property_id', sql: `ALTER TABLE saved_properties ADD COLUMN property_id TEXT NOT NULL DEFAULT ''` },
    { name: 'created_at', sql: `ALTER TABLE saved_properties ADD COLUMN created_at TEXT` },
  ] as const

  for (const column of savedDefinitions) {
    if (!savedColumns.has(column.name)) {
      await db.execute(column.sql)
    }
  }

  await db.execute(`CREATE UNIQUE INDEX IF NOT EXISTS idx_saved_properties_user_property ON saved_properties(user_id, property_id);`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_saved_properties_user_id ON saved_properties(user_id);`)

  const viewsInfo = await db.execute(`PRAGMA table_info(property_views)`)
  const viewColumns = new Set(viewsInfo.rows.map((row) => String(row.name)))
  const viewDefinitions = [
    { name: 'id', sql: `ALTER TABLE property_views ADD COLUMN id TEXT` },
    { name: 'property_id', sql: `ALTER TABLE property_views ADD COLUMN property_id TEXT NOT NULL DEFAULT ''` },
    { name: 'viewer_user_id', sql: `ALTER TABLE property_views ADD COLUMN viewer_user_id TEXT` },
    { name: 'viewer_session_key', sql: `ALTER TABLE property_views ADD COLUMN viewer_session_key TEXT` },
    { name: 'created_at', sql: `ALTER TABLE property_views ADD COLUMN created_at TEXT` },
  ] as const

  for (const column of viewDefinitions) {
    if (!viewColumns.has(column.name)) {
      await db.execute(column.sql)
    }
  }

  await db.execute(`CREATE INDEX IF NOT EXISTS idx_property_views_property_id ON property_views(property_id);`)
}

async function ensureSubscriptionSchema() {
  const db = getDbClient()
  const plansInfo = await db.execute(`PRAGMA table_info(subscription_plans)`)
  const existingPlanColumns = new Set(plansInfo.rows.map((row) => String(row.name)))
  const planDefinitions = [
    { name: 'id', sql: `ALTER TABLE subscription_plans ADD COLUMN id TEXT` },
    { name: 'name', sql: `ALTER TABLE subscription_plans ADD COLUMN name TEXT NOT NULL DEFAULT ''` },
    { name: 'slug', sql: `ALTER TABLE subscription_plans ADD COLUMN slug TEXT NOT NULL DEFAULT ''` },
    { name: 'description', sql: `ALTER TABLE subscription_plans ADD COLUMN description TEXT NOT NULL DEFAULT ''` },
    { name: 'price_amount', sql: `ALTER TABLE subscription_plans ADD COLUMN price_amount INTEGER NOT NULL DEFAULT 0` },
    { name: 'currency', sql: `ALTER TABLE subscription_plans ADD COLUMN currency TEXT NOT NULL DEFAULT 'NGN'` },
    { name: 'billing_interval', sql: `ALTER TABLE subscription_plans ADD COLUMN billing_interval TEXT NOT NULL DEFAULT 'month'` },
    { name: 'property_limit', sql: `ALTER TABLE subscription_plans ADD COLUMN property_limit INTEGER NOT NULL DEFAULT 1` },
    { name: 'hotel_limit', sql: `ALTER TABLE subscription_plans ADD COLUMN hotel_limit INTEGER NOT NULL DEFAULT 0` },
    { name: 'features_json', sql: `ALTER TABLE subscription_plans ADD COLUMN features_json TEXT NOT NULL DEFAULT '[]'` },
    { name: 'is_free', sql: `ALTER TABLE subscription_plans ADD COLUMN is_free INTEGER NOT NULL DEFAULT 0` },
    { name: 'is_active', sql: `ALTER TABLE subscription_plans ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1` },
    { name: 'paystack_plan_code', sql: `ALTER TABLE subscription_plans ADD COLUMN paystack_plan_code TEXT` },
    { name: 'created_at', sql: `ALTER TABLE subscription_plans ADD COLUMN created_at TEXT` },
    { name: 'updated_at', sql: `ALTER TABLE subscription_plans ADD COLUMN updated_at TEXT` },
  ] as const
  for (const column of planDefinitions) {
    if (!existingPlanColumns.has(column.name)) {
      await db.execute(column.sql)
    }
  }
  await db.execute(`CREATE UNIQUE INDEX IF NOT EXISTS idx_subscription_plans_slug ON subscription_plans(slug);`)

  const subscriptionsInfo = await db.execute(`PRAGMA table_info(user_subscriptions)`)
  const existingSubscriptionColumns = new Set(subscriptionsInfo.rows.map((row) => String(row.name)))
  const subscriptionDefinitions = [
    { name: 'id', sql: `ALTER TABLE user_subscriptions ADD COLUMN id TEXT` },
    { name: 'user_id', sql: `ALTER TABLE user_subscriptions ADD COLUMN user_id TEXT NOT NULL DEFAULT ''` },
    { name: 'plan_id', sql: `ALTER TABLE user_subscriptions ADD COLUMN plan_id TEXT NOT NULL DEFAULT ''` },
    { name: 'status', sql: `ALTER TABLE user_subscriptions ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'` },
    { name: 'amount', sql: `ALTER TABLE user_subscriptions ADD COLUMN amount INTEGER NOT NULL DEFAULT 0` },
    { name: 'currency', sql: `ALTER TABLE user_subscriptions ADD COLUMN currency TEXT NOT NULL DEFAULT 'NGN'` },
    { name: 'billing_interval', sql: `ALTER TABLE user_subscriptions ADD COLUMN billing_interval TEXT NOT NULL DEFAULT 'month'` },
    { name: 'payment_provider', sql: `ALTER TABLE user_subscriptions ADD COLUMN payment_provider TEXT NOT NULL DEFAULT 'system'` },
    { name: 'payment_reference', sql: `ALTER TABLE user_subscriptions ADD COLUMN payment_reference TEXT` },
    { name: 'paystack_access_code', sql: `ALTER TABLE user_subscriptions ADD COLUMN paystack_access_code TEXT` },
    { name: 'paystack_authorization_url', sql: `ALTER TABLE user_subscriptions ADD COLUMN paystack_authorization_url TEXT` },
    { name: 'starts_at', sql: `ALTER TABLE user_subscriptions ADD COLUMN starts_at TEXT` },
    { name: 'ends_at', sql: `ALTER TABLE user_subscriptions ADD COLUMN ends_at TEXT` },
    { name: 'created_at', sql: `ALTER TABLE user_subscriptions ADD COLUMN created_at TEXT` },
    { name: 'updated_at', sql: `ALTER TABLE user_subscriptions ADD COLUMN updated_at TEXT` },
  ] as const
  for (const column of subscriptionDefinitions) {
    if (!existingSubscriptionColumns.has(column.name)) {
      await db.execute(column.sql)
    }
  }
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);`)
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
            phone TEXT,
            address TEXT,
            state TEXT,
            local_government TEXT,
            account_type TEXT NOT NULL DEFAULT 'user',
            approval_status TEXT NOT NULL DEFAULT 'approved',
            identity_type TEXT,
            identity_number TEXT,
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
        `
          CREATE TABLE IF NOT EXISTS hotels (
            id TEXT PRIMARY KEY,
            slug TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            location TEXT NOT NULL,
            description TEXT NOT NULL,
            rating REAL NOT NULL DEFAULT 0,
            review_count INTEGER NOT NULL DEFAULT 0,
            price_value INTEGER NOT NULL DEFAULT 0,
            images_json TEXT NOT NULL DEFAULT '[]',
            amenities_json TEXT NOT NULL DEFAULT '[]',
            contact_phone TEXT NOT NULL,
            contact_email TEXT NOT NULL,
            contact_address TEXT NOT NULL,
            approval_status TEXT NOT NULL DEFAULT 'pending_review',
            status TEXT NOT NULL DEFAULT 'active',
            featured INTEGER NOT NULL DEFAULT 0,
            created_by_user_id TEXT NOT NULL,
            approved_by_user_id TEXT,
            approved_at TEXT,
            rejection_reason TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `,
        `
          CREATE TABLE IF NOT EXISTS hotel_rooms (
            id TEXT PRIMARY KEY,
            hotel_id TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            price TEXT NOT NULL DEFAULT '',
            price_value INTEGER NOT NULL DEFAULT 0,
            max_guests INTEGER NOT NULL DEFAULT 1,
            bed_type TEXT NOT NULL,
            size TEXT NOT NULL,
            amenities_json TEXT NOT NULL DEFAULT '[]',
            images_json TEXT NOT NULL DEFAULT '[]',
            available INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `,
        `
          CREATE TABLE IF NOT EXISTS hotel_bookings (
            id TEXT PRIMARY KEY,
            hotel_id TEXT NOT NULL,
            room_id TEXT NOT NULL,
            guest_name TEXT NOT NULL,
            guest_email TEXT NOT NULL,
            guest_phone TEXT NOT NULL,
            guest_origin TEXT NOT NULL,
            adults INTEGER NOT NULL DEFAULT 1,
            children INTEGER NOT NULL DEFAULT 0,
            check_in_date TEXT NOT NULL,
            check_out_date TEXT NOT NULL,
            departure_time TEXT,
            status TEXT NOT NULL DEFAULT 'pending',
            created_by_user_id TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `,
        `
          CREATE TABLE IF NOT EXISTS signup_verifications (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            address TEXT NOT NULL,
            state TEXT NOT NULL,
            local_government TEXT NOT NULL,
            account_type TEXT NOT NULL DEFAULT 'user',
            identity_type TEXT,
            identity_number TEXT,
            password_hash TEXT NOT NULL,
            otp_hash TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            consumed_at TEXT,
            attempts INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `,
        `
          CREATE TABLE IF NOT EXISTS saved_properties (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            property_id TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `,
        `
          CREATE TABLE IF NOT EXISTS property_views (
            id TEXT PRIMARY KEY,
            property_id TEXT NOT NULL,
            viewer_user_id TEXT,
            viewer_session_key TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `,
        `
          CREATE TABLE IF NOT EXISTS subscription_plans (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            description TEXT NOT NULL,
            price_amount INTEGER NOT NULL DEFAULT 0,
            currency TEXT NOT NULL DEFAULT 'NGN',
            billing_interval TEXT NOT NULL DEFAULT 'month',
            property_limit INTEGER NOT NULL DEFAULT 1,
            hotel_limit INTEGER NOT NULL DEFAULT 0,
            features_json TEXT NOT NULL DEFAULT '[]',
            is_free INTEGER NOT NULL DEFAULT 0,
            is_active INTEGER NOT NULL DEFAULT 1,
            paystack_plan_code TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `,
        `
          CREATE TABLE IF NOT EXISTS user_subscriptions (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            plan_id TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            amount INTEGER NOT NULL DEFAULT 0,
            currency TEXT NOT NULL DEFAULT 'NGN',
            billing_interval TEXT NOT NULL DEFAULT 'month',
            payment_provider TEXT NOT NULL DEFAULT 'system',
            payment_reference TEXT,
            paystack_access_code TEXT,
            paystack_authorization_url TEXT,
            starts_at TEXT,
            ends_at TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `,
      ].map((sql) => ({ sql })),
      'write'
    )

    await ensureUsersTableSchema()
    await ensurePropertiesTableSchema()
    await ensureHotelsTableSchema()
    await ensureSignupVerificationsTableSchema()
    await ensureSavedPropertiesSchema()
    await ensureSubscriptionSchema()

    initialized = true
    await seedPropertiesIfNeeded()
    await seedHotelsIfNeeded()
    await seedSubscriptionPlansIfNeeded()
  })()

  try {
    await initializationPromise
  } finally {
    initializationPromise = null
  }
}
