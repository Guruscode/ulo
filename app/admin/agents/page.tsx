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
  MapPin,
  Filter,
  LayoutGrid,
  LayoutList,
  User,
  Mail,
  Phone,
  Star,
  Building2,
  Award,
  Calendar,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import AdminLayout from '@/components/admin/admin-layout'

interface Agent {
  id: number
  name: string
  email: string
  phone: string
  location: string
  agency: string
  rating: number
  reviewCount: number
  properties: number
  status: 'active' | 'inactive' | 'pending'
  joinedDate: string
  avatar?: string
}

const mockAgents: Agent[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.j@realestate.com',
    phone: '+1 (555) 234-5678',
    location: 'Los Angeles, USA',
    agency: 'Luxury Properties Inc.',
    rating: 4.9,
    reviewCount: 156,
    properties: 24,
    status: 'active',
    joinedDate: '2022-03-15',
  },
  {
    id: 2,
    name: 'Michael Brown',
    email: 'michael.b@agents.com',
    phone: '+1 (555) 345-6789',
    location: 'New York, USA',
    agency: 'NYC Real Estate',
    rating: 4.7,
    reviewCount: 98,
    properties: 18,
    status: 'active',
    joinedDate: '2022-06-20',
  },
  {
    id: 3,
    name: 'Emily Davis',
    email: 'emily.d@premium.com',
    phone: '+1 (555) 456-7890',
    location: 'Miami, USA',
    agency: 'Premium Homes',
    rating: 4.8,
    reviewCount: 134,
    properties: 31,
    status: 'active',
    joinedDate: '2021-11-08',
  },
  {
    id: 4,
    name: 'David Wilson',
    email: 'd.wilson@estates.com',
    phone: '+1 (555) 567-8901',
    location: 'Chicago, USA',
    agency: 'Wilson Estates',
    rating: 4.5,
    reviewCount: 67,
    properties: 12,
    status: 'pending',
    joinedDate: '2024-01-05',
  },
  {
    id: 5,
    name: 'Lisa Martinez',
    email: 'lisa.m@realty.com',
    phone: '+1 (555) 678-9012',
    location: 'San Francisco, USA',
    agency: 'Bay Area Realty',
    rating: 4.6,
    reviewCount: 89,
    properties: 15,
    status: 'active',
    joinedDate: '2022-09-12',
  },
  {
    id: 6,
    name: 'James Anderson',
    email: 'james.a@luxury.com',
    phone: '+1 (555) 789-0123',
    location: 'Seattle, USA',
    agency: 'Luxury Living',
    rating: 4.4,
    reviewCount: 45,
    properties: 8,
    status: 'inactive',
    joinedDate: '2023-02-28',
  },
]

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
}

