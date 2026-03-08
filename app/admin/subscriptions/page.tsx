'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  MoreVertical,
  Filter,
  LayoutGrid,
  LayoutList,
  CreditCard,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  Crown,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import AdminLayout from '@/components/admin/admin-layout'

interface Subscription {
  id: number
  user: string
  email: string
  plan: 'basic' | 'premium' | 'enterprise'
  status: 'active' | 'expired' | 'cancelled' | 'pending'
  startDate: string
  endDate: string
  amount: number
  paymentMethod: string
}

const mockSubscriptions: Subscription[] = [
  {
    id: 1,
    user: 'John Doe',
    email: 'john.doe@example.com',
    plan: 'premium',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    amount: 9999,
    paymentMethod: 'Credit Card',
  },
  {
    id: 2,
    user: 'Sarah Johnson',
    email: 'sarah.j@realestate.com',
    plan: 'enterprise',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2025-01-14',
    amount: 24999,
    paymentMethod: 'PayPal',
  },
  {
    id: 3,
    user: 'Michael Brown',
    email: 'michael.b@example.com',
    plan: 'basic',
    status: 'expired',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    amount: 4999,
    paymentMethod: 'Credit Card',
  },
  {
    id: 4,
    user: 'Emily Davis',
    email: 'emily.davis@example.com',
    plan: 'premium',
    status: 'pending',
    startDate: '2024-02-01',
    endDate: '2025-01-31',
    amount: 9999,
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 5,
    user: 'David Wilson',
    email: 'd.wilson@example.com',
    plan: 'basic',
    status: 'cancelled',
    startDate: '2023-06-01',
    endDate: '2024-05-31',
    amount: 4999,
    paymentMethod: 'Credit Card',
  },
  {
    id: 6,
    user: 'Lisa Martinez',
    email: 'lisa.m@example.com',
    plan: 'enterprise',
    status: 'active',
    startDate: '2024-01-20',
    endDate: '2025-01-19',
    amount: 24999,
    paymentMethod: 'Credit Card',
  },
]

const planColors: Record<string, string> = {
  basic: 'bg-blue-100 text-blue-800',
  premium: 'bg-purple-100 text-purple-800',
  enterprise: 'bg-yellow-100 text-yellow-800',
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  expired: 'bg-red-100 text-red-800',
  cancelled: 'bg-slate-100 text-slate-800',
  pending: 'bg-yellow-100 text-yellow-800',
}

