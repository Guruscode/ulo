'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  MoreVertical,
  MapPin,
  Star,
  Wifi,
  Waves,
  Utensils,
  Car,
  Dumbbell,
  Eye,
  BedDouble,
  List
} from 'lucide-react'
import Link from 'next/link'
import { hotels, type Hotel, type Room } from '@/lib/hotels'

const amenityOptions = [
  'Free WiFi', 'Swimming Pool', 'Spa & Wellness', 'Fitness Center',
  'Restaurant & Bar', '24/7 Room Service', 'Concierge', 'Airport Shuttle',
  'Business Center', 'Parking', 'Rooftop Pool', 'Fine Dining Restaurant',
  'Lounge Bar', 'Valet Parking', 'Conference Rooms', 'Beauty Salon',
  'Laundry Service', 'Private Beach', 'Water Sports', 'Beach Bar',
  'Yacht Club', 'Tennis Court', 'Kids Club', 'Helipad'
]

const bedTypeOptions = ['Single Bed', 'Double Bed', 'Queen Bed', 'King Bed', 'Twin Beds']

export default function HotelsManager() {
  const [hotelsList, setHotelsList] = useState<Hotel[]>(hotels)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [isRoomsDialogOpen, setIsRoomsDialogOpen] = useState(false)
  const [isAddRoomDialogOpen, setIsAddRoomDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    name: '',
    description: '',
    price: '',
    priceValue: 0,
    maxGuests: 2,
    bedType: 'King Bed',
    size: '',
    amenities: [],
    images: [],
    available: true
  })
  
  const [newHotel, setNewHotel] = useState<Partial<Hotel>>({
    name: '',
    location: '',
    description: '',
    rating: 4.5,
    reviewCount: 0,
    price: '',
    image: '',
    images: [],
    amenities: [],
    contact: { phone: '', email: '', address: '' },
    rooms: []
  })

  const filteredHotels = hotelsList.filter(hotel =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddHotel = () => {
    if (newHotel.name && newHotel.location && newHotel.price) {
      const hotel: Hotel = {
        id: newHotel.name.toLowerCase().replace(/\s+/g, '-'),
        name: newHotel.name,
        location: newHotel.location,
        description: newHotel.description || '',
        rating: newHotel.rating || 4.5,
        reviewCount: newHotel.reviewCount || 0,
        price: newHotel.price,
        image: newHotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop',
        images: newHotel.images?.length ? newHotel.images : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop'],
        amenities: newHotel.amenities || [],
        contact: newHotel.contact || { phone: '', email: '', address: '' },
        rooms: newHotel.rooms || []
      }
      setHotelsList([...hotelsList, hotel])
      setNewHotel({
        name: '',
        location: '',
        description: '',
        rating: 4.5,
        reviewCount: 0,
        price: '',
        image: '',
        images: [],
        amenities: [],
        contact: { phone: '', email: '', address: '' },
        rooms: []
      })
      setIsAddDialogOpen(false)
    }
  }

  const handleEditHotel = (hotel: Hotel) => {
    setEditingHotel(hotel)
    setIsEditDialogOpen(true)
  }

  const handleDeleteHotel = (hotelId: string) => {
    if (confirm('Are you sure you want to delete this hotel?')) {
      setHotelsList(hotelsList.filter(h => h.id !== hotelId))
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
    } else if (editingHotel) {
      const amenities = editingHotel.amenities || []
      if (amenities.includes(amenity)) {
        setEditingHotel({ ...editingHotel, amenities: amenities.filter(a => a !== amenity) })
      } else {
        setEditingHotel({ ...editingHotel, amenities: [...amenities, amenity] })
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Hotels</h2>
          <p className="text-gray-600">Add, edit, and manage your hotel listings</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-secondary hover:bg-secondary/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add New Hotel
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Hotel</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new hotel to your listings.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Hotel Name *</Label>
                  <Input 
                    id="name" 
                    value={newHotel.name}
                    onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
                    placeholder="e.g., Grand Hotel Lagos"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input 
                    id="location" 
                    value={newHotel.location}
                    onChange={(e) => setNewHotel({ ...newHotel, location: e.target.value })}
                    placeholder="e.g., Victoria Island, Lagos"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea 
                  id="description"
                  value={newHotel.description}
                  onChange={(e) => setNewHotel({ ...newHotel, description: e.target.value })}
                  placeholder="Describe your hotel..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price per night *</Label>
                  <Input 
                    id="price" 
                    value={newHotel.price}
                    onChange={(e) => setNewHotel({ ...newHotel, price: e.target.value })}
                    placeholder="₦85,000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Input 
                    id="rating" 
                    type="number"
                    step="0.1"
                    max="5"
                    value={newHotel.rating}
                    onChange={(e) => setNewHotel({ ...newHotel, rating: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reviewCount">Review Count</Label>
                  <Input 
                    id="reviewCount" 
                    type="number"
                    value={newHotel.reviewCount}
                    onChange={(e) => setNewHotel({ ...newHotel, reviewCount: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Main Image URL</Label>
                <Input 
                  id="image" 
                  value={newHotel.image}
                  onChange={(e) => setNewHotel({ ...newHotel, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    value={newHotel.contact?.phone}
                    onChange={(e) => setNewHotel({ ...newHotel, contact: { ...newHotel.contact!, phone: e.target.value } })}
                    placeholder="+234 xxx xxx xxxx"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    value={newHotel.contact?.email}
                    onChange={(e) => setNewHotel({ ...newHotel, contact: { ...newHotel.contact!, email: e.target.value } })}
                    placeholder="hotel@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    value={newHotel.contact?.address}
                    onChange={(e) => setNewHotel({ ...newHotel, contact: { ...newHotel.contact!, address: e.target.value } })}
                    placeholder="Hotel address"
                  />
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
                          ? 'bg-secondary/10 border-secondary text-secondary'
                          : 'border-gray-200 text-gray-600 hover:border-secondary/50'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button className="bg-secondary hover:bg-secondary/90" onClick={handleAddHotel}>Add Hotel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search hotels..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Hotels Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Hotel</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Location</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Rating</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Price</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Rooms</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredHotels.map((hotel) => (
                <tr key={hotel.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${hotel.image})` }} />
                      <div>
                        <p className="font-medium text-gray-900">{hotel.name}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{hotel.description.substring(0, 50)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {hotel.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{hotel.rating}</span>
                      <span className="text-gray-500">({hotel.reviewCount})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-secondary">{hotel.price}</span>
                    <span className="text-gray-500 text-sm">/night</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600">{hotel.rooms.length} rooms</span>
                  </td>
                  <td className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => {
                          setSelectedHotel(hotel)
                          setIsViewDialogOpen(true)
                        }}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditHotel(hotel)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedHotel(hotel)
                          setIsRoomsDialogOpen(true)
                        }}>
                          <List className="mr-2 h-4 w-4" />
                          View Rooms
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedHotel(hotel)
                          setIsAddRoomDialogOpen(true)
                        }}>
                          <BedDouble className="mr-2 h-4 w-4" />
                          Add Room
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteHotel(hotel.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredHotels.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hotels found</p>
          </div>
        )}
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Hotel</DialogTitle>
            <DialogDescription>
              Update the hotel details.
            </DialogDescription>
          </DialogHeader>
          
          {editingHotel && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Hotel Name *</Label>
                  <Input 
                    id="edit-name" 
                    value={editingHotel.name}
                    onChange={(e) => setEditingHotel({ ...editingHotel, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Location *</Label>
                  <Input 
                    id="edit-location" 
                    value={editingHotel.location}
                    onChange={(e) => setEditingHotel({ ...editingHotel, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <textarea 
                  id="edit-description"
                  value={editingHotel.description}
                  onChange={(e) => setEditingHotel({ ...editingHotel, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price per night *</Label>
                  <Input 
                    id="edit-price" 
                    value={editingHotel.price}
                    onChange={(e) => setEditingHotel({ ...editingHotel, price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-rating">Rating</Label>
                  <Input 
                    id="edit-rating" 
                    type="number"
                    step="0.1"
                    max="5"
                    value={editingHotel.rating}
                    onChange={(e) => setEditingHotel({ ...editingHotel, rating: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-reviews">Review Count</Label>
                  <Input 
                    id="edit-reviews" 
                    type="number"
                    value={editingHotel.reviewCount}
                    onChange={(e) => setEditingHotel({ ...editingHotel, reviewCount: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-image">Main Image URL</Label>
                <Input 
                  id="edit-image" 
                  value={editingHotel.image}
                  onChange={(e) => setEditingHotel({ ...editingHotel, image: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input 
                    id="edit-phone" 
                    value={editingHotel.contact?.phone}
                    onChange={(e) => setEditingHotel({ ...editingHotel, contact: { ...editingHotel.contact!, phone: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input 
                    id="edit-email" 
                    value={editingHotel.contact?.email}
                    onChange={(e) => setEditingHotel({ ...editingHotel, contact: { ...editingHotel.contact!, email: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-address">Address</Label>
                  <Input 
                    id="edit-address" 
                    value={editingHotel.contact?.address}
                    onChange={(e) => setEditingHotel({ ...editingHotel, contact: { ...editingHotel.contact!, address: e.target.value } })}
                  />
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
                        editingHotel.amenities?.includes(amenity)
                          ? 'bg-secondary/10 border-secondary text-secondary'
                          : 'border-gray-200 text-gray-600 hover:border-secondary/50'
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
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button 
              className="bg-secondary hover:bg-secondary/90" 
              onClick={() => {
                if (editingHotel) {
                  setHotelsList(hotelsList.map(h => h.id === editingHotel.id ? editingHotel : h))
                  setIsEditDialogOpen(false)
                }
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Rooms Dialog */}
      <Dialog open={isRoomsDialogOpen} onOpenChange={setIsRoomsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rooms - {selectedHotel?.name}</DialogTitle>
            <DialogDescription>
              View all rooms for this hotel
            </DialogDescription>
          </DialogHeader>
          
          {selectedHotel && (
            <div className="space-y-4">
              {selectedHotel.rooms.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No rooms added yet. Click "Add Room" to add rooms.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedHotel.rooms.map((room) => (
                    <div key={room.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${room.images[0]})` }} />
                        <div>
                          <p className="font-medium text-gray-900">{room.name}</p>
                          <p className="text-sm text-gray-500">{room.bedType} • {room.size} • Up to {room.maxGuests} guests</p>
                          <p className="text-sm font-semibold text-secondary">{room.price}/night</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${room.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {room.available ? 'Available' : 'Unavailable'}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            const updatedHotels = hotelsList.map(h => {
                              if (h.id === selectedHotel.id) {
                                return {
                                  ...h,
                                  rooms: h.rooms.filter(r => r.id !== room.id)
                                }
                              }
                              return h
                            })
                            setHotelsList(updatedHotels)
                            setSelectedHotel(updatedHotels.find(h => h.id === selectedHotel.id) || null)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoomsDialogOpen(false)}>Close</Button>
            <Button 
              className="bg-secondary hover:bg-secondary/90"
              onClick={() => {
                setIsRoomsDialogOpen(false)
                setIsAddRoomDialogOpen(true)
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Hotel Modal */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Hotel Details</DialogTitle>
          </DialogHeader>
          {selectedHotel && (
            <div className="space-y-6">
              {/* Hotel Image */}
              <div 
                className="w-full h-48 rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${selectedHotel.image})` }}
              />
              
              {/* Hotel Info */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{selectedHotel.name}</h3>
                  <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-sm">{selectedHotel.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gray-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  {selectedHotel.location}
                </div>
                <p className="text-2xl font-bold text-secondary mb-4">
                  {selectedHotel.price} <span className="text-sm font-normal text-gray-500">/night</span>
                </p>
                <p className="text-gray-600 mb-4">{selectedHotel.description}</p>
              </div>

              {/* Contact Info */}
              {selectedHotel.contact && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {selectedHotel.contact.phone && (
                      <p className="text-gray-600">📞 {selectedHotel.contact.phone}</p>
                    )}
                    {selectedHotel.contact.email && (
                      <p className="text-gray-600">✉️ {selectedHotel.contact.email}</p>
                    )}
                    {selectedHotel.contact.address && (
                      <p className="text-gray-600 col-span-2">📍 {selectedHotel.contact.address}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {selectedHotel.amenities && selectedHotel.amenities.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedHotel.amenities.map((amenity, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rooms Summary */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Rooms ({selectedHotel.rooms.length})
                </h4>
                {selectedHotel.rooms.length === 0 ? (
                  <p className="text-gray-500 text-sm">No rooms available</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedHotel.rooms.slice(0, 3).map((room) => (
                      <div key={room.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium text-sm">{room.name}</p>
                          <p className="text-xs text-gray-500">{room.bedType} • Up to {room.maxGuests} guests</p>
                        </div>
                        <p className="font-semibold text-secondary text-sm">{room.price}</p>
                      </div>
                    ))}
                    {selectedHotel.rooms.length > 3 && (
                      <p className="text-xs text-gray-500 text-center">
                        +{selectedHotel.rooms.length - 3} more rooms
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Reviews */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Reviews</h4>
                <p className="text-gray-600 text-sm">
                  {selectedHotel.reviewCount} reviews
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            <Button className="bg-secondary hover:bg-secondary/90" onClick={() => {
              setIsViewDialogOpen(false)
              if (selectedHotel) handleEditHotel(selectedHotel)
            }}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Hotel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Room Dialog */}
      <Dialog open={isAddRoomDialogOpen} onOpenChange={setIsAddRoomDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Room - {selectedHotel?.name}</DialogTitle>
            <DialogDescription>
              Add a new room to this hotel.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room-name">Room Name *</Label>
                <Input 
                  id="room-name" 
                  value={newRoom.name}
                  onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                  placeholder="e.g., Deluxe Suite"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room-price">Price per night *</Label>
                <Input 
                  id="room-price" 
                  value={newRoom.price}
                  onChange={(e) => setNewRoom({ 
                    ...newRoom, 
                    price: e.target.value,
                    priceValue: parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0
                  })}
                  placeholder="₦85,000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="room-description">Description</Label>
              <textarea 
                id="room-description"
                value={newRoom.description}
                onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                placeholder="Describe the room..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room-guests">Max Guests</Label>
                <Input 
                  id="room-guests" 
                  type="number"
                  value={newRoom.maxGuests}
                  onChange={(e) => setNewRoom({ ...newRoom, maxGuests: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room-bed">Bed Type</Label>
                <select 
                  id="room-bed"
                  value={newRoom.bedType}
                  onChange={(e) => setNewRoom({ ...newRoom, bedType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  {bedTypeOptions.map(bt => (
                    <option key={bt} value={bt}>{bt}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="room-size">Size</Label>
                <Input 
                  id="room-size" 
                  value={newRoom.size}
                  onChange={(e) => setNewRoom({ ...newRoom, size: e.target.value })}
                  placeholder="e.g., 45 sqm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="room-image">Room Image URL</Label>
              <Input 
                id="room-image" 
                value={newRoom.images?.[0] || ''}
                onChange={(e) => setNewRoom({ ...newRoom, images: [e.target.value] })}
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="room-available"
                checked={newRoom.available}
                onChange={(e) => setNewRoom({ ...newRoom, available: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="room-available">Room Available</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRoomDialogOpen(false)}>Cancel</Button>
            <Button 
              className="bg-secondary hover:bg-secondary/90"
              onClick={() => {
                if (selectedHotel && newRoom.name && newRoom.price) {
                  const room: Room = {
                    id: newRoom.name.toLowerCase().replace(/\s+/g, '-'),
                    name: newRoom.name,
                    description: newRoom.description || '',
                    price: newRoom.price,
                    priceValue: newRoom.priceValue || 0,
                    maxGuests: newRoom.maxGuests || 2,
                    bedType: newRoom.bedType || 'King Bed',
                    size: newRoom.size || '',
                    amenities: newRoom.amenities || [],
                    images: newRoom.images || ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop'],
                    available: newRoom.available ?? true
                  }
                  
                  const updatedHotels = hotelsList.map(h => {
                    if (h.id === selectedHotel.id) {
                      return {
                        ...h,
                        rooms: [...h.rooms, room]
                      }
                    }
                    return h
                  })
                  
                  setHotelsList(updatedHotels)
                  setSelectedHotel(updatedHotels.find(h => h.id === selectedHotel.id) || null)
                  setNewRoom({
                    name: '',
                    description: '',
                    price: '',
                    priceValue: 0,
                    maxGuests: 2,
                    bedType: 'King Bed',
                    size: '',
                    amenities: [],
                    images: [],
                    available: true
                  })
                  setIsAddRoomDialogOpen(false)
                }
              }}
            >
              Add Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

