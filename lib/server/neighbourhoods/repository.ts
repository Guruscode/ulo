import { randomUUID } from 'crypto'

import { initializeDatabase } from '@/lib/server/db/init'
import { getDbClient } from '@/lib/server/db/client'

import type { NeighbourhoodRecord, NeighbourhoodUpsertInput } from './types'

function parseJsonArray(value: unknown): string[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(String(value))
    return Array.isArray(parsed) ? parsed.map((item) => String(item)) : []
  } catch {
    return []
  }
}

function parsePhases(value: unknown): NeighbourhoodRecord['phases'] {
  if (!value) return []
  try {
    const parsed = JSON.parse(String(value))
    return Array.isArray(parsed)
      ? parsed.map((item) => ({
          name: String(item?.name || ''),
          description: String(item?.description || ''),
          image: String(item?.image || ''),
        }))
      : []
  } catch {
    return []
  }
}

function mapRow(row: Record<string, unknown>): NeighbourhoodRecord {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    description: String(row.description),
    fullDescription: String(row.full_description),
    image: String(row.image),
    latitude: String(row.latitude),
    longitude: String(row.longitude),
    amenities: parseJsonArray(row.amenities_json),
    highlights: parseJsonArray(row.highlights_json),
    population: String(row.population),
    avgIncome: String(row.avg_income),
    avgAge: String(row.avg_age),
    phases: parsePhases(row.phases_json),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

export async function listNeighbourhoodRecords() {
  await initializeDatabase()
  const db = getDbClient()
  const result = await db.execute(`
    SELECT *
    FROM neighbourhoods
    ORDER BY created_at DESC
  `)

  return result.rows.map((row) => mapRow(row as Record<string, unknown>))
}

export async function getNeighbourhoodRecordBySlug(slug: string) {
  await initializeDatabase()
  const db = getDbClient()
  const result = await db.execute({
    sql: `SELECT * FROM neighbourhoods WHERE slug = ? LIMIT 1`,
    args: [slug],
  })
  const row = result.rows[0]
  return row ? mapRow(row as Record<string, unknown>) : null
}

export async function getNeighbourhoodRecordById(id: string) {
  await initializeDatabase()
  const db = getDbClient()
  const result = await db.execute({
    sql: `SELECT * FROM neighbourhoods WHERE id = ? LIMIT 1`,
    args: [id],
  })
  const row = result.rows[0]
  return row ? mapRow(row as Record<string, unknown>) : null
}

export async function createNeighbourhoodRecord(input: NeighbourhoodUpsertInput) {
  await initializeDatabase()
  const db = getDbClient()
  const id = randomUUID()

  await db.execute({
    sql: `
      INSERT INTO neighbourhoods (
        id, slug, name, description, full_description, image, latitude, longitude,
        amenities_json, highlights_json, population, avg_income, avg_age, phases_json, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
    args: [
      id,
      input.slug,
      input.name,
      input.description,
      input.fullDescription,
      input.image,
      input.latitude,
      input.longitude,
      JSON.stringify(input.amenities),
      JSON.stringify(input.highlights),
      input.population,
      input.avgIncome,
      input.avgAge,
      JSON.stringify(input.phases),
    ],
  })

  return getNeighbourhoodRecordById(id)
}

export async function updateNeighbourhoodRecord(id: string, input: NeighbourhoodUpsertInput) {
  await initializeDatabase()
  const db = getDbClient()

  await db.execute({
    sql: `
      UPDATE neighbourhoods
      SET
        slug = ?,
        name = ?,
        description = ?,
        full_description = ?,
        image = ?,
        latitude = ?,
        longitude = ?,
        amenities_json = ?,
        highlights_json = ?,
        population = ?,
        avg_income = ?,
        avg_age = ?,
        phases_json = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [
      input.slug,
      input.name,
      input.description,
      input.fullDescription,
      input.image,
      input.latitude,
      input.longitude,
      JSON.stringify(input.amenities),
      JSON.stringify(input.highlights),
      input.population,
      input.avgIncome,
      input.avgAge,
      JSON.stringify(input.phases),
      id,
    ],
  })

  return getNeighbourhoodRecordById(id)
}

export async function deleteNeighbourhoodRecord(id: string) {
  await initializeDatabase()
  const db = getDbClient()
  await db.execute({ sql: `DELETE FROM neighbourhoods WHERE id = ?`, args: [id] })
}
