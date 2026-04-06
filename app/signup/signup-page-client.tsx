'use client'

import React from 'react'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

import { useAuth } from '@/components/providers/auth-provider'
import { ApiClientError } from '@/lib/client/api-error'
import { signupRequest, verifySignupOtpRequest } from '@/lib/client/auth-client'

export default function SignupPageClient() {
  const router = useRouter()
  const { setUser } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState<'details' | 'otp'>('details')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    state: '',
    localGovernment: '',
    accountType: 'user',
    identityType: 'nin',
    identityNumber: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })
  const [verificationToken, setVerificationToken] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.currentTarget
    const checked =
      e.currentTarget instanceof HTMLInputElement ? e.currentTarget.checked : false
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!formData.agreeToTerms) {
      setError('You must agree to the terms and conditions')
      return
    }

    setIsLoading(true)

    try {
      const response = await signupRequest({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        state: formData.state,
        localGovernment: formData.localGovernment,
        accountType: formData.accountType as 'user' | 'agent' | 'landlord' | 'hotel_manager',
        identityType:
          formData.accountType === 'user'
            ? null
            : (formData.identityType as 'nin' | 'bvn'),
        identityNumber: formData.accountType === 'user' ? null : formData.identityNumber,
        password: formData.password,
        agreeToTerms: formData.agreeToTerms,
      })
      setVerificationToken(response.verificationToken)
      setStep('otp')
      toast.success(`Verification code sent to ${response.email}.`)
    } catch (err) {
      const message =
        err instanceof ApiClientError ? err.message : 'Unable to send your verification code right now.'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (otp.length !== 6) {
      setError('Enter the 6-digit verification code.')
      return
    }

    setIsLoading(true)

    try {
      const response = await verifySignupOtpRequest({ verificationToken, otp })
      setUser(response.user)
      toast.success('Account created successfully.')
      router.push(response.redirectPath)
      router.refresh()
    } catch (err) {
      const message =
        err instanceof ApiClientError ? err.message : 'Unable to verify your code right now.'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://images.pexels.com/photos/7546323/pexels-photo-7546323.jpeg')" }} />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-12 text-center text-white">
          <div className="mb-8">
            <Image
              src="/brand/logo-white.svg"
              alt="ULO"
              width={220}
              height={72}
              className="h-16 w-auto"
              priority
            />
          </div>
          <h2 className="text-4xl font-serif font-bold mb-4">Start your property journey today</h2>
          <p className="text-white/80 text-lg max-w-md">
            Create an account to save listings, get personalized recommendations, and connect with agents.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-12 bg-white">
        <div className="lg:hidden flex items-center justify-center mb-8">
          <Image
            src="/brand/logo-primary.svg"
            alt="ULO"
            width={220}
            height={72}
            className="h-14 w-auto"
            priority
          />
        </div>

        <div className="w-full max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-500 mb-8">
            {step === 'details'
              ? 'Join us and start managing properties'
              : `Enter the code sent to ${formData.email}`}
          </p>

          <form onSubmit={step === 'details' ? handleSignup : handleVerifyOtp} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {step === 'details' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <Input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleInputChange} required className="h-11 bg-gray-50 border-gray-200 focus:bg-white" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <Input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleInputChange} required className="h-11 bg-gray-50 border-gray-200 focus:bg-white" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <Input type="tel" name="phone" placeholder="+234..." value={formData.phone} onChange={handleInputChange} required className="h-11 bg-gray-50 border-gray-200 focus:bg-white" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">House Address</label>
                  <Input type="text" name="address" placeholder="Your house address" value={formData.address} onChange={handleInputChange} required className="h-11 bg-gray-50 border-gray-200 focus:bg-white" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <Input type="text" name="state" placeholder="Lagos" value={formData.state} onChange={handleInputChange} required className="h-11 bg-gray-50 border-gray-200 focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Local Government</label>
                    <Input type="text" name="localGovernment" placeholder="Ikeja" value={formData.localGovernment} onChange={handleInputChange} required className="h-11 bg-gray-50 border-gray-200 focus:bg-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                  <select
                    name="accountType"
                    value={formData.accountType}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        accountType: event.target.value,
                        identityNumber: event.target.value === 'user' ? '' : prev.identityNumber,
                      }))
                    }
                    className="h-11 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm focus:bg-white"
                  >
                    <option value="user">User</option>
                    <option value="agent">Agent</option>
                    <option value="landlord">Landlord</option>
                    <option value="hotel_manager">Hotel Manager</option>
                  </select>
                </div>

                {formData.accountType !== 'user' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Means of Identity</label>
                      <select
                        name="identityType"
                        value={formData.identityType}
                        onChange={handleInputChange}
                        className="h-11 w-full rounded-md border border-gray-200 bg-gray-50 px-3 text-sm focus:bg-white"
                      >
                        <option value="nin">NIN</option>
                        <option value="bvn">BVN</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Identity Number</label>
                      <Input type="text" name="identityNumber" placeholder="Enter identity number" value={formData.identityNumber} onChange={handleInputChange} required className="h-11 bg-gray-50 border-gray-200 focus:bg-white" />
                    </div>
                  </div>
                ) : null}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Input type={showPassword ? 'text' : 'password'} name="password" placeholder="••••••••" value={formData.password} onChange={handleInputChange} required className="h-11 pr-10 bg-gray-50 border-gray-200 focus:bg-white" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Minimum 8 characters with uppercase, lowercase, and numbers</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleInputChange} required className="h-11 pr-10 bg-gray-50 border-gray-200 focus:bg-white" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, agreeToTerms: checked as boolean }))
                    }
                    className="mt-1 border-gray-300"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                    I agree to the{' '}
                    <Link href="#" className="text-gray-900 hover:underline">Terms & Conditions</Link>{' '}
                    and{' '}
                    <Link href="#" className="text-gray-900 hover:underline">Privacy Policy</Link>
                  </label>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-medium text-base rounded-lg">
                  {isLoading ? 'Sending code...' : 'Send Verification Code'}
                </Button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Verification Code</label>
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup className="w-full justify-between">
                      <InputOTPSlot index={0} className="h-12 w-12 rounded-md border" />
                      <InputOTPSlot index={1} className="h-12 w-12 rounded-md border" />
                      <InputOTPSlot index={2} className="h-12 w-12 rounded-md border" />
                      <InputOTPSlot index={3} className="h-12 w-12 rounded-md border" />
                      <InputOTPSlot index={4} className="h-12 w-12 rounded-md border" />
                      <InputOTPSlot index={5} className="h-12 w-12 rounded-md border" />
                    </InputOTPGroup>
                  </InputOTP>
                  <p className="mt-3 text-sm text-gray-500">Enter the 6-digit code sent to your email.</p>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-medium text-base rounded-lg">
                  {isLoading ? 'Verifying...' : 'Verify and Create Account'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 rounded-lg"
                  onClick={() => {
                    setStep('details')
                    setOtp('')
                    setError('')
                  }}
                >
                  Change Details
                </Button>
              </>
            )}
          </form>

          {/* <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </div> */}

          {/* <Button type="button" variant="outline" className="w-full h-11 border border-gray-200 hover:bg-gray-50 bg-transparent rounded-lg">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button> */}

          <p className="text-center text-gray-600 mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-gray-900 hover:text-gray-700 font-medium transition">
              Sign in
            </Link>
          </p>
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700 transition">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
