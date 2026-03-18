'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import type { AuthUser } from '@/lib/auth/types'
import { ApiClientError } from '@/lib/client/api-error'
import { loginRequest, logoutRequest, meRequest, signupRequest } from '@/lib/client/auth-client'

type AuthContextValue = {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: AuthUser | null) => void
  refreshSession: () => Promise<AuthUser | null>
  login: (input: { email: string; password: string }) => Promise<{ user: AuthUser; redirectPath: string }>
  signup: (input: {
    name: string
    email: string
    password: string
    agreeToTerms: boolean
  }) => Promise<{ user: AuthUser; redirectPath: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshSession = async () => {
    try {
      const response = await meRequest()
      setUser(response.user)
      return response.user
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        setUser(null)
        return null
      }

      throw error
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void refreshSession()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      setUser,
      refreshSession,
      login: async (input) => {
        const response = await loginRequest(input)
        setUser(response.user)
        return response
      },
      signup: async (input) => {
        const response = await signupRequest(input)
        setUser(response.user)
        return response
      },
      logout: async () => {
        await logoutRequest()
        setUser(null)
      },
    }),
    [isLoading, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
