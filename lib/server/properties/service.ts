import { randomUUID } from 'crypto'
import { z } from 'zod'

import type { AuthUser } from '@/lib/auth/types'
import type {
  PropertyApprovalStatus,
  PropertyListFilters,
  PropertyRecord,
  PropertyScope,
  PropertyUpsertInput,
} from '@/lib/properties/types'
import { ApiError } from '@/lib/server/http/api-error'
import { sendPropertyApprovalEmail, sendPropertyCreatedEmails } from '@/lib/server/mail/notifications'
import { createUserNotification } from '@/lib/server/notifications/service'
import { assertListingCapacity } from '@/lib/server/subscriptions/service'
import {
  countProperties,
  createProperty,
  deleteProperty,
  findPropertyById,
  findPropertyByIdForViewer,
  listProperties,
  listSavedPropertiesForUser,
  recordPropertyView,
  removeSavedPropertyForUser,
  savePropertyForUser,
  updateProperty,
  updatePropertyApproval,
} from '@/lib/server/properties/repository'

const propertySchema = z.object({
  title: z.string().trim().optional().default(''),
  location: z.string().trim().min(2, 'Location is required.'),
  fullAddress: z.string().trim().min(5, 'Full address is required.'),
  estate: z.string().trim().optional().nullable(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  priceValue: z.number().int().positive('Price must be greater than zero.'),
  currency: z.enum(['USD', 'NGN']),
  pricingPeriod: z.enum([
    'sale',
    'monthly',
    '6-months',
    'annually',
    '2-years',
    '5-years',
    'per-day',
    '3-days',
    'per-week',
    'per-month',
  ]),
  type: z.enum(['For Sale', 'For Rent', 'Land', 'Shortlet']),
  listedBy: z.enum(['Agent', 'Landlord', 'Dealer', 'Owner']),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  features: z.array(z.string().trim().min(1)).min(1, 'Add at least one feature.'),
  imageUrls: z
    .array(z.string().trim().url('Each image must be a valid URL.'))
    .min(4, 'Exactly 4 property images are required.')
    .max(4, 'Exactly 4 property images are required.'),
  videoUrl: z.string().trim().url('Video URL must be valid.').nullable().optional().or(z.literal('')),
  referenceCode: z.string().trim().optional().nullable(),
  documentInfo: z.string().trim().optional().nullable(),
  contactName: z.string().trim().min(2, 'Contact name is required.'),
  contactPhone: z.string().trim().min(7, 'Contact phone is required.'),
  contactEmail: z.string().trim().email('A valid contact email is required.'),
  verificationStatus: z.enum(['not_requested', 'requested', 'verified']).optional(),
  disclaimerAccepted: z.boolean().refine(Boolean, 'You must accept the disclaimer.'),
  description: z.string().trim().min(20, 'Description must be at least 20 characters.'),
  status: z.enum(['active', 'sold', 'pending']),
  featured: z.boolean().optional(),
}).superRefine((data, ctx) => {
  const rentPricingPeriods = ['monthly', '6-months', 'annually', '2-years', '5-years']
  const shortletPricingPeriods = ['per-day', '3-days', 'per-week', 'per-month']

  if (data.type === 'Land') {
    if (data.bedrooms !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['bedrooms'],
        message: 'Land listings cannot have bedrooms.',
      })
    }

    if (data.bathrooms !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['bathrooms'],
        message: 'Land listings cannot have bathrooms.',
      })
    }

    if (data.pricingPeriod !== 'sale') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['pricingPeriod'],
        message: 'Land listings use a single sale price.',
      })
    }
  }

  if (data.type === 'For Sale' && data.pricingPeriod !== 'sale') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['pricingPeriod'],
      message: 'For sale listings use a single sale price.',
    })
  }

  if (data.type === 'For Rent' && !rentPricingPeriods.includes(data.pricingPeriod)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['pricingPeriod'],
      message: 'Select a valid rent pricing model.',
    })
  }

  if (data.type === 'Shortlet' && !shortletPricingPeriods.includes(data.pricingPeriod)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['pricingPeriod'],
      message: 'Select a valid shortlet pricing model.',
    })
  }

  if (data.type !== 'Land' && data.title.trim().length < 3) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['title'],
      message: 'Title must be at least 3 characters.',
    })
  }
})

