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
  Building2,
  Star,
  Bed,
  Phone,
  Mail,
  Wifi,
  Waves,
  Dumbbell,
  Utensils,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import AdminLayout from '@/components/admin/admin-layout'

interface Hotel {
  id: string
  name: string
  location: string
  description: string
  rating: number
  reviewCount: number
  price: string
  image: string
  amenities: string[]
  contact: {
    phone: string
    email: string
    address: string
  }
  rooms: number
  status: 'active' | 'inactive' | 'pending'
}

const mockHotels: Hotel[] = [
  {
    id: 'grand-hotel-lagos',
    name: 'Grand Hotel Lagos',
    location: 'Victoria Island, Lagos',
    description: 'Luxury 5-star hotel with stunning ocean views and world-class amenities.',
    rating: 4.8,
    reviewCount: 245,
    price: '₦85,000',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa & Wellness', 'Fitness Center', 'Restaurant & Bar'],
    contact: { phone: '+234 800 123 4567', email: 'info@grandlagos.com', address: 'Plot 123, Victoria Island, Lagos' },
    rooms: 12,
    status: 'active',
  },
  {
    id: 'ocean-view-resort',
    name: 'Ocean View Resort',
    location: 'Lekki Peninsula, Lagos',
    description: 'Beachfront resort with private beach access and infinity pool.',
    rating: 4.6,
    reviewCount: 189,
    price: '₦120,000',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
    amenities: ['Free WiFi', 'Swimming Pool', 'Private Beach', 'Water Sports', 'Beach Bar'],
    contact: { phone: '+234 800 234 5678', email: 'reservations@oceanview.com', address: 'Lekki Peninsula, Lagos' },
    rooms: 8,
    status: 'active',
  },
  {
    id: 'city-center-suites',
    name: 'City Center Suites',
    location: 'Ikoyi, Lagos',
    description: 'Modern suites in the heart of the city, perfect for business travelers.',
    rating: 4.4,
    reviewCount: 156,
    price: '₦45,000',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
    amenities: ['Free WiFi', 'Business Center', '24/7 Room Service', 'Gym', 'Restaurant'],
    contact: { phone: '+234 800 345 6789', email: 'bookings@citycentersuites.com', address: 'Ikoyi, Lagos' },
    rooms: 20,
    status: 'active',
  },
  {
    id: 'safari-lodge',
    name: 'Safari Lodge',
    location: 'Ogun State',
    description: 'Unique lodge experience with nature walks and wildlife viewing.',
    rating: 4.7,
    reviewCount: 98,
    price: '₦65,000',
    image: 'https://images.unsplash.com/photo-1496417263034-38ec4f0d665a?w=800&h=600&fit=crop',
    amenities: ['Free WiFi', 'Nature Walks', 'Restaurant', 'Bar', 'Parking'],
    contact: { phone: '+234 800 456 7890', email: 'info@safarilodge.com', address: 'Ogun State, Nigeria' },
    rooms: 6,
    status: 'pending',
  },
  {
    id: 'airport-express',
    name: 'Airport Express Hotel',
    location: 'Ikeja, Lagos',
    description: 'Convenient hotel minutes from Murtala Muhammed International Airport.',
    rating: 4.2,
    reviewCount: 312,
    price: '₦25,000',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
    amenities: ['Free WiFi', 'Airport Shuttle', '24/7 Reception', 'Restaurant', 'Parking'],
    contact: { phone: '+234 800 567 8901', email: 'stay@airportexpress.com', address: 'Ikeja, Lagos' },
    rooms: 45,
    status: 'active',
  },
]

const amenityOptions = [
  'Free WiFi', 'Swimming Pool', 'Spa & Wellness', 'Fitness Center',
  'Restaurant & Bar', '24/7 Room Service', 'Concierge', 'Airport Shuttle',
  'Business Center', 'Parking', 'Private Beach', 'Water Sports',
  'Beach Bar', 'Nature Walks', 'Gym', 'Bar'
]

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
}

