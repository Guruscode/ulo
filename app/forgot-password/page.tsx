'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Landmark, Mail, CheckCircle, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 via-white to-secondary/5 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white p-8 shadow-xl">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-secondary">ULO</span>
          </div>

          {!isSubmitted ? (
            <>
              <h1 className="text-3xl font-bold text-foreground mb-2 text-center">Reset Password</h1>
              <p className="text-foreground/60 text-center mb-8">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11 pl-10"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-secondary hover:bg-secondary/90 text-white font-medium text-base"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>

              {/* Back to Login */}
              <div className="mt-8 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 font-medium transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                  className="mb-6"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                </motion.div>

                <h2 className="text-2xl font-bold text-foreground mb-2">Check Your Email</h2>
                <p className="text-foreground/60 mb-4">
                  We've sent a password reset link to <span className="font-medium">{email}</span>
                </p>
                <p className="text-sm text-foreground/60 mb-8">
                  The link will expire in 24 hours. If you don't see the email, check your spam folder.
                </p>

                <div className="space-y-3">
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="w-full border border-gray-200 hover:bg-gray-50"
                  >
                    Try Another Email
                  </Button>
                  <Link href="/login">
                    <Button className="w-full bg-secondary hover:bg-secondary/90 text-white">
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-foreground/60">
          <Link href="/" className="hover:text-foreground transition">
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
