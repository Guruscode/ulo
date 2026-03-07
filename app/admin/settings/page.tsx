'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  User,
  Settings as SettingsIcon,
  Shield,
  Bell,
  Mail,
  Globe,
  Palette,
  Database,
  Key,
  Save,
  RefreshCw,
  Trash2,
} from 'lucide-react'
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import AdminLayout from '@/components/admin/admin-layout'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'ULO - Real Estate Platform',
    siteDescription: 'Premium real estate platform for buying, selling, and renting properties',
    contactEmail: 'admin@ulo.com',
    contactPhone: '+1 (555) 123-4567',
    timezone: 'Africa/Lagos',
    currency: 'NGN',
    language: 'en',
    
    // Email settings
    emailNotifications: true,
    emailNewUser: true,
    emailNewProperty: true,
    emailNewInquiry: true,
    emailWeeklyReport: false,
    
    // Security settings
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordExpiry: '90',
    
    // Display settings
    darkMode: false,
    compactView: false,
    showFeatured: true,
    showRecent: true,
    itemsPerPage: '10',
    
    // Maintenance
    maintenanceMode: false,
    cacheEnabled: true,
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AdminLayout>
      <TooltipProvider delayDuration={0}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Admin Settings</h2>
              <p className="text-slate-600 text-sm mt-1">
                Manage platform settings and configurations
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  className={`${saved ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                  onClick={handleSave}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saved ? 'Saved!' : 'Save Changes'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save all your changes</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 h-auto p-1 bg-slate-100">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">General</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="display" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Display</span>
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span className="hidden sm:inline">Maintenance</span>
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general">
              <Card className="bg-white p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6">General Settings</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">Site Name</Label>
                      <Input 
                        id="siteName" 
                        value={settings.siteName}
                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={settings.timezone} onValueChange={(value) => setSettings({ ...settings, timezone: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Africa/Lagos">Africa/Lagos (UTC+1)</SelectItem>
                          <SelectItem value="America/New_York">America/New_York (UTC-5)</SelectItem>
                          <SelectItem value="Europe/London">Europe/London (UTC+0)</SelectItem>
                          <SelectItem value="Asia/Dubai">Asia/Dubai (UTC+4)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">Site Description</Label>
                    <Textarea 
                      id="siteDescription" 
                      value={settings.siteDescription}
                      onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input 
                        id="contactEmail" 
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input 
                        id="contactPhone" 
                        value={settings.contactPhone}
                        onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={settings.currency} onValueChange={(value) => setSettings({ ...settings, currency: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NGN">Nigerian Naira (NGN)</SelectItem>
                          <SelectItem value="USD">US Dollar (USD)</SelectItem>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                          <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Default Language</Label>
                      <Select value={settings.language} onValueChange={(value) => setSettings({ ...settings, language: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications">
              <Card className="bg-white p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Email Notifications</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-900">Enable Email Notifications</p>
                        <p className="text-sm text-slate-500">Receive email updates about platform activity</p>
                      </div>
                    </div>
                    <Switch 
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                    />
                  </div>

                  <div className={`space-y-4 ${!settings.emailNotifications && 'opacity-50 pointer-events-none'}`}>
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">New User Registration</p>
                        <p className="text-sm text-slate-500">Get notified when new users register</p>
                      </div>
                      <Switch 
                        checked={settings.emailNewUser}
                        onCheckedChange={(checked) => setSettings({ ...settings, emailNewUser: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">New Property Listings</p>
                        <p className="text-sm text-slate-500">Get notified when new properties are listed</p>
                      </div>
                      <Switch 
                        checked={settings.emailNewProperty}
                        onCheckedChange={(checked) => setSettings({ ...settings, emailNewProperty: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">New Inquiries</p>
                        <p className="text-sm text-slate-500">Get notified when users send inquiries</p>
                      </div>
                      <Switch 
                        checked={settings.emailNewInquiry}
                        onCheckedChange={(checked) => setSettings({ ...settings, emailNewInquiry: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Weekly Reports</p>
                        <p className="text-sm text-slate-500">Receive weekly platform performance reports</p>
                      </div>
                      <Switch 
                        checked={settings.emailWeeklyReport}
                        onCheckedChange={(checked) => setSettings({ ...settings, emailWeeklyReport: checked })}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security">
              <Card className="bg-white p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Security Settings</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                        <p className="text-sm text-slate-500">Add an extra layer of security to admin accounts</p>
                      </div>
                    </div>
                    <Switch 
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Select value={settings.sessionTimeout} onValueChange={(value) => setSettings({ ...settings, sessionTimeout: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                      <Select value={settings.passwordExpiry} onValueChange={(value) => setSettings({ ...settings, passwordExpiry: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="180">180 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-slate-900 mb-4">Change Admin Password</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Key className="w-4 h-4 mr-2" />
                        Update Password
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Display Settings */}
            <TabsContent value="display">
              <Card className="bg-white p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Display Settings</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Palette className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-900">Dark Mode</p>
                        <p className="text-sm text-slate-500">Enable dark theme for the admin panel</p>
                      </div>
                    </div>
                    <Switch 
                      checked={settings.darkMode}
                      onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">Compact View</p>
                      <p className="text-sm text-slate-500">Use compact spacing throughout the admin</p>
                    </div>
                    <Switch 
                      checked={settings.compactView}
                      onCheckedChange={(checked) => setSettings({ ...settings, compactView: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">Show Featured Properties</p>
                      <p className="text-sm text-slate-500">Display featured properties on dashboard</p>
                    </div>
                    <Switch 
                      checked={settings.showFeatured}
                      onCheckedChange={(checked) => setSettings({ ...settings, showFeatured: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">Show Recent Activity</p>
                      <p className="text-sm text-slate-500">Display recent activity on dashboard</p>
                    </div>
                    <Switch 
                      checked={settings.showRecent}
                      onCheckedChange={(checked) => setSettings({ ...settings, showRecent: checked })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="itemsPerPage">Items Per Page</Label>
                    <Select value={settings.itemsPerPage} onValueChange={(value) => setSettings({ ...settings, itemsPerPage: value })}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 items</SelectItem>
                        <SelectItem value="10">10 items</SelectItem>
                        <SelectItem value="15">15 items</SelectItem>
                        <SelectItem value="25">25 items</SelectItem>
                        <SelectItem value="50">50 items</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Maintenance Settings */}
            <TabsContent value="maintenance">
              <Card className="bg-white p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Maintenance & Cache</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <SettingsIcon className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-900">Maintenance Mode</p>
                        <p className="text-sm text-slate-500">Show maintenance page to users</p>
                      </div>
                    </div>
                    <Switch 
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                    />
                  </div>

                  {settings.maintenanceMode && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 text-sm">
                        ⚠️ Maintenance mode is currently enabled. All users will see a maintenance page.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">Enable Caching</p>
                      <p className="text-sm text-slate-500">Improve performance with caching</p>
                    </div>
                    <Switch 
                      checked={settings.cacheEnabled}
                      onCheckedChange={(checked) => setSettings({ ...settings, cacheEnabled: checked })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <Button variant="outline" className="w-full">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Clear Cache
                    </Button>
                    <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All Data
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-slate-900 mb-4">Database Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-slate-500">Database Size</p>
                        <p className="font-medium">125.4 MB</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-slate-500">Total Records</p>
                        <p className="font-medium">45,892</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </TooltipProvider>
    </AdminLayout>
  )
}

