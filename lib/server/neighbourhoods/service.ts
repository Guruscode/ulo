import { z } from 'zod'

import type { AuthUser } from '@/lib/auth/types'
import { ApiError } from '@/lib/server/http/api-error'

import {
  createNeighbourhoodRecord,
  deleteNeighbourhoodRecord,
  getNeighbourhoodRecordById,
  getNeighbourhoodRecordBySlug,
  listNeighbourhoodRecords,
  updateNeighbourhoodRecord,
} from './repository'

const phaseSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  image: z.string().trim().min(1),
})

const neighbourhoodSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().min(5),
  fullDescription: z.string().trim().min(20),
  image: z.string().trim().min(1),
  latitude: z.string().trim().min(2),
  longitude: z.string().trim().min(2),
  amenities: z.array(z.string().trim().min(1)).min(1),
  highlights: z.array(z.string().trim().min(1)).min(1),
  population: z.string().trim().min(1),
  avgIncome: z.string().trim().min(1),
  avgAge: z.string().trim().min(1),
  phases: z.array(phaseSchema).optional().default([]),
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

export async function listNeighbourhoods() {
  return listNeighbourhoodRecords()
}

export async function getNeighbourhoodBySlug(slug: string) {
  const neighbourhood = await getNeighbourhoodRecordBySlug(slug)
  if (!neighbourhood) {
    throw new ApiError(404, 'NEIGHBOURHOOD_NOT_FOUND', 'Neighbourhood not found.')
  }
  return neighbourhood
}

export async function listNeighbourhoodsForAdmin(actor: AuthUser) {
  requireAdmin(actor)
  return listNeighbourhoodRecords()
}

export async function createNeighbourhoodForAdmin(actor: AuthUser, input: unknown) {
  requireAdmin(actor)
  const parsed = neighbourhoodSchema.safeParse(input)
  if (!parsed.success) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Please correct the neighbourhood fields.', parsed.error.flatten())
  }

  const created = await createNeighbourhoodRecord({
    ...parsed.data,
    slug: slugify(parsed.data.name),
  })

  if (!created) {
    throw new ApiError(500, 'NEIGHBOURHOOD_CREATE_FAILED', 'Unable to create neighbourhood.')
  }

  return created
}

export async function updateNeighbourhoodForAdmin(actor: AuthUser, id: string, input: unknown) {
  requireAdmin(actor)
  const existing = await getNeighbourhoodRecordById(id)
  if (!existing) {
    throw new ApiError(404, 'NEIGHBOURHOOD_NOT_FOUND', 'Neighbourhood not found.')
  }

  const parsed = neighbourhoodSchema.safeParse(input)
  if (!parsed.success) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Please correct the neighbourhood fields.', parsed.error.flatten())
  }

  const updated = await updateNeighbourhoodRecord(id, {
    ...parsed.data,
    slug: slugify(parsed.data.name),
  })

  if (!updated) {
    throw new ApiError(500, 'NEIGHBOURHOOD_UPDATE_FAILED', 'Unable to update neighbourhood.')
  }

  return updated
}

export async function deleteNeighbourhoodForAdmin(actor: AuthUser, id: string) {
  requireAdmin(actor)
  const existing = await getNeighbourhoodRecordById(id)
  if (!existing) {
    throw new ApiError(404, 'NEIGHBOURHOOD_NOT_FOUND', 'Neighbourhood not found.')
  }
  await deleteNeighbourhoodRecord(id)
}