export default function AdminSubscriptionsPage() {
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPlan, setFilterPlan] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [viewSubscription, setViewSubscription] = useState<Subscription | null>(null)
  const [editSubscription, setEditSubscription] = useState<Subscription | null>(null)
  const [addSubscriptionOpen, setAddSubscriptionOpen] = useState(false)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions)
  
  const [newSubscription, setNewSubscription] = useState<Partial<Subscription>>({
    user: '',
    email: '',
    plan: 'basic',
    status: 'pending',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    amount: 0,
    paymentMethod: 'Credit Card',
  })
  
  const itemsPerPage = 10

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      const matchesSearch =
        sub.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPlan = filterPlan === 'all' || sub.plan === filterPlan
      const matchesStatus = filterStatus === 'all' || sub.status === filterStatus

      return matchesSearch && matchesPlan && matchesStatus
    })
  }, [searchTerm, filterPlan, filterStatus, subscriptions])

  const paginatedSubscriptions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredSubscriptions.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredSubscriptions, currentPage])

  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage)

  const totalRevenue = subscriptions
    .filter(s => s.status === 'active')
    .reduce((acc, s) => acc + s.amount, 0)

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length
  const pendingSubscriptions = subscriptions.filter(s => s.status === 'pending').length

  const handleDelete = (id: number) => {
    setSubscriptions(subscriptions.filter(s => s.id !== id))
    setDeleteId(null)
  }

  const handleSaveEdit = () => {
    if (editSubscription) {
      setSubscriptions(subscriptions.map(s => s.id === editSubscription.id ? editSubscription : s))
      setEditSubscription(null)
    }
  }

  const handleAddSubscription = () => {
    if (newSubscription.user && newSubscription.email && newSubscription.amount) {
      const subscription: Subscription = {
        id: Date.now(),
        user: newSubscription.user || '',
        email: newSubscription.email || '',
        plan: newSubscription.plan as Subscription['plan'] || 'basic',
        status: newSubscription.status as Subscription['status'] || 'pending',
        startDate: newSubscription.startDate || new Date().toISOString().split('T')[0],
        endDate: newSubscription.endDate || '',
        amount: newSubscription.amount || 0,
        paymentMethod: newSubscription.paymentMethod || 'Credit Card',
      }
      setSubscriptions([subscription, ...subscriptions])
      setNewSubscription({
        user: '',
        email: '',
        plan: 'basic',
        status: 'pending',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        amount: 0,
        paymentMethod: 'Credit Card',
      })
      setAddSubscriptionOpen(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`
  }

  return (
    <AdminLayout>
      <TooltipProvider delayDuration={0}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Subscription Management</h2>
              <p className="text-slate-600 text-sm mt-1">
                Manage all subscription plans and payments
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setAddSubscriptionOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Subscription
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a new subscription</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-green-100">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</p>
                </div>
              </div>
            </Card>
            <Card className="bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-blue-100">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-slate-900">{activeSubscriptions}</p>
                </div>
              </div>
            </Card>
            <Card className="bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-yellow-100">
                  <CreditCard className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Pending Payments</p>
                  <p className="text-2xl font-bold text-slate-900">{pendingSubscriptions}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card className="bg-white p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search by user or email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10"
                />
              </div>

              <Select value={filterPlan} onValueChange={(value) => {
                setFilterPlan(value)
                setCurrentPage(1)
              }}>
                <SelectTrigger className="w-full md:w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={(value) => {
                setFilterStatus(value)
                setCurrentPage(1)
              }}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2 border border-slate-200 rounded-lg p-1">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setViewMode('card')}
                        className={`p-2 rounded transition ${
                          viewMode === 'card' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <LayoutGrid className="w-5 h-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent><p>Card View</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setViewMode('table')}
                        className={`p-2 rounded transition ${
                          viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <LayoutList className="w-5 h-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent><p>Table View</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </Card>

          {/* Results Counter */}
          <p className="text-sm text-slate-600">
            Showing {paginatedSubscriptions.length} of {filteredSubscriptions.length} subscriptions
          </p>

          {/* Table View */}
          {viewMode === 'table' && (
            <Card className="bg-white overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSubscriptions.map((subscription) => (
                    <motion.tr
                      key={subscription.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50 transition"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900">{subscription.user}</p>
                          <p className="text-sm text-slate-500">{subscription.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={planColors[subscription.plan]}>
                          {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900">
                        {formatCurrency(subscription.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[subscription.status]}>
                          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">{subscription.startDate}</TableCell>
                      <TableCell className="text-slate-600">{subscription.endDate}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => setViewSubscription(subscription)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditSubscription(subscription)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setDeleteId(subscription.id)} className="text-red-600 focus:text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {/* Card View */}
          {viewMode === 'card' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedSubscriptions.map((subscription, index) => (
                <motion.div
                  key={subscription.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-semibold text-slate-900">{subscription.user}</p>
                        <p className="text-xs text-slate-500">{subscription.email}</p>
                      </div>
                      <Badge className={planColors[subscription.plan]}>{subscription.plan}</Badge>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Amount:</span>
                        <span className="font-semibold">{formatCurrency(subscription.amount)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Status:</span>
                        <Badge className={statusColors[subscription.status]}>{subscription.status}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Ends:</span>
                        <span className="text-slate-700">{subscription.endDate}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setViewSubscription(subscription)}>
                        <Eye className="w-3 h-3 mr-1" />View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditSubscription(subscription)}>
                        <Edit className="w-3 h-3 mr-1" />Edit
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {paginatedSubscriptions.length === 0 && (
            <Card className="bg-white p-12 text-center">
              <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">No subscriptions found</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setAddSubscriptionOpen(true)}>
                Add Your First Subscription
              </Button>
            </Card>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">Page {currentPage} of {totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>Previous</Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>Next</Button>
              </div>
            </div>
          )}

          {/* View Subscription Modal */}
          <Dialog open={!!viewSubscription} onOpenChange={() => setViewSubscription(null)}>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Subscription Details</DialogTitle>
              </DialogHeader>
              {viewSubscription && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-yellow-500 flex items-center justify-center">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{viewSubscription.user}</h3>
                      <p className="text-slate-500">{viewSubscription.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-500">Plan</p>
                      <Badge className={planColors[viewSubscription.plan]}>{viewSubscription.plan}</Badge>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-500">Status</p>
                      <Badge className={statusColors[viewSubscription.status]}>{viewSubscription.status}</Badge>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-500">Amount</p>
                      <p className="font-bold text-slate-900">{formatCurrency(viewSubscription.amount)}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-500">Payment Method</p>
                      <p className="font-semibold text-slate-900">{viewSubscription.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">Start: {viewSubscription.startDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">End: {viewSubscription.endDate}</span>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewSubscription(null)}>Close</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setViewSubscription(null); setEditSubscription(viewSubscription!) }}>
                  <Edit className="w-4 h-4 mr-2" />Edit Subscription
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Subscription Modal */}
          <Dialog open={!!editSubscription} onOpenChange={() => setEditSubscription(null)}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Edit Subscription</DialogTitle>
                <DialogDescription>Update the subscription details.</DialogDescription>
              </DialogHeader>
              {editSubscription && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>User Name</Label>
                    <Input value={editSubscription.user} onChange={(e) => setEditSubscription({ ...editSubscription, user: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={editSubscription.email} onChange={(e) => setEditSubscription({ ...editSubscription, email: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Plan</Label>
                      <Select value={editSubscription.plan} onValueChange={(value: Subscription['plan']) => setEditSubscription({ ...editSubscription, plan: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={editSubscription.status} onValueChange={(value: Subscription['status']) => setEditSubscription({ ...editSubscription, status: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Amount (in cents)</Label>
                      <Input type="number" value={editSubscription.amount} onChange={(e) => setEditSubscription({ ...editSubscription, amount: parseInt(e.target.value) })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <Select value={editSubscription.paymentMethod} onValueChange={(value) => setEditSubscription({ ...editSubscription, paymentMethod: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Credit Card">Credit Card</SelectItem>
                          <SelectItem value="PayPal">PayPal</SelectItem>
                          <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input type="date" value={editSubscription.startDate} onChange={(e) => setEditSubscription({ ...editSubscription, startDate: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input type="date" value={editSubscription.endDate} onChange={(e) => setEditSubscription({ ...editSubscription, endDate: e.target.value })} />
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditSubscription(null)}>Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveEdit}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Subscription Modal */}
          <Dialog open={addSubscriptionOpen} onOpenChange={setAddSubscriptionOpen}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Add New Subscription</DialogTitle>
                <DialogDescription>Create a new subscription for a user.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>User Name *</Label>
                  <Input value={newSubscription.user} onChange={(e) => setNewSubscription({ ...newSubscription, user: e.target.value })} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input value={newSubscription.email} onChange={(e) => setNewSubscription({ ...newSubscription, email: e.target.value })} placeholder="john@example.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Plan</Label>
                    <Select value={newSubscription.plan} onValueChange={(value: Subscription['plan']) => setNewSubscription({ ...newSubscription, plan: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={newSubscription.status} onValueChange={(value: Subscription['status']) => setNewSubscription({ ...newSubscription, status: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Amount (in cents) *</Label>
                    <Input type="number" value={newSubscription.amount || ''} onChange={(e) => setNewSubscription({ ...newSubscription, amount: parseInt(e.target.value) || 0 })} placeholder="4999" />
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select value={newSubscription.paymentMethod} onValueChange={(value) => setNewSubscription({ ...newSubscription, paymentMethod: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="PayPal">PayPal</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" value={newSubscription.startDate} onChange={(e) => setNewSubscription({ ...newSubscription, startDate: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="date" value={newSubscription.endDate} onChange={(e) => setNewSubscription({ ...newSubscription, endDate: e.target.value })} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddSubscriptionOpen(false)}>Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddSubscription}>Add Subscription</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation */}
          {deleteId && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="bg-white p-6 max-w-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Subscription?</h3>
                <p className="text-slate-600 mb-6">Are you sure you want to delete this subscription? This action cannot be undone.</p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1">Cancel</Button>
                  <Button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-600 hover:bg-red-700 text-white">Delete</Button>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </TooltipProvider>
    </AdminLayout>
  )
}