export default function AdminHotelsPage() {
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [viewHotel, setViewHotel] = useState<Hotel | null>(null)
  const [editHotel, setEditHotel] = useState<Hotel | null>(null)
const [addHotelOpen, setAddHotelOpen] = useState(false)
  const [approveHotel, setApproveHotel] = useState<Hotel | null>(null)
  const [rejectHotel, setRejectHotel] = useState<Hotel | null>(null)
  const [hotels, setHotels] = useState<Hotel[]>(mockHotels)
  
  const [newHotel, setNewHotel] = useState<Partial<Hotel>>({
    name: '',
    location: '',
    description: '',
    rating: 4.5,
    reviewCount: 0,
    price: '',
    image: '',
    amenities: [],
    contact: { phone: '', email: '', address: '' },
    rooms: 0,
    status: 'active',
  })
  
  const itemsPerPage = 10

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      const matchesSearch =
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || hotel.status === filterStatus

      return matchesSearch && matchesStatus
    })
  }, [searchTerm, filterStatus, hotels])

  const paginatedHotels = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredHotels.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredHotels, currentPage])

  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage)

  const handleDelete = (id: string) => {
    setHotels(hotels.filter(h => h.id !== id))
    setDeleteId(null)
  }

  const handleSaveEdit = () => {
    if (editHotel) {
      setHotels(hotels.map(h => h.id === editHotel.id ? editHotel : h))
      setEditHotel(null)
    }
  }

  const handleAddHotel = () => {
    if (newHotel.name && newHotel.location && newHotel.price) {
      const hotel: Hotel = {
        id: newHotel.name.toLowerCase().replace(/\s+/g, '-'),
        name: newHotel.name || '',
        location: newHotel.location || '',
        description: newHotel.description || '',
        rating: newHotel.rating || 4.5,
        reviewCount: newHotel.reviewCount || 0,
        price: newHotel.price || '',
        image: newHotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
        amenities: newHotel.amenities || [],
        contact: newHotel.contact || { phone: '', email: '', address: '' },
        rooms: newHotel.rooms || 0,
        status: newHotel.status as Hotel['status'] || 'active',
      }
      setHotels([hotel, ...hotels])
      setNewHotel({
        name: '',
        location: '',
        description: '',
        rating: 4.5,
        reviewCount: 0,
        price: '',
        image: '',
        amenities: [],
        contact: { phone: '', email: '', address: '' },
        rooms: 0,
        status: 'active',
      })
setAddHotelOpen(false)
    }
  }

  const handleApproveHotel = () => {
    if (approveHotel) {
      setHotels(hotels.map(h => h.id === approveHotel.id ? { ...h, status: 'active' as const } : h))
      setApproveHotel(null)
    }
  }

  const handleRejectHotel = () => {
    if (rejectHotel) {
      setHotels(hotels.map(h => h.id === rejectHotel.id ? { ...h, status: 'inactive' as const } : h))
      setRejectHotel(null)
    }
  }

  const toggleAmenity = (amenity: string, isNew: boolean) => {
    if (isNew) {
      const amenities = newHotel.amenities || []
      if (amenities.includes(amenity)) {
        setNewHotel({ ...newHotel, amenities: amenities.filter(a => a !== amenity) })
      } else {
        setNewHotel({ ...newHotel, amenities: [...amenities, amenity] })
      }
    } else if (editHotel) {
      const amenities = editHotel.amenities || []
      if (amenities.includes(amenity)) {
        setEditHotel({ ...editHotel, amenities: amenities.filter(a => a !== amenity) })
      } else {
        setEditHotel({ ...editHotel, amenities: [...amenities, amenity] })
      }
    }
  }

  return (
    <AdminLayout>
      <TooltipProvider delayDuration={0}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Hotels Management</h2>
              <p className="text-slate-600 text-sm mt-1">
                Manage all hotel listings on the platform
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setAddHotelOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Hotel
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a new hotel listing</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Search and Filter */}
          <Card className="bg-white p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search by name or location..."
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
            Showing {paginatedHotels.length} of {filteredHotels.length} hotels
          </p>

          {/* Table View */}
          {viewMode === 'table' && (
            <Card className="bg-white overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hotel</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Rooms</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedHotels.map((hotel) => (
                    <motion.tr
                      key={hotel.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50 transition"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${hotel.image})` }} />
                          <div>
                            <p className="font-medium text-slate-900">{hotel.name}</p>
                            <p className="text-sm text-slate-500 line-clamp-1">{hotel.description.substring(0, 50)}...</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-slate-600">
                          <MapPin className="w-3 h-3" />
                          {hotel.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{hotel.rating}</span>
                          <span className="text-slate-500">({hotel.reviewCount})</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900">
                        {hotel.price}
                        <span className="text-slate-500 text-sm">/night</span>
                      </TableCell>
                      <TableCell className="text-slate-600">{hotel.rooms} rooms</TableCell>
                      <TableCell>
                        <Badge className={statusColors[hotel.status]}>
                          {hotel.status.charAt(0).toUpperCase() + hotel.status.slice(1)}
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
                            <DropdownMenuItem onClick={() => setViewHotel(hotel)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditHotel(hotel)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {hotel.status === 'pending' && (
                              <>
                                <DropdownMenuItem onClick={() => setApproveHotel(hotel)}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setRejectHotel(hotel)}>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            <DropdownMenuItem onClick={() => setDeleteId(hotel.id)} className="text-red-600 focus:text-red-600">
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
              {paginatedHotels.map((hotel, index) => (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${hotel.image})` }} />
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-slate-900 line-clamp-1">{hotel.name}</h3>
                        <Badge className={statusColors[hotel.status]}>{hotel.status}</Badge>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
                        <MapPin className="w-3 h-3" />
                        <span className="line-clamp-1">{hotel.location}</span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{hotel.rating}</span>
                          <span className="text-slate-500 text-xs">({hotel.reviewCount})</span>
                        </div>
                        <p className="font-bold text-blue-600">{hotel.price}<span className="text-slate-500 text-sm">/night</span></p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{hotel.rooms} rooms</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem onClick={() => setViewHotel(hotel)}><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditHotel(hotel)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setDeleteId(hotel.id)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
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
          {paginatedHotels.length === 0 && (
            <Card className="bg-white p-12 text-center">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">No hotels found</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setAddHotelOpen(true)}>
                Add Your First Hotel
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

          {/* View Hotel Modal */}
          <Dialog open={!!viewHotel} onOpenChange={() => setViewHotel(null)}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Hotel Details</DialogTitle>
              </DialogHeader>
              {viewHotel && (
                <div className="space-y-6">
                  <div className="w-full h-48 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${viewHotel.image})` }} />
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{viewHotel.name}</h3>
                      <Badge className={statusColors[viewHotel.status]}>{viewHotel.status}</Badge>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600 mb-4">
                      <MapPin className="w-4 h-4" />
                      {viewHotel.location}
                    </div>
                    <p className="text-2xl font-bold text-blue-600 mb-4">
                      {viewHotel.price} <span className="text-sm font-normal text-slate-500">/night</span>
                    </p>
                    <p className="text-slate-600 mb-4">{viewHotel.description}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-4 border-t border-b">
                    <div className="text-center">
                      <Star className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                      <span className="font-bold">{viewHotel.rating}</span>
                      <p className="text-xs text-slate-500">Rating</p>
                    </div>
                    <div className="text-center">
                      <Bed className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                      <span className="font-bold">{viewHotel.rooms}</span>
                      <p className="text-xs text-slate-500">Rooms</p>
                    </div>
                    <div className="text-center">
                      <Star className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                      <span className="font-bold">{viewHotel.reviewCount}</span>
                      <p className="text-xs text-slate-500">Reviews</p>
                    </div>
                  </div>
                  {viewHotel.amenities.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {viewHotel.amenities.map((amenity, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">{amenity}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Contact</h4>
                    <div className="space-y-1 text-sm text-slate-600">
                      <p className="flex items-center gap-2"><Phone className="w-4 h-4" />{viewHotel.contact.phone}</p>
                      <p className="flex items-center gap-2"><Mail className="w-4 h-4" />{viewHotel.contact.email}</p>
                      <p className="flex items-center gap-2"><MapPin className="w-4 h-4" />{viewHotel.contact.address}</p>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewHotel(null)}>Close</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setViewHotel(null); setEditHotel(viewHotel!) }}>
                  <Edit className="w-4 h-4 mr-2" />Edit Hotel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Hotel Modal */}
          <Dialog open={!!editHotel} onOpenChange={() => setEditHotel(null)}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Edit Hotel</DialogTitle>
                <DialogDescription>Update the hotel details.</DialogDescription>
              </DialogHeader>
              {editHotel && (
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Hotel Name</Label>
                      <Input value={editHotel.name} onChange={(e) => setEditHotel({ ...editHotel, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input value={editHotel.location} onChange={(e) => setEditHotel({ ...editHotel, location: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea value={editHotel.description} onChange={(e) => setEditHotel({ ...editHotel, description: e.target.value })} rows={3} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Price per night</Label>
                      <Input value={editHotel.price} onChange={(e) => setEditHotel({ ...editHotel, price: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Rating</Label>
                      <Input type="number" step="0.1" max="5" value={editHotel.rating} onChange={(e) => setEditHotel({ ...editHotel, rating: parseFloat(e.target.value) })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Rooms</Label>
                      <Input type="number" value={editHotel.rooms} onChange={(e) => setEditHotel({ ...editHotel, rooms: parseInt(e.target.value) })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input value={editHotel.contact?.phone} onChange={(e) => setEditHotel({ ...editHotel, contact: { ...editHotel.contact!, phone: e.target.value } })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={editHotel.contact?.email} onChange={(e) => setEditHotel({ ...editHotel, contact: { ...editHotel.contact!, email: e.target.value } })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={editHotel.status} onValueChange={(value: Hotel['status']) => setEditHotel({ ...editHotel, status: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Amenities</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {amenityOptions.map(amenity => (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => toggleAmenity(amenity, false)}
                          className={`text-xs px-3 py-2 rounded-lg border transition-all ${
                            editHotel.amenities?.includes(amenity)
                              ? 'bg-blue-50 border-blue-500 text-blue-700'
                              : 'border-slate-200 text-slate-600 hover:border-blue-300'
                          }`}
                        >
                          {amenity}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditHotel(null)}>Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveEdit}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Hotel Modal */}
          <Dialog open={addHotelOpen} onOpenChange={setAddHotelOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Add New Hotel</DialogTitle>
                <DialogDescription>Create a new hotel listing.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Hotel Name *</Label>
                    <Input value={newHotel.name} onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })} placeholder="Grand Hotel Lagos" />
                  </div>
                  <div className="space-y-2">
                    <Label>Location *</Label>
                    <Input value={newHotel.location} onChange={(e) => setNewHotel({ ...newHotel, location: e.target.value })} placeholder="Victoria Island, Lagos" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={newHotel.description} onChange={(e) => setNewHotel({ ...newHotel, description: e.target.value })} placeholder="Describe the hotel..." rows={3} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Price per night *</Label>
                    <Input value={newHotel.price} onChange={(e) => setNewHotel({ ...newHotel, price: e.target.value })} placeholder="₦85,000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Rating</Label>
                    <Input type="number" step="0.1" max="5" value={newHotel.rating} onChange={(e) => setNewHotel({ ...newHotel, rating: parseFloat(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Rooms</Label>
                    <Input type="number" value={newHotel.rooms || ''} onChange={(e) => setNewHotel({ ...newHotel, rooms: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={newHotel.contact?.phone} onChange={(e) => setNewHotel({ ...newHotel, contact: { ...newHotel.contact!, phone: e.target.value } })} placeholder="+234 xxx xxx xxxx" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={newHotel.contact?.email} onChange={(e) => setNewHotel({ ...newHotel, contact: { ...newHotel.contact!, email: e.target.value } })} placeholder="hotel@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={newHotel.status} onValueChange={(value: Hotel['status']) => setNewHotel({ ...newHotel, status: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Amenities</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {amenityOptions.map(amenity => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity, true)}
                        className={`text-xs px-3 py-2 rounded-lg border transition-all ${
                          newHotel.amenities?.includes(amenity)
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'border-slate-200 text-slate-600 hover:border-blue-300'
                        }`}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddHotelOpen(false)}>Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddHotel}>Add Hotel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

{/* Delete Confirmation */}
          {deleteId && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="bg-white p-6 max-w-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Hotel?</h3>
                <p className="text-slate-600 mb-6">Are you sure you want to delete this hotel? This action cannot be undone.</p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1">Cancel</Button>
                  <Button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-600 hover:bg-red-700 text-white">Delete</Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Approve Hotel Confirmation */}
          {approveHotel && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="bg-white p-6 max-w-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Approve Hotel?</h3>
                <p className="text-slate-600 mb-6">
                  Are you sure you want to approve <strong>{approveHotel.name}</strong>? It will be published and visible to all users.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setApproveHotel(null)} className="flex-1">Cancel</Button>
                  <Button onClick={handleApproveHotel} className="flex-1 bg-green-600 hover:bg-green-700 text-white">Approve</Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Reject Hotel Confirmation */}
          {rejectHotel && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="bg-white p-6 max-w-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Reject Hotel?</h3>
                <p className="text-slate-600 mb-6">
                  Are you sure you want to reject <strong>{rejectHotel.name}</strong>? It will be marked as unavailable.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setRejectHotel(null)} className="flex-1">Cancel</Button>
                  <Button onClick={handleRejectHotel} className="flex-1 bg-red-600 hover:bg-red-700 text-white">Reject</Button>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </TooltipProvider>
    </AdminLayout>
  )
}

