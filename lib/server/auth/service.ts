import { randomUUID } from 'crypto'
import { z } from 'zod'

import type { AuthUser } from '@/lib/auth/types'
import { ApiError } from '@/lib/server/http/api-error'
import { hashPassword, verifyPassword } from '@/lib/server/auth/password'
import {
  createUser,
  findUserByEmail,
  findUserById,
  type UserRecord,
  updateLastLogin,
  updateUserPassword,
  updateUserProfile,
  upsertAdminUser,
} from '@/lib/server/auth/repository'
import { createSessionToken, verifySessionToken } from '@/lib/server/auth/session'
import { getServerEnv } from '@/lib/server/config/env'

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
  email: z.string().trim().email('A valid email is required.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .regex(/[A-Z]/, 'Password must include an uppercase letter.')
    .regex(/[a-z]/, 'Password must include a lowercase letter.')
    .regex(/[0-9]/, 'Password must include a number.'),
  agreeToTerms: z.boolean().refine(Boolean, 'You must agree to the terms.'),
})

const loginSchema = z.object({
  email: z.string().trim().email('A valid email is required.'),
  password: z.string().min(1, 'Password is required.'),
})

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
  email: z.string().trim().email('A valid email is required.'),
  phone: z.string().trim().optional().or(z.literal('')),
  timezone: z.string().trim().min(1, 'Timezone is required.'),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  twoFactorEnabled: z.boolean(),
})

const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required.'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .regex(/[A-Z]/, 'Password must include an uppercase letter.')
      .regex(/[a-z]/, 'Password must include a lowercase letter.')
      .regex(/[0-9]/, 'Password must include a number.'),
    confirmPassword: z.string().min(1, 'Please confirm your new password.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  })

function toAuthUser(user: UserRecord): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone ?? null,
    timezone: user.timezone ?? null,
    emailNotifications: user.emailNotifications,
    pushNotifications: user.pushNotifications,
    twoFactorEnabled: user.twoFactorEnabled,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

export async function ensureAdminSeeded() {
  const env = getServerEnv()

  if (!env.adminEmail || !env.adminPassword || !env.adminName) {
    return null
  }

  const passwordHash = await hashPassword(env.adminPassword)

  return upsertAdminUser({
    id: randomUUID(),
    name: env.adminName,
    email: env.adminEmail,
    passwordHash,
  })
}

export async function registerUser(input: unknown) {
  await ensureAdminSeeded()

  const parsed = registerSchema.safeParse(input)

  if (!parsed.success) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Please correct the highlighted fields.', parsed.error.flatten())
  }

  const { name, email, password } = parsed.data
  const existingUser = await findUserByEmail(email)

  if (existingUser) {
    throw new ApiError(409, 'EMAIL_ALREADY_IN_USE', 'An account with this email already exists.')
  }

  const passwordHash = await hashPassword(password)
  const user = await createUser({
    id: randomUUID(),
    name,
    email,
    passwordHash,
    role: 'user',
  })

  if (!user) {
    throw new ApiError(500, 'USER_CREATION_FAILED', 'We could not create your account.')
  }

  const sessionToken = await createSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })

  return {
    user: toAuthUser(user),
    sessionToken,
  }
}

export async function loginUser(input: unknown) {
  await ensureAdminSeeded()

  const parsed = loginSchema.safeParse(input)

  if (!parsed.success) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Please enter a valid email and password.', parsed.error.flatten())
  }

  const { email, password } = parsed.data
  const user = await findUserByEmail(email)

  if (!user || !user.isActive) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.')
  }

  const passwordMatches = await verifyPassword(password, user.passwordHash)

  if (!passwordMatches) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.')
  }

  await updateLastLogin(user.id)

  const sessionToken = await createSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })

  return {
    user: toAuthUser(user),
    sessionToken,
  }
}

export async function getUserFromSessionToken(token: string) {
  const session = await verifySessionToken(token)
  const user = await findUserById(session.sub)

  if (!user || !user.isActive) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Your session is no longer valid.')
  }

  return toAuthUser(user)
}

export async function updateAuthenticatedUserProfile(userId: string, input: unknown) {
  const parsed = profileSchema.safeParse(input)

  if (!parsed.success) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Please correct the highlighted fields.', parsed.error.flatten())
  }

  const existingUser = await findUserById(userId)

  if (!existingUser) {
    throw new ApiError(404, 'USER_NOT_FOUND', 'User not found.')
  }

  if (existingUser.email !== parsed.data.email.toLowerCase()) {
    const existingEmailUser = await findUserByEmail(parsed.data.email)
    if (existingEmailUser && existingEmailUser.id !== userId) {
      throw new ApiError(409, 'EMAIL_ALREADY_IN_USE', 'An account with this email already exists.')
    }
  }

  const updatedUser = await updateUserProfile(userId, {
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    timezone: parsed.data.timezone,
    emailNotifications: parsed.data.emailNotifications,
    pushNotifications: parsed.data.pushNotifications,
    twoFactorEnabled: parsed.data.twoFactorEnabled,
  })

  if (!updatedUser) {
    throw new ApiError(500, 'USER_UPDATE_FAILED', 'Unable to save your settings.')
  }

  const sessionToken = await createSessionToken({
    sub: updatedUser.id,
    email: updatedUser.email,
    name: updatedUser.name,
    role: updatedUser.role,
  })

  return {
    user: toAuthUser(updatedUser),
    sessionToken,
  }
}

export async function updateAuthenticatedUserPassword(userId: string, input: unknown) {
  const parsed = passwordUpdateSchema.safeParse(input)

  if (!parsed.success) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Please correct the password fields.', parsed.error.flatten())
  }

  const user = await findUserById(userId)

  if (!user) {
    throw new ApiError(404, 'USER_NOT_FOUND', 'User not found.')
  }

  const currentPasswordMatches = await verifyPassword(parsed.data.currentPassword, user.passwordHash)

  if (!currentPasswordMatches) {
    throw new ApiError(400, 'INVALID_CURRENT_PASSWORD', 'Current password is incorrect.')
  }

  const nextPasswordHash = await hashPassword(parsed.data.newPassword)
  await updateUserPassword(userId, nextPasswordHash)
}