export default function AdminAgentsPage() {
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [viewAgent, setViewAgent] = useState<Agent | null>(null)
  const [editAgent, setEditAgent] = useState<Agent | null>(null)
  const [addAgentOpen, setAddAgentOpen] = useState(false)
  const [agents, setAgents] = useState<Agent[]>(mockAgents)
  
  const [newAgent, setNewAgent] = useState<Partial<Agent>>({
    name: '',
    email: '',
    phone: '',
    location: '',
    agency: '',
    rating: 4.5,
    reviewCount: 0,
    properties: 0,
    status: 'pending',
    joinedDate: new Date().toISOString().split('T')[0],
  })
  
  const itemsPerPage = 10

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesSearch =
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.agency.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || agent.status === filterStatus

      return matchesSearch && matchesStatus
    })
  }, [searchTerm, filterStatus, agents])

  const paginatedAgents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAgents.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAgents, currentPage])

  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage)

  const handleDelete = (id: number) => {
    setAgents(agents.filter(a => a.id !== id))
    setDeleteId(null)
  }

  const handleSaveEdit = () => {
    if (editAgent) {
      setAgents(agents.map(a => a.id === editAgent.id ? editAgent : a))
      setEditAgent(null)
    }
  }

  const handleAddAgent = () => {
    if (newAgent.name && newAgent.email) {
      const agent: Agent = {
        id: Date.now(),
        name: newAgent.name || '',
        email: newAgent.email || '',
        phone: newAgent.phone || '',
        location: newAgent.location || '',
        agency: newAgent.agency || '',
        rating: newAgent.rating || 4.5,
        reviewCount: newAgent.reviewCount || 0,
        properties: newAgent.properties || 0,
        status: newAgent.status as Agent['status'] || 'pending',
        joinedDate: newAgent.joinedDate || new Date().toISOString().split('T')[0],
      }
      setAgents([agent, ...agents])
      setNewAgent({
        name: '',
        email: '',
        phone: '',
        location: '',
        agency: '',
        rating: 4.5,
        reviewCount: 0,
        properties: 0,
        status: 'pending',
        joinedDate: new Date().toISOString().split('T')[0],
      })
      setAddAgentOpen(false)
    }
  }

  return (
    <AdminLayout>
      <TooltipProvider delayDuration={0}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Agents Management</h2>
              <p className="text-slate-600 text-sm mt-1">
                Manage all agents and their profiles
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setAddAgentOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Agent
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a new agent</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Search and Filter */}
          <Card className="bg-white p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search by name, email, or agency..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10"
                />
              </div>

              <Select value={filterStatus} onValueChange={(value) => {
                setFilterStatus(value)
                setCurrentPage(1)
              }}>
                <SelectTrigger className="w-full md:w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
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
            Showing {paginatedAgents.length} of {filteredAgents.length} agents
          </p>

          {/* Table View */}
          {viewMode === 'table' && (
            <Card className="bg-white overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Agency</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Properties</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAgents.map((agent) => (
                    <motion.tr
                      key={agent.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50 transition"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{agent.name}</p>
                            <p className="text-sm text-slate-500">{agent.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">{agent.agency}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-slate-600">
                          <MapPin className="w-3 h-3" />
                          {agent.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{agent.rating}</span>
                          <span className="text-slate-500">({agent.reviewCount})</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">{agent.properties}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[agent.status]}>
                          {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => setViewAgent(agent)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditAgent(agent)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setDeleteId(agent.id)} className="text-red-600 focus:text-red-600">
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
              {paginatedAgents.map((agent, index) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{agent.name}</p>
                          <p className="text-xs text-slate-500">{agent.agency}</p>
                        </div>
                      </div>
                      <Badge className={statusColors[agent.status]}>{agent.status}</Badge>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {agent.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {agent.rating} ({agent.reviewCount} reviews)
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        {agent.properties} properties
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setViewAgent(agent)}>
                        <Eye className="w-3 h-3 mr-1" />View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditAgent(agent)}>
                        <Edit className="w-3 h-3 mr-1" />Edit
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {paginatedAgents.length === 0 && (
            <Card className="bg-white p-12 text-center">
              <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">No agents found</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setAddAgentOpen(true)}>
                Add Your First Agent
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

          {/* View Agent Modal */}
          <Dialog open={!!viewAgent} onOpenChange={() => setViewAgent(null)}>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Agent Details</DialogTitle>
              </DialogHeader>
              {viewAgent && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{viewAgent.name}</h3>
                      <p className="text-slate-500">{viewAgent.agency}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">{viewAgent.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">{viewAgent.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">{viewAgent.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">Joined: {viewAgent.joinedDate}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-4 border-t">
                    <div className="text-center">
                      <Star className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                      <span className="font-bold">{viewAgent.rating}</span>
                      <p className="text-xs text-slate-500">Rating</p>
                    </div>
                    <div className="text-center">
                      <Building2 className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                      <span className="font-bold">{viewAgent.properties}</span>
                      <p className="text-xs text-slate-500">Properties</p>
                    </div>
                    <div className="text-center">
                      <Badge className={statusColors[viewAgent.status]}>{viewAgent.status}</Badge>
                      <p className="text-xs text-slate-500 mt-1">Status</p>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewAgent(null)}>Close</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setViewAgent(null); setEditAgent(viewAgent!) }}>
                  <Edit className="w-4 h-4 mr-2" />Edit Agent
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Agent Modal */}
          <Dialog open={!!editAgent} onOpenChange={() => setEditAgent(null)}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Edit Agent</DialogTitle>
                <DialogDescription>Update the agent details.</DialogDescription>
              </DialogHeader>
              {editAgent && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={editAgent.name} onChange={(e) => setEditAgent({ ...editAgent, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={editAgent.email} onChange={(e) => setEditAgent({ ...editAgent, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={editAgent.phone} onChange={(e) => setEditAgent({ ...editAgent, phone: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Agency</Label>
                      <Input value={editAgent.agency} onChange={(e) => setEditAgent({ ...editAgent, agency: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input value={editAgent.location} onChange={(e) => setEditAgent({ ...editAgent, location: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Rating</Label>
                      <Input type="number" step="0.1" max="5" value={editAgent.rating} onChange={(e) => setEditAgent({ ...editAgent, rating: parseFloat(e.target.value) })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={editAgent.status} onValueChange={(value: Agent['status']) => setEditAgent({ ...editAgent, status: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditAgent(null)}>Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveEdit}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Agent Modal */}
          <Dialog open={addAgentOpen} onOpenChange={setAddAgentOpen}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Add New Agent</DialogTitle>
                <DialogDescription>Create a new agent profile.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input value={newAgent.name} onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" value={newAgent.email} onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })} placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={newAgent.phone} onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })} placeholder="+1 (555) 123-4567" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Agency</Label>
                    <Input value={newAgent.agency} onChange={(e) => setNewAgent({ ...newAgent, agency: e.target.value })} placeholder="Agency name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input value={newAgent.location} onChange={(e) => setNewAgent({ ...newAgent, location: e.target.value })} placeholder="City, USA" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={newAgent.status} onValueChange={(value: Agent['status']) => setNewAgent({ ...newAgent, status: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddAgentOpen(false)}>Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddAgent}>Add Agent</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation */}
          {deleteId && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="bg-white p-6 max-w-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Agent?</h3>
                <p className="text-slate-600 mb-6">Are you sure you want to delete this agent? This action cannot be undone.</p>
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

