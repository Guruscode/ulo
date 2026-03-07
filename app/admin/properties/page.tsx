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
  Bed,
  Bath,
  Square,
  DollarSign,
  Home,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import AdminLayout from '@/components/admin/admin-layout'

interface Property {
  id: number
  title: string
  location: string
  price: number
  type: 'For Sale' | 'For Rent' | 'Commercial' | 'Land'
  bedrooms: number
  bathrooms: number
  sqft: number
  status: 'active' | 'sold' | 'pending'
  views: number
  description?: string
  featured?: boolean
}

const mockProperties: Property[] = [
  {
    id: 1,
    title: 'Modern Downtown Loft',
    location: 'Downtown District, New York',
    price: 850000,
    type: 'For Sale',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    status: 'active',
    views: 342,
    description: 'A beautiful modern loft in the heart of downtown with stunning city views.',
    featured: true,
  },
  {
    id: 2,
    title: 'Luxury Waterfront Villa',
    location: 'Coastal Avenue, Miami',
    price: 1250000,
    type: 'For Sale',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 3500,
    status: 'active',
    views: 567,
    description: 'Luxurious waterfront villa with private beach access and infinity pool.',
    featured: true,
  },
  {
    id: 3,
    title: 'Suburban Family Home',
    location: 'Green Valley, Chicago',
    price: 3500,
    type: 'For Rent',
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 2400,
    status: 'active',
    views: 234,
    description: 'Perfect family home in a quiet neighborhood with excellent schools nearby.',
    featured: false,
  },
  {
    id: 4,
    title: 'Cozy Studio Apartment',
    location: 'City Center, Seattle',
    price: 1800,
    type: 'For Rent',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 450,
    status: 'pending',
    views: 89,
    description: 'Cozy studio apartment perfect for young professionals.',
    featured: false,
  },
  {
    id: 5,
    title: 'Commercial Office Space',
    location: 'Business Park, San Francisco',
    price: 2500000,
    type: 'Commercial',
    bedrooms: 0,
    bathrooms: 4,
    sqft: 5000,
    status: 'sold',
    views: 445,
    description: 'Prime commercial office space in the business district.',
    featured: false,
  },
  {
    id: 6,
    title: 'Beachfront Paradise',
    location: 'Malibu Beach, California',
    price: 3500000,
    type: 'For Sale',
    bedrooms: 5,
    bathrooms: 4,
    sqft: 4200,
    status: 'active',
    views: 892,
    description: 'Stunning beachfront property with panoramic ocean views.',
    featured: true,
  },
]

const typeColors: Record<string, string> = {
  'For Sale': 'bg-blue-100 text-blue-800',
  'For Rent': 'bg-green-100 text-green-800',
  'Commercial': 'bg-purple-100 text-purple-800',
  'Land': 'bg-orange-100 text-orange-800',
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  sold: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
}

