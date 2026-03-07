'use client'

import { useState } from 'react'
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
  LayoutGrid,
  LayoutList,
  Plus,
  MapPin,
  Filter,
  MoreVertical,
  Bed,
  Bath,
  Square,
} from 'lucide-react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/dashboard/dashboard-layout'

interface Property {
  id: number
  title: string
  location: string
  price: number
  type: string
  bedrooms: number
  bathrooms: number
  sqft: number
  status: 'active' | 'sold' | 'pending'
  views: number
  description?: string
}

const mockProperties: Property[] = [
  {
    id: 1,
    title: 'Modern Downtown Loft',
    location: 'Downtown District',
    price: 850000,
    type: 'For Sale',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    status: 'active',
    views: 342,
    description: 'A beautiful modern loft in the heart of downtown with stunning city views.',
  },
  {
    id: 2,
    title: 'Luxury Waterfront Villa',
    location: 'Coastal Avenue',
    price: 1250000,
    type: 'For Sale',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 3500,
    status: 'active',
    views: 567,
    description: 'Luxurious waterfront villa with private beach access and infinity pool.',
  },
  {
    id: 3,
    title: 'Suburban Family Home',
    location: 'Green Valley',
    price: 525000,
    type: 'For Rent',
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 2400,
    status: 'active',
    views: 234,
    description: 'Perfect family home in a quiet neighborhood with excellent schools nearby.',
  },
  {
    id: 4,
    title: 'Cozy Studio Apartment',
    location: 'City Center',
    price: 1800,
    type: 'For Rent',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 450,
    status: 'pending',
    views: 89,
    description: 'Cozy studio apartment perfect for young professionals.',
  },
  {
    id: 5,
    title: 'Commercial Office Space',
    location: 'Business Park',
    price: 2500000,
    type: 'Commercial',
    bedrooms: 0,
    bathrooms: 4,
    sqft: 5000,
    status: 'sold',
    views: 445,
    description: 'Prime commercial office space in the business district.',
  },
]

