'use client'

import { useEffect, useMemo, useState } from 'react'
import { Eye, Loader2, Pencil } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ApiClientError } from '@/lib/client/api-error'
import { listAdminUsersRequest, updateAdminUserRequest } from '@/lib/client/users-client'
import type { AccountType, ApprovalStatus, AuthUser } from '@/lib/auth/types'

function badgeClass(value?: string) {
  switch (value) {
    case 'approved':
    case 'active':
      return 'bg-emerald-100 text-emerald-700'
    case 'rejected':
    case 'disabled':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-amber-100 text-amber-700'
  }
}

type UserManagementMode = 'all' | 'agents'

export function UserManagement({ mode }: { mode: UserManagementMode }) {
  const [users, setUsers] = useState<AuthUser[]>([])
  const [search, setSearch] = useState('')
  const [approvalStatus, setApprovalStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewUser, setViewUser] = useState<AuthUser | null>(null)
  const [editUser, setEditUser] = useState<AuthUser | null>(null)
  const [saving, setSaving] = useState(false)

  const submitUserUpdate = async (user: AuthUser, overrides?: Partial<AuthUser>) => {
    setSaving(true)
    setError('')
    try {
      const nextUser = { ...user, ...overrides }
      const response = await updateAdminUserRequest(user.id, {
        name: nextUser.name,
        email: nextUser.email,
        phone: nextUser.phone || null,
        address: nextUser.address || null,
        state: nextUser.state || null,
        localGovernment: nextUser.localGovernment || null,
        accountType: (nextUser.accountType || 'user') as AccountType,
        approvalStatus: (nextUser.approvalStatus || 'pending') as ApprovalStatus,
        identityType: nextUser.accountType === 'user' ? null : 'bvn',
        identityNumber: nextUser.identityNumber || null,
        isActive: nextUser.status !== 'disabled',
        propertyListingLimit: nextUser.propertyListingLimit ?? null,
        hotelListingLimit: nextUser.hotelListingLimit ?? null,
      })
      setUsers((current) => current.map((item) => (item.id === response.user.id ? response.user : item)))
      setViewUser((current) => (current?.id === response.user.id ? response.user : current))
      setEditUser(null)
    } catch (error) {
      setError(error instanceof ApiClientError ? error.message : 'Unable to save user.')
    } finally {
      setSaving(false)
    }
  }

  const loadUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await listAdminUsersRequest({
        search: search || undefined,
        accountType: mode === 'agents' ? 'agent' : undefined,
        approvalStatus: approvalStatus !== 'all' ? approvalStatus : undefined,
      })
      setUsers(
        mode === 'agents'
          ? response.users.filter((user) => user.accountType === 'agent')
          : response.users
      )
    } catch (error) {
      setError(error instanceof ApiClientError ? error.message : 'Unable to load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadUsers()
  }, [mode, search, approvalStatus])

  const counts = useMemo(() => ({
    total: users.length,
    approved: users.filter((user) => user.approvalStatus === 'approved').length,
    pending: users.filter((user) => user.approvalStatus === 'pending').length,
  }), [users])

  const saveUser = async () => {
    if (!editUser) return
    await submitUserUpdate(editUser)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{mode === 'agents' ? 'Agent Management' : 'User Management'}</h2>
          <p className="mt-1 text-sm text-slate-600">
            {mode === 'agents' ? 'Review and manage approved or pending agents.' : 'Manage account types, approvals, and account access.'}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <Card className="p-4"><p className="text-slate-500">Total</p><p className="text-2xl font-bold text-slate-900">{counts.total}</p></Card>
          <Card className="p-4"><p className="text-slate-500">Approved</p><p className="text-2xl font-bold text-slate-900">{counts.approved}</p></Card>
          <Card className="p-4"><p className="text-slate-500">Pending</p><p className="text-2xl font-bold text-slate-900">{counts.pending}</p></Card>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Search by name, email, or phone" value={search} onChange={(event) => setSearch(event.target.value)} />
          <Select value={approvalStatus} onValueChange={setApprovalStatus}>
            <SelectTrigger><SelectValue placeholder="Approval status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All approvals</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {loading ? (
        <Card className="p-12 text-center text-slate-500"><Loader2 className="mx-auto h-8 w-8 animate-spin" /></Card>
      ) : error ? (
        <Card className="p-12 text-center text-red-600">{error}</Card>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id} className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-900">{user.name}</h3>
                    <Badge className={badgeClass(user.approvalStatus)}>{user.approvalStatus}</Badge>
                    <Badge className={badgeClass(user.status)}>{user.status}</Badge>
                    <Badge variant="outline">{user.accountType}</Badge>
                  </div>
                  <p className="text-sm text-slate-600">{user.email} · {user.phone || 'No phone'}</p>
                  <p className="text-sm text-slate-500">{user.address || 'No address'}{user.state ? `, ${user.state}` : ''}{user.localGovernment ? `, ${user.localGovernment}` : ''}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={saving || user.approvalStatus === 'approved'}
                    onClick={() => void submitUserUpdate(user, { approvalStatus: 'approved' })}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    disabled={saving || user.approvalStatus === 'rejected'}
                    onClick={() => void submitUserUpdate(user, { approvalStatus: 'rejected' })}
                  >
                    Reject
                  </Button>
                  <Button variant="outline" onClick={() => setViewUser(user)}><Eye className="mr-2 h-4 w-4" />View</Button>
                  <Button variant="outline" onClick={() => setEditUser(user)}><Pencil className="mr-2 h-4 w-4" />Edit</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={Boolean(viewUser)} onOpenChange={(open) => !open && setViewUser(null)}>
        <DialogContent>
          {viewUser ? (
            <>
              <DialogHeader><DialogTitle>{viewUser.name}</DialogTitle></DialogHeader>
              <div className="space-y-2 text-sm text-slate-600">
                <p><span className="font-medium text-slate-900">Email:</span> {viewUser.email}</p>
                <p><span className="font-medium text-slate-900">Phone:</span> {viewUser.phone || 'N/A'}</p>
                <p><span className="font-medium text-slate-900">Account Type:</span> {viewUser.accountType}</p>
                <p><span className="font-medium text-slate-900">Approval:</span> {viewUser.approvalStatus}</p>
                <p><span className="font-medium text-slate-900">Status:</span> {viewUser.status}</p>
                <p><span className="font-medium text-slate-900">Address:</span> {viewUser.address || 'N/A'}</p>
                <p><span className="font-medium text-slate-900">State / LGA:</span> {viewUser.state || 'N/A'} / {viewUser.localGovernment || 'N/A'}</p>
                <p><span className="font-medium text-slate-900">Identity:</span> {viewUser.identityType ? `${viewUser.identityType.toUpperCase()} - ${viewUser.identityNumber}` : 'N/A'}</p>
                <p><span className="font-medium text-slate-900">Property Listing Limit:</span> {viewUser.propertyListingLimit == null ? 'Use subscription/default access' : viewUser.propertyListingLimit < 0 ? 'Unlimited' : viewUser.propertyListingLimit}</p>
                <p><span className="font-medium text-slate-900">Hotel Listing Limit:</span> {viewUser.hotelListingLimit == null ? 'Use subscription/default access' : viewUser.hotelListingLimit < 0 ? 'Unlimited' : viewUser.hotelListingLimit}</p>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editUser)} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          {editUser ? (
            <>
              <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label>Name</Label><Input value={editUser.name} onChange={(event) => setEditUser({ ...editUser, name: event.target.value })} /></div>
                <div className="space-y-2"><Label>Email</Label><Input value={editUser.email} onChange={(event) => setEditUser({ ...editUser, email: event.target.value })} /></div>
                <div className="space-y-2"><Label>Phone</Label><Input value={editUser.phone || ''} onChange={(event) => setEditUser({ ...editUser, phone: event.target.value })} /></div>
                <div className="space-y-2"><Label>Account Type</Label><Select value={editUser.accountType || 'user'} onValueChange={(value) => setEditUser({ ...editUser, accountType: value as AccountType })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="user">User</SelectItem><SelectItem value="agent">Agent</SelectItem><SelectItem value="landlord">Landlord</SelectItem><SelectItem value="hotel_manager">Hotel Manager</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Approval</Label><Select value={editUser.approvalStatus || 'pending'} onValueChange={(value) => setEditUser({ ...editUser, approvalStatus: value as ApprovalStatus })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="approved">Approved</SelectItem><SelectItem value="rejected">Rejected</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Identity Type</Label><Input value={editUser.accountType === 'user' ? 'N/A' : 'BVN'} disabled /></div>
                <div className="space-y-2 md:col-span-2"><Label>Identity Number</Label><Input value={editUser.identityNumber || ''} onChange={(event) => setEditUser({ ...editUser, identityNumber: event.target.value })} disabled={editUser.accountType === 'user'} /></div>
                <div className="space-y-2 md:col-span-2"><Label>Address</Label><Input value={editUser.address || ''} onChange={(event) => setEditUser({ ...editUser, address: event.target.value })} /></div>
                <div className="space-y-2"><Label>State</Label><Input value={editUser.state || ''} onChange={(event) => setEditUser({ ...editUser, state: event.target.value })} /></div>
                <div className="space-y-2"><Label>Local Government</Label><Input value={editUser.localGovernment || ''} onChange={(event) => setEditUser({ ...editUser, localGovernment: event.target.value })} /></div>
                <div className="space-y-2">
                  <Label>Property Listing Limit</Label>
                  <Input
                    type="number"
                    value={editUser.propertyListingLimit == null ? '' : String(editUser.propertyListingLimit)}
                    onChange={(event) => setEditUser({
                      ...editUser,
                      propertyListingLimit: event.target.value === '' ? null : Number(event.target.value),
                    })}
                    placeholder="Blank = subscription/default"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hotel Listing Limit</Label>
                  <Input
                    type="number"
                    value={editUser.hotelListingLimit == null ? '' : String(editUser.hotelListingLimit)}
                    onChange={(event) => setEditUser({
                      ...editUser,
                      hotelListingLimit: event.target.value === '' ? null : Number(event.target.value),
                    })}
                    placeholder="Blank = subscription/default"
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border px-4 py-3 md:col-span-2">
                  <div>
                    <p className="font-medium text-slate-900">Enable Account</p>
                    <p className="text-sm text-slate-500">Disabled accounts cannot access listings or dashboards.</p>
                  </div>
                  <Switch checked={editUser.status !== 'disabled'} onCheckedChange={(checked) => setEditUser({ ...editUser, status: checked ? 'active' : 'disabled' })} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditUser(null)}>Cancel</Button>
                <Button onClick={() => void saveUser()} disabled={saving}>{saving ? 'Saving...' : 'Save User'}</Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
