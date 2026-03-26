export type UserRole = 'user' | 'admin'
export type AccountType = 'user' | 'agent' | 'landlord' | 'hotel_manager'
export type IdentityType = 'nin' | 'bvn'
export type AccountStatus = 'active' | 'disabled'
export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export interface AuthUser {
  id: string
  name: string
  email: string
  profileImageUrl?: string | null
  role: UserRole
  accountType?: AccountType
  status?: AccountStatus
  approvalStatus?: ApprovalStatus
  phone?: string | null
  address?: string | null
  state?: string | null
  localGovernment?: string | null
  identityType?: IdentityType | null
  identityNumber?: string | null
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
