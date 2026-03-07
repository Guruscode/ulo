'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Settings as SettingsIcon } from 'lucide-react'
import DashboardLayout from '@/components/dashboard/dashboard-layout'

export default function DashboardSettingsPage() {
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Account Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your account information and preferences.
          </p>
        </div>

        {/* Profile Card */}
        <Card className="bg-white p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Profile Information
          </h2>
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-secondary flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-lg">{userData.name}</p>
              <p className="text-gray-500">Dashboard User</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input 
                id="timezone" 
                defaultValue="UTC+1 (West Africa)"
                className="h-11"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button className="bg-secondary hover:bg-secondary/90 text-white">
              Save Changes
            </Button>
          </div>
        </Card>

        {/* Security Card */}
        <Card className="bg-white p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Security
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Password</p>
                <p className="text-sm text-gray-500">Last changed 30 days ago</p>
              </div>
              <Button variant="outline" className="border-gray-200">
                Change Password
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
              <Button variant="outline" className="border-gray-200">
                Enable
              </Button>
            </div>
          </div>
        </Card>

        {/* Notifications Card */}
        <Card className="bg-white p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive updates about your properties</p>
              </div>
              <Button variant="outline" className="border-gray-200">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-500">Get instant notifications on your device</p>
              </div>
              <Button variant="outline" className="border-gray-200">
                Enable
              </Button>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-white p-6 border-red-200">
          <h2 className="text-xl font-bold text-red-600 mb-6">
            Danger Zone
          </h2>
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <p className="font-medium text-gray-900">Delete Account</p>
              <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
            </div>
            <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100">
              Delete Account
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}

