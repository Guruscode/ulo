'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Landmark, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      router.push('/dashboard')
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image with centered text */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/home.jpeg')" }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-12 text-center text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Landmark className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight">ULO</span>
          </div>
          <h2 className="text-4xl font-serif font-bold mb-4">
            Find your perfect home with confidence
          </h2>
          <p className="text-white/80 text-lg max-w-md">
            Join thousands of happy renters and homeowners who found their dream property through ULO.
          </p>
        </div>
      </div>

      {/* Right side - Form (full width, no container) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-12 bg-white">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
            <Landmark className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">ULO</span>
        </div>

        <div className="w-full max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500 mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10 bg-gray-50 border-gray-200 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-medium text-base rounded-lg"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google SSO Only */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 border border-gray-200 hover:bg-gray-50 bg-transparent rounded-lg"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 mt-8">
            Don't have an account?{' '}
            <Link href="/signup" className="text-gray-900 hover:text-gray-700 font-medium transition">
              Create one
            </Link>
          </p>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700 transition">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}