export default function DashboardPropertiesPage() {
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
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
  })
  
  const itemsPerPage = 6
  const filteredProperties = properties.filter((prop) => {
    const matchesSearch =
      prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || prop.type === filterType
    return matchesSearch && matchesFilter
  })

  const paginatedProperties = filteredProperties.slice(0, itemsPerPage)
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Properties</h2>
            <p className="text-gray-600 text-sm mt-0.5">
              Manage and track all your property listings
            </p>
          </div>
          <Button 
            className="bg-secondary hover:bg-secondary/90 text-white w-full sm:w-auto"
            onClick={() => setAddPropertyOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </div>

        {/* Search and Filter */}
        <Card className="bg-white p-4 mb-4">
          <div className="flex flex-col gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
            
            <div className="flex gap-2">
              {/* Filter */}
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="flex-1 h-10">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="For Sale">For Sale</SelectItem>
                  <SelectItem value="For Rent">For Rent</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
              
              {/* View Toggle */}
              <div className="flex gap-1 border border-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('card')}
                  className={`p-1.5 rounded transition ${
                    viewMode === 'card' ? 'bg-secondary text-white' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded transition ${
                    viewMode === 'table' ? 'bg-secondary text-white' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Card View */}
        {viewMode === 'card' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                  <div className="bg-gradient-to-r from-secondary/20 to-secondary/10 h-24 sm:h-32 relative flex items-center justify-center">
                    <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
                    <Badge className={`absolute top-2 right-2 text-[10px] sm:text-xs ${
                      property.status === 'active' ? 'bg-green-500' : property.status === 'sold' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}>
                      {property.status}
                    </Badge>
                  </div>
                  <div className="p-3 sm:p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1 line-clamp-1">{property.title}</h3>
                    <div className="flex items-center gap-1 text-gray-600 text-xs sm:text-sm mb-2">
                      <MapPin className="w-3 h-3" />
                      <span className="line-clamp-1">{property.location}</span>
                    </div>
                    <p className="font-bold text-secondary text-lg mb-2 sm:mb-3">
                      {property.type === 'For Rent' ? `$${property.price}/mo` : `$${(property.price / 1000).toFixed(0)}k`}
                    </p>
                    <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-3 text-center text-xs">
                      <div><p className="font-bold text-gray-900">{property.bedrooms}</p><p className="text-gray-500">Beds</p></div>
                      <div><p className="font-bold text-gray-900">{property.bathrooms}</p><p className="text-gray-500">Baths</p></div>
                      <div><p className="font-bold text-gray-900">{property.sqft}</p><p className="text-gray-500">sqft</p></div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 text-xs mb-3 pb-3 border-b">
                      <Eye className="w-3 h-3" />
                      {property.views} views
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline" className="flex-1 border-gray-200 text-xs sm:text-sm h-8 sm:h-9">
                            <MoreVertical className="w-3 h-3 mr-1" />
                            <span className="hidden xs:inline">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
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
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <Card className="bg-white min-w-[650px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProperties.map((property) => (
                    <TableRow key={property.id} className="hover:bg-gray-50">
                      <TableCell><p className="font-medium text-gray-900 text-sm">{property.title}</p></TableCell>
                      <TableCell className="text-gray-600 text-sm">{property.location}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{property.type}</Badge></TableCell>
                      <TableCell className="font-medium text-gray-900 text-sm">
                        {property.type === 'For Rent' ? `$${property.price}/mo` : `$${(property.price / 1000).toFixed(0)}k`}
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${property.status === 'active' ? 'bg-green-100 text-green-800' : property.status === 'sold' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {property.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm">{property.views}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem onClick={() => setViewProperty(property)} className="text-sm">
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditProperty(property)} className="text-sm">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setDeleteId(property.id)} className="text-red-600 focus:text-red-600 text-sm">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
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
                <div className="w-full h-48 bg-gradient-to-r from-secondary/20 to-secondary/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-gray-300" />
                </div>
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{viewProperty.title}</h3>
                    <Badge className={viewProperty.status === 'active' ? 'bg-green-500' : viewProperty.status === 'sold' ? 'bg-red-500' : 'bg-yellow-500'}>
                      {viewProperty.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    {viewProperty.location}
                  </div>
                  <p className="text-2xl font-bold text-secondary mb-4">
                    {viewProperty.type === 'For Rent' ? `$${viewProperty.price}/mo` : `$${viewProperty.price.toLocaleString()}`}
                  </p>
                  <p className="text-gray-600 mb-4">{viewProperty.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-b">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Bed className="w-4 h-4 text-gray-400" />
                      <span className="font-bold">{viewProperty.bedrooms}</span>
                    </div>
                    <p className="text-xs text-gray-500">Bedrooms</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Bath className="w-4 h-4 text-gray-400" />
                      <span className="font-bold">{viewProperty.bathrooms}</span>
                    </div>
                    <p className="text-xs text-gray-500">Bathrooms</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Square className="w-4 h-4 text-gray-400" />
                      <span className="font-bold">{viewProperty.sqft}</span>
                    </div>
                    <p className="text-xs text-gray-500">Sq Ft</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewProperty(null)}>Close</Button>
              <Button className="bg-secondary hover:bg-secondary/90" onClick={() => { setViewProperty(null); setEditProperty(viewProperty!) }}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Property
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Property Modal */}
        <Dialog open={!!editProperty} onOpenChange={() => setEditProperty(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Edit Property</DialogTitle>
              <DialogDescription>Update the details of your property listing.</DialogDescription>
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
                    <Select value={editProperty.type} onValueChange={(value) => setEditProperty({ ...editProperty, type: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="For Sale">For Sale</SelectItem>
                        <SelectItem value="For Rent">For Rent</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
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
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditProperty(null)}>Cancel</Button>
              <Button className="bg-secondary hover:bg-secondary/90" onClick={handleSaveEdit}>Save Changes</Button>
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
                  <Select value={newProperty.type} onValueChange={(value) => setNewProperty({ ...newProperty, type: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="For Sale">For Sale</SelectItem>
                      <SelectItem value="For Rent">For Rent</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddPropertyOpen(false)}>Cancel</Button>
              <Button className="bg-secondary hover:bg-secondary/90" onClick={() => {
                if (newProperty.title && newProperty.location && newProperty.price) {
                  const property: Property = { id: Date.now(), title: newProperty.title, location: newProperty.location, price: newProperty.price, type: newProperty.type || 'For Sale', bedrooms: newProperty.bedrooms || 0, bathrooms: newProperty.bathrooms || 0, sqft: newProperty.sqft || 0, status: newProperty.status || 'active', views: 0, description: newProperty.description || '' }
                  setProperties([property, ...properties])
                  setNewProperty({ title: '', location: '', price: 0, type: 'For Sale', bedrooms: 0, bathrooms: 0, sqft: 0, status: 'active', views: 0, description: '' })
                  setAddPropertyOpen(false)
                }
              }}>Add Property</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        {deleteId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="bg-white p-6 max-w-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Property?</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this property? This action cannot be undone.</p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1">Cancel</Button>
                <Button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-600 hover:bg-red-700 text-white">Delete</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

