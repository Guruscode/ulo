import { z } from 'zod'

import type { AuthUser } from '@/lib/auth/types'
import { ApiError } from '@/lib/server/http/api-error'
import { findUserById, listUsers, updateUserAdminFields } from '@/lib/server/auth/repository'

const adminUserUpdateSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().optional().nullable(),
  address: z.string().trim().optional().nullable(),
  state: z.string().trim().optional().nullable(),
  localGovernment: z.string().trim().optional().nullable(),
  accountType: z.enum(['user', 'agent', 'landlord', 'hotel_manager']),
  approvalStatus: z.enum(['pending', 'approved', 'rejected']),
  identityType: z.enum(['bvn']).optional().nullable(),
  identityNumber: z.string().trim().optional().nullable(),
  isActive: z.boolean(),
  propertyListingLimit: z.number().int().min(-1).optional().nullable(),
  hotelListingLimit: z.number().int().min(-1).optional().nullable(),
}).superRefine((data, ctx) => {
  if (data.accountType !== 'user' && !data.identityNumber?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['identityNumber'], message: 'Identity number is required.' })
  }
})

function requireAdmin(actor: AuthUser) {
  if (actor.role !== 'admin') {
    throw new ApiError(403, 'FORBIDDEN', 'Admin access is required.')
  }
}

export async function listUsersForAdmin(actor: AuthUser, filters?: { search?: string; accountType?: string; approvalStatus?: string }) {
  requireAdmin(actor)
  return listUsers(filters)
}

export async function listPublicAgents() {
  const users = await listUsers({ accountType: 'agent', approvalStatus: 'approved' })
  return users.filter((user) => user.status === 'active')
}

export async function getPublicAgentById(id: string) {
  const user = await findUserById(id)
  if (!user || user.accountType !== 'agent' || user.approvalStatus !== 'approved' || user.status !== 'active') {
    throw new ApiError(404, 'AGENT_NOT_FOUND', 'Agent not found.')
  }
  return user
}

export async function updateUserForAdmin(actor: AuthUser, id: string, input: unknown) {
  requireAdmin(actor)
  const parsed = adminUserUpdateSchema.safeParse(input)
  if (!parsed.success) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Please correct the user fields.', parsed.error.flatten())
  }

  const existing = await findUserById(id)
  if (!existing) {
    throw new ApiError(404, 'USER_NOT_FOUND', 'User not found.')
  }

  const updated = await updateUserAdminFields(id, {
    ...parsed.data,
    phone: parsed.data.phone || null,
    address: parsed.data.address || null,
    state: parsed.data.state || null,
    localGovernment: parsed.data.localGovernment || null,
    identityType: parsed.data.identityType ?? null,
    identityNumber: parsed.data.identityNumber || null,
    propertyListingLimit: parsed.data.propertyListingLimit ?? null,
    hotelListingLimit: parsed.data.hotelListingLimit ?? null,
  })

  if (!updated) {
    throw new ApiError(500, 'USER_UPDATE_FAILED', 'Unable to update user.')
  }

  return updated
}