export default function AdminPropertiesPage() {
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [viewProperty, setViewProperty] = useState<Property | null>(null)
  const [editProperty, setEditProperty] = useState<Property | null>(null)
  const [addPropertyOpen, setAddPropertyOpen] = useState(false)
  const [properties, setProperties] = useState<Property[]>(mockProperties)
  
  const [newProperty, setNewProperty] = useState<Partial<Property>>({
    title: '',
    location: '',
    price: 0,
    type: 'For Sale',
    bedrooms: 0,
    bathrooms: 0,
    sqft: 0,
    status: 'active',
    views: 0,
    description: '',
    featured: false,
  })
  
  const itemsPerPage = 10

  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      const matchesSearch =
        prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'all' || prop.type === filterType
      const matchesStatus = filterStatus === 'all' || prop.status === filterStatus

      return matchesSearch && matchesType && matchesStatus
    })
  }, [searchTerm, filterType, filterStatus, properties])

  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredProperties.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredProperties, currentPage])

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage)

  const handleDelete = (id: number) => {
    setProperties(properties.filter(p => p.id !== id))
    setDeleteId(null)
  }

  const handleSaveEdit = () => {
    if (editProperty) {
      setProperties(properties.map(p => p.id === editProperty.id ? editProperty : p))
      setEditProperty(null)
    }
  }

  const handleAddProperty = () => {
    if (newProperty.title && newProperty.location && newProperty.price) {
      const property: Property = {
        id: Date.now(),
        title: newProperty.title || '',
        location: newProperty.location || '',
        price: newProperty.price || 0,
        type: newProperty.type as Property['type'] || 'For Sale',
        bedrooms: newProperty.bedrooms || 0,
        bathrooms: newProperty.bathrooms || 0,
        sqft: newProperty.sqft || 0,
        status: newProperty.status as Property['status'] || 'active',
        views: 0,
        description: newProperty.description || '',
        featured: newProperty.featured || false,
      }
      setProperties([property, ...properties])
      setNewProperty({
        title: '',
        location: '',
        price: 0,
        type: 'For Sale',
        bedrooms: 0,
        bathrooms: 0,
        sqft: 0,
        status: 'active',
        views: 0,
        description: '',
        featured: false,
      })
      setAddPropertyOpen(false)
    }
  }

  const formatPrice = (price: number, type: string) => {
    if (type === 'For Rent') {
      return `$${price.toLocaleString()}/mo`
    }
    return `$${(price / 1000).toFixed(0)}k`
  }

  return (
    <AdminLayout>
      <TooltipProvider delayDuration={0}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Properties Management</h2>
              <p className="text-slate-600 text-sm mt-1">
                Manage all property listings on the platform
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setAddPropertyOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Property
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a new property listing</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Search and Filter */}
          <Card className="bg-white p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search by title or location..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10"
                />
              </div>

              {/* Type Filter */}
              <Select value={filterType} onValueChange={(value) => {
                setFilterType(value)
                setCurrentPage(1)
              }}>
                <SelectTrigger className="w-full md:w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="For Sale">For Sale</SelectItem>
                  <SelectItem value="For Rent">For Rent</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Land">Land</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
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
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
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
            Showing {paginatedProperties.length} of {filteredProperties.length} properties
          </p>

          {/* Table View */}
          {viewMode === 'table' && (
            <Card className="bg-white overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProperties.map((property) => (
                    <motion.tr
                      key={property.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50 transition"
                    >
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-900">{property.title}</p>
                            {property.featured && (
                              <Badge className="bg-yellow-100 text-yellow-800 text-xs">Featured</Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {property.location}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={typeColors[property.type]}>{property.type}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900">
                        {formatPrice(property.price, property.type)}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[property.status]}>
                          {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">{property.views}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => setViewProperty(property)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditProperty(property)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setDeleteId(property.id)} className="text-red-600 focus:text-red-600">
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
              {paginatedProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 h-32 relative flex items-center justify-center">
                      <Home className="w-8 h-8 text-slate-300" />
                      <Badge className={`absolute top-3 right-3 ${statusColors[property.status]}`}>
                        {property.status}
                      </Badge>
                      {property.featured && (
                        <Badge className="absolute top-3 left-3 bg-yellow-500">Featured</Badge>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-slate-900 line-clamp-1">{property.title}</h3>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
                        <MapPin className="w-3 h-3" />
                        <span className="line-clamp-1">{property.location}</span>
                      </div>
                      <p className="font-bold text-blue-600 text-lg mb-3">
                        {formatPrice(property.price, property.type)}
                      </p>
                      <div className="grid grid-cols-3 gap-2 mb-3 text-center text-xs">
                        <div><p className="font-bold text-slate-900">{property.bedrooms}</p><p className="text-slate-500">Beds</p></div>
                        <div><p className="font-bold text-slate-900">{property.bathrooms}</p><p className="text-slate-500">Baths</p></div>
                        <div><p className="font-bold text-slate-900">{property.sqft}</p><p className="text-slate-500">sqft</p></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className={typeColors[property.type]}>{property.type}</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem onClick={() => setViewProperty(property)}><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditProperty(property)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setDeleteId(property.id)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {paginatedProperties.length === 0 && (
            <Card className="bg-white p-12 text-center">
              <Home className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">No properties found</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setAddPropertyOpen(true)}>
                Add Your First Property
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

          {/* View Property Modal */}
          <Dialog open={!!viewProperty} onOpenChange={() => setViewProperty(null)}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Property Details</DialogTitle>
              </DialogHeader>
              {viewProperty && (
                <div className="space-y-6">
                  <div className="w-full h-48 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                    <Home className="w-12 h-12 text-slate-300" />
                  </div>
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{viewProperty.title}</h3>
                      <div className="flex gap-2">
                        {viewProperty.featured && <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>}
                        <Badge className={statusColors[viewProperty.status]}>{viewProperty.status}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600 mb-4">
                      <MapPin className="w-4 h-4" />
                      {viewProperty.location}
                    </div>
                    <p className="text-2xl font-bold text-blue-600 mb-4">{formatPrice(viewProperty.price, viewProperty.type)}</p>
                    <p className="text-slate-600 mb-4">{viewProperty.description}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-4 border-t border-b">
                    <div className="text-center">
                      <Bed className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                      <span className="font-bold">{viewProperty.bedrooms}</span>
                      <p className="text-xs text-slate-500">Bedrooms</p>
                    </div>
                    <div className="text-center">
                      <Bath className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                      <span className="font-bold">{viewProperty.bathrooms}</span>
                      <p className="text-xs text-slate-500">Bathrooms</p>
                    </div>
                    <div className="text-center">
                      <Square className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                      <span className="font-bold">{viewProperty.sqft}</span>
                      <p className="text-xs text-slate-500">Sq Ft</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <Badge className={typeColors[viewProperty.type]}>{viewProperty.type}</Badge>
                    <span className="text-slate-600">Views: <span className="font-medium">{viewProperty.views}</span></span>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewProperty(null)}>Close</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setViewProperty(null); setEditProperty(viewProperty!) }}>
                  <Edit className="w-4 h-4 mr-2" />Edit Property
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Property Modal */}
          <Dialog open={!!editProperty} onOpenChange={() => setEditProperty(null)}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Edit Property</DialogTitle>
                <DialogDescription>Update the property details.</DialogDescription>
              </DialogHeader>
              {editProperty && (
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input value={editProperty.title} onChange={(e) => setEditProperty({ ...editProperty, title: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input value={editProperty.location} onChange={(e) => setEditProperty({ ...editProperty, location: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea value={editProperty.description || ''} onChange={(e) => setEditProperty({ ...editProperty, description: e.target.value })} rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Price</Label>
                      <Input type="number" value={editProperty.price} onChange={(e) => setEditProperty({ ...editProperty, price: parseInt(e.target.value) })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={editProperty.type} onValueChange={(value: Property['type']) => setEditProperty({ ...editProperty, type: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="For Sale">For Sale</SelectItem>
                          <SelectItem value="For Rent">For Rent</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                          <SelectItem value="Land">Land</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Bedrooms</Label>
                      <Input type="number" value={editProperty.bedrooms} onChange={(e) => setEditProperty({ ...editProperty, bedrooms: parseInt(e.target.value) })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Bathrooms</Label>
                      <Input type="number" step="0.5" value={editProperty.bathrooms} onChange={(e) => setEditProperty({ ...editProperty, bathrooms: parseFloat(e.target.value) })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Sq Ft</Label>
                      <Input type="number" value={editProperty.sqft} onChange={(e) => setEditProperty({ ...editProperty, sqft: parseInt(e.target.value) })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={editProperty.status} onValueChange={(value: Property['status']) => setEditProperty({ ...editProperty, status: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="sold">Sold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 flex items-center gap-2 pt-6">
                      <input type="checkbox" id="featured" checked={editProperty.featured} onChange={(e) => setEditProperty({ ...editProperty, featured: e.target.checked })} className="w-4 h-4" />
                      <Label htmlFor="featured">Featured Property</Label>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditProperty(null)}>Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveEdit}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Property Modal */}
          <Dialog open={addPropertyOpen} onOpenChange={setAddPropertyOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Add New Property</DialogTitle>
                <DialogDescription>Create a new property listing.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input value={newProperty.title} onChange={(e) => setNewProperty({ ...newProperty, title: e.target.value })} placeholder="Property title" />
                  </div>
                  <div className="space-y-2">
                    <Label>Location *</Label>
                    <Input value={newProperty.location} onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })} placeholder="City, State" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={newProperty.description || ''} onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })} placeholder="Describe the property..." rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price *</Label>
                    <Input type="number" value={newProperty.price || ''} onChange={(e) => setNewProperty({ ...newProperty, price: parseInt(e.target.value) || 0 })} placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={newProperty.type} onValueChange={(value: Property['type']) => setNewProperty({ ...newProperty, type: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="For Sale">For Sale</SelectItem>
                        <SelectItem value="For Rent">For Rent</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Land">Land</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Bedrooms</Label>
                    <Input type="number" value={newProperty.bedrooms || ''} onChange={(e) => setNewProperty({ ...newProperty, bedrooms: parseInt(e.target.value) || 0 })} placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Bathrooms</Label>
                    <Input type="number" step="0.5" value={newProperty.bathrooms || ''} onChange={(e) => setNewProperty({ ...newProperty, bathrooms: parseFloat(e.target.value) || 0 })} placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Sq Ft</Label>
                    <Input type="number" value={newProperty.sqft || ''} onChange={(e) => setNewProperty({ ...newProperty, sqft: parseInt(e.target.value) || 0 })} placeholder="0" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={newProperty.status} onValueChange={(value: Property['status']) => setNewProperty({ ...newProperty, status: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 flex items-center gap-2 pt-6">
                    <input type="checkbox" id="new-featured" checked={newProperty.featured} onChange={(e) => setNewProperty({ ...newProperty, featured: e.target.checked })} className="w-4 h-4" />
                    <Label htmlFor="new-featured">Featured Property</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddPropertyOpen(false)}>Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddProperty}>Add Property</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation */}
          {deleteId && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="bg-white p-6 max-w-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Property?</h3>
                <p className="text-slate-600 mb-6">Are you sure you want to delete this property? This action cannot be undone.</p>
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

