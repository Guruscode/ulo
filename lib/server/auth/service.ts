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
import {
  assertSignupVerificationUsable,
  consumeSignupVerification,
  createSignupVerification,
  findSignupVerificationById,
  generateOtp,
  hashOtp,
  incrementSignupVerificationAttempts,
} from '@/lib/server/auth/signup-verification'
import { createSessionToken, verifySessionToken } from '@/lib/server/auth/session'
import { getServerEnv } from '@/lib/server/config/env'
import { sendSignupOtpEmail, sendWelcomeEmail } from '@/lib/server/mail/notifications'

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
  email: z.string().trim().email('A valid email is required.'),
  phone: z.string().trim().min(7, 'Phone number is required.'),
  address: z.string().trim().min(5, 'House address is required.'),
  state: z.string().trim().min(2, 'State is required.'),
  localGovernment: z.string().trim().min(2, 'Local government is required.'),
  accountType: z.enum(['user', 'agent', 'landlord', 'hotel_manager']),
  identityType: z.enum(['nin', 'bvn']).optional().nullable(),
  identityNumber: z.string().trim().optional().nullable(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .regex(/[A-Z]/, 'Password must include an uppercase letter.')
    .regex(/[a-z]/, 'Password must include a lowercase letter.')
    .regex(/[0-9]/, 'Password must include a number.'),
  agreeToTerms: z.boolean().refine(Boolean, 'You must agree to the terms.'),
}).superRefine((data, ctx) => {
  if (data.accountType !== 'user') {
    if (!data.identityType) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['identityType'], message: 'Identity type is required.' })
    }
    if (!data.identityNumber?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['identityNumber'], message: 'Identity number is required.' })
    }
  }
})

const loginSchema = z.object({
  email: z.string().trim().email('A valid email is required.'),
  password: z.string().min(1, 'Password is required.'),
})

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
  email: z.string().trim().email('A valid email is required.'),
  profileImageUrl: z.string().trim().optional().nullable().or(z.literal('')),
  phone: z.string().trim().optional().or(z.literal('')),
  address: z.string().trim().optional().or(z.literal('')),
  state: z.string().trim().optional().or(z.literal('')),
  localGovernment: z.string().trim().optional().or(z.literal('')),
  identityType: z.enum(['nin', 'bvn']).optional().nullable(),
  identityNumber: z.string().trim().optional().nullable().or(z.literal('')),
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
    profileImageUrl: user.profileImageUrl ?? null,
    role: user.role,
    accountType: user.accountType,
    status: user.status,
    approvalStatus: user.approvalStatus,
    phone: user.phone ?? null,
    address: user.address ?? null,
    state: user.state ?? null,
    localGovernment: user.localGovernment ?? null,
    identityType: user.identityType ?? null,
    identityNumber: user.identityNumber ?? null,
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

export async function requestSignupOtp(input: unknown) {
  await ensureAdminSeeded()

  const parsed = registerSchema.safeParse(input)

  if (!parsed.success) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Please correct the highlighted fields.', parsed.error.flatten())
  }

  const {
    name,
    email,
    phone,
    address,
    state,
    localGovernment,
    accountType,
    identityType,
    identityNumber,
    password,
  } = parsed.data
  const existingUser = await findUserByEmail(email)

  if (existingUser) {
    throw new ApiError(409, 'EMAIL_ALREADY_IN_USE', 'An account with this email already exists.')
  }

  const passwordHash = await hashPassword(password)
  const otp = generateOtp()
  const verificationToken = await createSignupVerification({
    name,
    email,
    phone,
    address,
    state,
    localGovernment,
    accountType,
    identityType,
    identityNumber,
    passwordHash,
    otpHash: hashOtp(otp),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  })

  await sendSignupOtpEmail({ email, name, otp })

  return {
    verificationToken,
    email: email.toLowerCase(),
    expiresInMinutes: 10,
  }
}

export async function verifySignupOtp(input: unknown) {
  await ensureAdminSeeded()

  const parsed = z.object({
    verificationToken: z.string().trim().min(1, 'Verification token is required.'),
    otp: z.string().trim().regex(/^\d{6}$/, 'A valid 6-digit OTP is required.'),
  }).safeParse(input)

  if (!parsed.success) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Please provide a valid verification code.', parsed.error.flatten())
  }

  const verification = await findSignupVerificationById(parsed.data.verificationToken)
  if (!verification) {
    throw new ApiError(404, 'OTP_NOT_FOUND', 'Verification request not found. Request a new code.')
  }

  assertSignupVerificationUsable(verification)

  if (verification.otpHash !== hashOtp(parsed.data.otp)) {
    await incrementSignupVerificationAttempts(verification.id)
    throw new ApiError(400, 'INVALID_OTP', 'The verification code is incorrect.')
  }

  const existingUser = await findUserByEmail(verification.email)
  if (existingUser) {
    throw new ApiError(409, 'EMAIL_ALREADY_IN_USE', 'An account with this email already exists.')
  }

  const user = await createUser({
    id: randomUUID(),
    name: verification.name,
    email: verification.email,
    passwordHash: verification.passwordHash,
    role: 'user',
    phone: verification.phone,
    address: verification.address,
    state: verification.state,
    localGovernment: verification.localGovernment,
    accountType: verification.accountType,
    approvalStatus: verification.accountType === 'user' ? 'approved' : 'pending',
    identityType: verification.identityType,
    identityNumber: verification.identityNumber,
  })

  if (!user) {
    throw new ApiError(500, 'USER_CREATION_FAILED', 'We could not create your account.')
  }

  await consumeSignupVerification(verification.id)

  const sessionToken = await createSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })

  const authUser = toAuthUser(user)
  await sendWelcomeEmail(authUser)

  return {
    user: authUser,
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
    profileImageUrl: parsed.data.profileImageUrl || null,
    phone: parsed.data.phone || null,
    address: parsed.data.address || null,
    state: parsed.data.state || null,
    localGovernment: parsed.data.localGovernment || null,
    identityType: parsed.data.identityType ?? null,
    identityNumber: parsed.data.identityNumber || null,
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
