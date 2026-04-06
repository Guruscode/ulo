'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { User, Shield, Bell, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import DashboardLayout from '@/components/dashboard/dashboard-layout'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileUpload } from '@/components/ui/file-upload'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ApiClientError } from '@/lib/client/api-error'
import { updateAccountRequest, updatePasswordRequest } from '@/lib/client/account-client'
import { accountRequest } from '@/lib/client/account-client'
import type { AccountType, IdentityType } from '@/lib/auth/types'

type SettingsForm = {
  name: string
  email: string
  profileImageUrl: string
  phone: string
  address: string
  state: string
  localGovernment: string
  accountType: AccountType
  identityType: IdentityType | ''
  identityNumber: string
  timezone: string
  emailNotifications: boolean
  pushNotifications: boolean
  twoFactorEnabled: boolean
}

const DEFAULT_SETTINGS: SettingsForm = {
  name: '',
  email: '',
  profileImageUrl: '',
  phone: '',
  address: '',
  state: '',
  localGovernment: '',
  accountType: 'user',
  identityType: '',
  identityNumber: '',
  timezone: 'Africa/Lagos',
  emailNotifications: true,
  pushNotifications: false,
  twoFactorEnabled: false,
}

export default function DashboardSettingsPage() {
  const { user, isLoading, setUser } = useAuth()
  const [settings, setSettings] = useState<SettingsForm>(DEFAULT_SETTINGS)
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
        setSettings({
          name: response.user.name || '',
          email: response.user.email || '',
          profileImageUrl: response.user.profileImageUrl || '',
          phone: response.user.phone || '',
          address: response.user.address || '',
          state: response.user.state || '',
          localGovernment: response.user.localGovernment || '',
          accountType: response.user.accountType || 'user',
          identityType: response.user.identityType || '',
          identityNumber: response.user.identityNumber || '',
          timezone: response.user.timezone || 'Africa/Lagos',
          emailNotifications: Boolean(response.user.emailNotifications),
          pushNotifications: Boolean(response.user.pushNotifications),
          twoFactorEnabled: Boolean(response.user.twoFactorEnabled),
        })
        setAccountLoaded(true)
      } catch (error) {
        const message =
          error instanceof ApiClientError ? error.message : 'Unable to load your account settings right now.'
        toast.error(message)
      }
    }

    void loadAccount()
  }, [accountLoaded, isLoading, setUser])

  const handleSaveProfile = async () => {
    setProfileSaving(true)

    try {
      const response = await updateAccountRequest({
        name: settings.name,
        email: settings.email,
        profileImageUrl: settings.profileImageUrl || null,
        phone: settings.phone,
        address: settings.address,
        state: settings.state,
        localGovernment: settings.localGovernment,
        identityType: settings.identityType || null,
        identityNumber: settings.identityNumber,
        timezone: settings.timezone,
        emailNotifications: settings.emailNotifications,
        pushNotifications: settings.pushNotifications,
        twoFactorEnabled: settings.twoFactorEnabled,
      })

      setUser(response.user)
      toast.success('Account settings saved.')
    } catch (error) {
      const message =
        error instanceof ApiClientError ? error.message : 'Unable to save your settings right now.'
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

  const requiresIdentity = settings.accountType !== 'user'

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-1">Manage your profile, notifications, and security preferences.</p>
        </div>

        <Card className="bg-white p-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative h-24 w-24 overflow-hidden rounded-full bg-secondary/10 ring-4 ring-secondary/10">
              {settings.profileImageUrl ? (
                <Image
                  src={settings.profileImageUrl}
                  alt={user?.name || 'Profile image'}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-secondary">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              {user?.name ? (
                <p className="font-semibold text-gray-900 text-lg">{user.name}</p>
              ) : (
                <Skeleton className="h-6 w-32" />
              )}
              <p className="text-gray-500">{user?.role === 'admin' ? 'Admin' : settings.accountType.replace('_', ' ')}</p>
              <div className="mt-4 max-w-xs space-y-3">
                <FileUpload
                  id="profile-image-upload"
                  accept="image/*"
                  label={settings.profileImageUrl ? 'Change Profile Photo' : 'Upload Profile Photo'}
                  uploadingLabel="Uploading Photo..."
                  maxSizeMb={4}
                  onUpload={(url) => setSettings((current) => ({ ...current, profileImageUrl: url }))}
                />
                {settings.profileImageUrl ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-gray-200"
                    onClick={() => setSettings((current) => ({ ...current, profileImageUrl: '' }))}
                  >
                    Remove Photo
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} className="h-11" disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} className="h-11" disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountType">Account Type</Label>
              <Input id="accountType" value={settings.accountType.replace('_', ' ')} className="h-11 capitalize" disabled />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">House Address</Label>
              <Input id="address" value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" value={settings.state} onChange={(e) => setSettings({ ...settings, state: e.target.value })} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="localGovernment">Local Government</Label>
              <Input id="localGovernment" value={settings.localGovernment} onChange={(e) => setSettings({ ...settings, localGovernment: e.target.value })} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" value={settings.timezone} onChange={(e) => setSettings({ ...settings, timezone: e.target.value })} className="h-11" />
            </div>
            {requiresIdentity ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="identityType">Identity Type</Label>
                  <Select value={settings.identityType || 'nin'} onValueChange={(value) => setSettings({ ...settings, identityType: value as IdentityType })}>
                    <SelectTrigger id="identityType" className="h-11">
                      <SelectValue placeholder="Select identity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nin">NIN</SelectItem>
                      <SelectItem value="bvn">BVN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="identityNumber">Identity Number</Label>
                  <Input id="identityNumber" value={settings.identityNumber} onChange={(e) => setSettings({ ...settings, identityNumber: e.target.value })} className="h-11" />
                </div>
              </>
            ) : null}
          </div>
          <div className="mt-6 flex justify-end">
            <Button className="bg-secondary hover:bg-secondary/90 text-white" onClick={handleSaveProfile} disabled={profileSaving || isLoading}>
              {profileSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </Card>

        <Card className="bg-white p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive account and property updates by email.</p>
                </div>
              </div>
              <Switch checked={settings.emailNotifications} onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })} />
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-500">Get instant alerts when activity happens on your account.</p>
                </div>
              </div>
              <Switch checked={settings.pushNotifications} onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })} />
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Preference</p>
                  <p className="text-sm text-gray-500">Save whether you want additional verification on sign-in.</p>
                </div>
              </div>
              <Switch checked={settings.twoFactorEnabled} onCheckedChange={(checked) => setSettings({ ...settings, twoFactorEnabled: checked })} />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button className="bg-secondary hover:bg-secondary/90 text-white" onClick={handleSaveProfile} disabled={profileSaving || isLoading}>
              {profileSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Card>

        <Card className="bg-white p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Security</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} className="h-11" />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="outline" className="border-gray-200" onClick={handleChangePassword} disabled={passwordSaving}>
              {passwordSaving ? 'Updating...' : 'Change Password'}
            </Button>
          </div>
        </Card>

        <Card className="bg-white p-6 border-red-200">
          <h2 className="text-xl font-bold text-red-600 mb-6">Danger Zone</h2>
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div className="flex items-start gap-3">
              <Trash2 className="w-5 h-5 text-red-500 mt-1" />
              <div>
                <p className="font-medium text-gray-900">Delete Account</p>
                <p className="text-sm text-gray-500">Account deletion is not enabled yet. Contact support for manual removal.</p>
              </div>
            </div>
            <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100" disabled>
              Delete Account
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