function normalizeUpsertInput(input: unknown): PropertyUpsertInput {
  const parsed = propertySchema.safeParse(input)

  if (!parsed.success) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Please correct the property form fields.', parsed.error.flatten())
  }

  return {
    title:
      parsed.data.type === 'Land'
        ? `Land in ${parsed.data.location.trim()}`
        : parsed.data.title.trim(),
    location: parsed.data.location,
    fullAddress: parsed.data.fullAddress,
    estate: parsed.data.estate || null,
    latitude: parsed.data.latitude ?? null,
    longitude: parsed.data.longitude ?? null,
    priceValue: parsed.data.priceValue,
    currency: parsed.data.currency,
    pricingPeriod: parsed.data.pricingPeriod,
    type: parsed.data.type,
    listedBy: parsed.data.listedBy,
    bedrooms: parsed.data.type === 'Land' ? 0 : parsed.data.bedrooms,
    bathrooms: parsed.data.type === 'Land' ? 0 : parsed.data.bathrooms,
    features: parsed.data.features,
    imageUrls: parsed.data.imageUrls,
    videoUrl: parsed.data.videoUrl || null,
    referenceCode: parsed.data.referenceCode || null,
    documentInfo: parsed.data.documentInfo || null,
    contactName: parsed.data.contactName,
    contactPhone: parsed.data.contactPhone,
    contactEmail: parsed.data.contactEmail,
    verificationStatus: parsed.data.verificationStatus ?? 'not_requested',
    featured: parsed.data.featured ?? false,
    disclaimerAccepted: parsed.data.disclaimerAccepted,
    description: parsed.data.description,
    status: parsed.data.status,
  }
}

function ensurePropertyAccess(property: PropertyRecord | null, actor: AuthUser | null) {
  if (!property) {
    throw new ApiError(404, 'PROPERTY_NOT_FOUND', 'Property not found.')
  }

  if (!actor) {
    if (property.approvalStatus !== 'approved' || property.status !== 'active') {
      throw new ApiError(404, 'PROPERTY_NOT_FOUND', 'Property not found.')
    }

    return property
  }

  if (actor.role === 'admin' || property.createdByUserId === actor.id) {
    return property
  }

  if (property.approvalStatus === 'approved' && property.status === 'active') {
    return property
  }

  throw new ApiError(403, 'FORBIDDEN', 'You do not have access to this property.')
}

function ensureCanPublish(actor: AuthUser) {
  if (actor.role === 'admin') return

  if (actor.status !== 'active') {
    throw new ApiError(403, 'ACCOUNT_DISABLED', 'Your account is disabled.')
  }

  if (actor.approvalStatus !== 'approved') {
    throw new ApiError(403, 'ACCOUNT_PENDING_APPROVAL', 'Your account must be approved before listing properties.')
  }
}

