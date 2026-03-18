export type UserRole = 'user' | 'admin'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string | null
  timezone?: string | null
  emailNotifications?: boolean
  pushNotifications?: boolean
  twoFactorEnabled?: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthSessionPayload {
  sub: string
  email: string
  name: string
  role: UserRole
}

export interface ApiErrorPayload {
  code: string
  message: string
  details?: unknown
}

export interface ApiSuccess<T> {
  success: true
  data: T
  message?: string
}

export interface ApiFailure {
  success: false
  error: ApiErrorPayload
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure
