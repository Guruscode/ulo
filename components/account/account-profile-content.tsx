'use client'

import { useEffect, useState } from 'react'
import { Shield, User } from 'lucide-react'
import { toast } from 'sonner'

import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ApiClientError } from '@/lib/client/api-error'
import { accountRequest, updateAccountRequest, updatePasswordRequest } from '@/lib/client/account-client'

type ProfileForm = {
  name: string
  email: string
  phone: string
  timezone: string
}

const DEFAULT_PROFILE_FORM: ProfileForm = {
  name: '',
  email: '',
  phone: '',
  timezone: 'Africa/Lagos',
}

export function AccountProfileContent({
  title,
  description,
  roleLabel,
}: {
  title: string
  description: string
  roleLabel: string
}) {
  const { user, isLoading, setUser } = useAuth()
  const [profile, setProfile] = useState<ProfileForm>(DEFAULT_PROFILE_FORM)
  const [profileSaving, setProfileSaving] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [accountLoaded, setAccountLoaded] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (isLoading || accountLoaded) {
      return
    }

    const loadAccount = async () => {
      try {
        const response = await accountRequest()
        setUser(response.user)
        setProfile({
          name: response.user.name || '',
          email: response.user.email || '',
          phone: response.user.phone || '',
          timezone: response.user.timezone || 'Africa/Lagos',
        })
        setAccountLoaded(true)
      } catch (error) {
        const message =
          error instanceof ApiClientError ? error.message : 'Unable to load your profile right now.'
        toast.error(message)
      }
    }

    void loadAccount()
  }, [accountLoaded, isLoading, setUser])

  const handleSaveProfile = async () => {
    setProfileSaving(true)

    try {
      const response = await updateAccountRequest({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        timezone: profile.timezone,
        emailNotifications: user?.emailNotifications ?? true,
        pushNotifications: user?.pushNotifications ?? false,
        twoFactorEnabled: user?.twoFactorEnabled ?? false,
      })

      setUser(response.user)
      setProfile({
        name: response.user.name || '',
        email: response.user.email || '',
        phone: response.user.phone || '',
        timezone: response.user.timezone || 'Africa/Lagos',
      })
      toast.success('Profile updated successfully.')
    } catch (error) {
      const message =
        error instanceof ApiClientError ? error.message : 'Unable to save your profile right now.'
      toast.error(message)
    } finally {
      setProfileSaving(false)
    }
  }

  const handleChangePassword = async () => {
    setPasswordSaving(true)

    try {
      await updatePasswordRequest(passwordForm)
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      toast.success('Password updated successfully.')
    } catch (error) {
      const message =
        error instanceof ApiClientError ? error.message : 'Unable to update your password right now.'
      toast.error(message)
    } finally {
      setPasswordSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{title}</h1>
        <p className="mt-1 text-gray-600">{description}</p>
      </div>

      <Card className="bg-white p-6">
        <div className="mb-6 flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-secondary">
            <User className="h-10 w-10 text-white" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{user?.name || 'Loading...'}</p>
            <p className="text-gray-500">{roleLabel}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Full Name</Label>
            <Input
              id="profile-name"
              value={profile.name}
              onChange={(event) => setProfile({ ...profile, name: event.target.value })}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-email">Email Address</Label>
            <Input
              id="profile-email"
              type="email"
              value={profile.email}
              onChange={(event) => setProfile({ ...profile, email: event.target.value })}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-phone">Phone Number</Label>
            <Input
              id="profile-phone"
              type="tel"
              value={profile.phone}
              onChange={(event) => setProfile({ ...profile, phone: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-timezone">Timezone</Label>
            <Input
              id="profile-timezone"
              value={profile.timezone}
              onChange={(event) => setProfile({ ...profile, timezone: event.target.value })}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            className="bg-secondary text-white hover:bg-secondary/90"
            onClick={handleSaveProfile}
            disabled={profileSaving || isLoading}
          >
            {profileSaving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </Card>

      <Card className="bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <Shield className="h-5 w-5 text-gray-500" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Security</h2>
            <p className="text-sm text-gray-500">Update your password for this account.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(event) =>
                setPasswordForm({ ...passwordForm, currentPassword: event.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(event) =>
                setPasswordForm({ ...passwordForm, newPassword: event.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(event) =>
                setPasswordForm({ ...passwordForm, confirmPassword: event.target.value })
              }
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            variant="outline"
            className="border-gray-200"
            onClick={handleChangePassword}
            disabled={passwordSaving}
          >
            {passwordSaving ? 'Updating...' : 'Change Password'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