function buildReferenceCode(input: PropertyUpsertInput) {
  if (input.referenceCode?.trim()) {
    return input.referenceCode.trim().toUpperCase()
  }

  return `ULO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

export async function listPropertiesForScope(scope: PropertyScope, filters: PropertyListFilters, actor?: AuthUser | null) {
  if (scope === 'mine') {
    if (!actor) {
      throw new ApiError(401, 'UNAUTHORIZED', 'You are not signed in.')
    }

    return listProperties('mine', filters, actor.id)
  }

  if (scope === 'admin') {
    if (!actor || actor.role !== 'admin') {
      throw new ApiError(403, 'FORBIDDEN', 'Admin access is required.')
    }

    return listProperties('admin', filters)
  }

  return listProperties('public', filters, actor?.id)
}

export async function getPropertyForActor(id: string, actor?: AuthUser | null) {
  const property = await findPropertyByIdForViewer(id, actor?.id)
  return ensurePropertyAccess(property, actor ?? null)
}

export async function createPropertyForActor(input: unknown, actor: AuthUser) {
  ensureCanPublish(actor)
  await assertListingCapacity(actor, 'property', await countProperties(actor.id))
  const normalized = normalizeUpsertInput(input)
  const approvalStatus: PropertyApprovalStatus = actor.role === 'admin' ? 'approved' : 'pending_review'
  const now = new Date().toISOString()

  const property = await createProperty({
    id: randomUUID(),
    ...normalized,
    estate: normalized.estate ?? null,
    latitude: normalized.latitude ?? null,
    longitude: normalized.longitude ?? null,
    videoUrl: normalized.videoUrl ?? null,
    documentInfo: normalized.documentInfo ?? null,
    verificationStatus: normalized.verificationStatus ?? 'not_requested',
    featured: normalized.featured ?? false,
    referenceCode: buildReferenceCode(normalized),
    approvalStatus,
    createdByUserId: actor.id,
    createdByName: actor.name,
    createdByEmail: actor.email,
    createdByRole: actor.role,
    approvedByUserId: actor.role === 'admin' ? actor.id : null,
    approvedAt: actor.role === 'admin' ? now : null,
    rejectionReason: null,
    createdAt: now,
    updatedAt: now,
  })

  if (!property) {
    throw new ApiError(500, 'PROPERTY_CREATE_FAILED', 'Unable to create property.')
  }

  await sendPropertyCreatedEmails(property)
  await createUserNotification({
    userId: actor.id,
    title: 'Property submitted',
    message:
      approvalStatus === 'approved'
        ? `"${property.title}" is now live on ULO.`
        : `"${property.title}" was submitted and is pending admin review.`,
    href: '/dashboard/properties',
  })
  return property
}

export async function listSavedProperties(actor: AuthUser) {
  return listSavedPropertiesForUser(actor.id)
}

export async function saveProperty(actor: AuthUser, propertyId: string) {
  const property = await findPropertyById(propertyId)
  if (!property || property.approvalStatus !== 'approved' || property.status !== 'active') {
    throw new ApiError(404, 'PROPERTY_NOT_FOUND', 'Property not found.')
  }
  await savePropertyForUser({ id: randomUUID(), userId: actor.id, propertyId })
}

export async function unsaveProperty(actor: AuthUser, propertyId: string) {
  await removeSavedPropertyForUser(actor.id, propertyId)
}

export async function trackPropertyView(propertyId: string, actor?: AuthUser | null, viewerSessionKey?: string | null) {
  const property = await findPropertyById(propertyId)
  if (!property) return
  await recordPropertyView({
    id: randomUUID(),
    propertyId,
    viewerUserId: actor?.id ?? null,
    viewerSessionKey: viewerSessionKey ?? null,
  })
}

export async function updatePropertyForActor(id: string, input: unknown, actor: AuthUser) {
  ensureCanPublish(actor)
  const normalized = normalizeUpsertInput(input)
  const existing = await findPropertyById(id)

  if (!existing) {
    throw new ApiError(404, 'PROPERTY_NOT_FOUND', 'Property not found.')
  }

  if (actor.role !== 'admin' && existing.createdByUserId !== actor.id) {
    throw new ApiError(403, 'FORBIDDEN', 'You do not have access to update this property.')
  }

  const nextApprovalStatus: PropertyApprovalStatus =
    actor.role === 'admin'
      ? normalized.featured
        ? existing.approvalStatus
        : existing.approvalStatus
      : existing.approvalStatus === 'approved'
        ? 'pending_review'
        : existing.approvalStatus === 'rejected'
          ? 'pending_review'
          : existing.approvalStatus

  const property = await updateProperty(id, {
    ...normalized,
    referenceCode: buildReferenceCode(normalized),
    approvalStatus: actor.role === 'admin' ? existing.approvalStatus : nextApprovalStatus,
    approvedByUserId: actor.role === 'admin' ? existing.approvedByUserId : null,
    approvedAt: actor.role === 'admin' ? existing.approvedAt : null,
    rejectionReason: actor.role === 'admin' ? existing.rejectionReason : null,
  })

  if (!property) {
    throw new ApiError(500, 'PROPERTY_UPDATE_FAILED', 'Unable to update property.')
  }

  return property
}

export async function deletePropertyForActor(id: string, actor: AuthUser) {
  const existing = await findPropertyById(id)

  if (!existing) {
    throw new ApiError(404, 'PROPERTY_NOT_FOUND', 'Property not found.')
  }

  if (actor.role !== 'admin' && existing.createdByUserId !== actor.id) {
    throw new ApiError(403, 'FORBIDDEN', 'You do not have access to delete this property.')
  }

  await deleteProperty(id)
}

export async function setPropertyApprovalForAdmin(
  id: string,
  input: unknown,
  actor: AuthUser
) {
  if (actor.role !== 'admin') {
    throw new ApiError(403, 'FORBIDDEN', 'Admin access is required.')
  }

  const parsed = z
    .object({
      approvalStatus: z.enum(['approved', 'rejected', 'pending_review']),
      rejectionReason: z.string().trim().optional().nullable(),
    })
    .safeParse(input)

  if (!parsed.success) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Please provide a valid approval update.', parsed.error.flatten())
  }

  const existing = await findPropertyById(id)

  if (!existing) {
    throw new ApiError(404, 'PROPERTY_NOT_FOUND', 'Property not found.')
  }

  const approvalStatus = parsed.data.approvalStatus
  const property = await updatePropertyApproval(id, {
    approvalStatus,
    approvedByUserId: approvalStatus === 'approved' ? actor.id : null,
    approvedAt: approvalStatus === 'approved' ? new Date().toISOString() : null,
    rejectionReason: approvalStatus === 'rejected' ? parsed.data.rejectionReason || 'Rejected by admin.' : null,
  })

  if (!property) {
    throw new ApiError(500, 'PROPERTY_APPROVAL_FAILED', 'Unable to update property approval.')
  }

  if (approvalStatus === 'approved' || approvalStatus === 'rejected') {
    await sendPropertyApprovalEmail(property)
    await createUserNotification({
      userId: property.createdByUserId,
      title: approvalStatus === 'approved' ? 'Property approved' : 'Property rejected',
      message:
        approvalStatus === 'approved'
          ? `"${property.title}" has been approved and is now visible on the platform.`
          : `"${property.title}" was rejected.${property.rejectionReason ? ` Reason: ${property.rejectionReason}` : ''}`,
      href: '/dashboard/properties',
    })
  }
  return property
}
