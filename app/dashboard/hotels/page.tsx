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
  Eye,
  BedDouble,
  List
} from 'lucide-react'
import { hotels, type Hotel, type Room } from '@/lib/hotels'
import DashboardLayout from '@/components/dashboard/dashboard-layout'

const amenityOptions = [
  'Free WiFi', 'Swimming Pool', 'Spa & Wellness', 'Fitness Center',
  'Restaurant & Bar', '24/7 Room Service', 'Concierge', 'Airport Shuttle',
  'Business Center', 'Parking', 'Rooftop Pool', 'Fine Dining Restaurant',
]

const bedTypeOptions = ['Single Bed', 'Double Bed', 'Queen Bed', 'King Bed', 'Twin Beds']

export default function DashboardHotelsPage() {
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
    name: '', description: '', price: '', priceValue: 0, maxGuests: 2, bedType: 'King Bed', size: '', amenities: [], images: [], available: true
  })
  
  const [newHotel, setNewHotel] = useState<Partial<Hotel>>({
    name: '', location: '', description: '', rating: 4.5, reviewCount: 0, price: '', image: '', images: [], amenities: [], contact: { phone: '', email: '', address: '' }, rooms: []
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
      setNewHotel({ name: '', location: '', description: '', rating: 4.5, reviewCount: 0, price: '', image: '', images: [], amenities: [], contact: { phone: '', email: '', address: '' }, rooms: [] })
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
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Manage Hotels</h2>
            <p className="text-gray-600 text-sm">Add, edit, and manage your hotel listings</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-secondary hover:bg-secondary/90 text-white w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Hotel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Hotel</DialogTitle>
                <DialogDescription>Fill in the details to add a new hotel to your listings.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Hotel Name *</Label>
                    <Input value={newHotel.name} onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })} placeholder="e.g., Grand Hotel Lagos" />
                  </div>
                  <div className="space-y-2">
                    <Label>Location *</Label>
                    <Input value={newHotel.location} onChange={(e) => setNewHotel({ ...newHotel, location: e.target.value })} placeholder="e.g., Victoria Island, Lagos" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <textarea value={newHotel.description} onChange={(e) => setNewHotel({ ...newHotel, description: e.target.value })} placeholder="Describe your hotel..." className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary min-h-[100px]" />
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
                    <Label>Review Count</Label>
                    <Input type="number" value={newHotel.reviewCount} onChange={(e) => setNewHotel({ ...newHotel, reviewCount: parseInt(e.target.value) })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Amenities</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {amenityOptions.map(amenity => (
                      <button key={amenity} type="button" onClick={() => toggleAmenity(amenity, true)} className={`text-xs px-3 py-2 rounded-lg border transition-all ${newHotel.amenities?.includes(amenity) ? 'bg-secondary/10 border-secondary text-secondary' : 'border-gray-200 text-gray-600 hover:border-secondary/50'}`}>
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
          <Input placeholder="Search hotels..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>

        {/* Hotels Table */}
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <Card className="bg-white min-w-[700px]">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs sm:text-sm font-semibold text-gray-900">Hotel</th>
                  <th className="text-left px-4 py-3 text-xs sm:text-sm font-semibold text-gray-900">Location</th>
                  <th className="text-left px-4 py-3 text-xs sm:text-sm font-semibold text-gray-900 hidden md:table-cell">Rating</th>
                  <th className="text-left px-4 py-3 text-xs sm:text-sm font-semibold text-gray-900">Price</th>
                  <th className="text-left px-4 py-3 text-xs sm:text-sm font-semibold text-gray-900 hidden sm:table-cell">Rooms</th>
                  <th className="text-right px-4 py-3 text-xs sm:text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredHotels.map((hotel) => (
                  <tr key={hotel.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url(${hotel.image})` }} />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{hotel.name}</p>
                          <p className="text-xs text-gray-500 line-clamp-1 hidden sm:block">{hotel.description.substring(0, 30)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-gray-600 text-sm"><MapPin className="w-3 h-3 flex-shrink-0" /><span className="truncate">{hotel.location}</span></div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-1 text-sm"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /><span className="font-medium">{hotel.rating}</span></div>
                    </td>
                    <td className="px-4 py-3"><span className="font-semibold text-secondary text-sm">{hotel.price}</span></td>
                    <td className="px-4 py-3 hidden sm:table-cell"><span className="text-gray-600 text-sm">{hotel.rooms.length}</span></td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem onClick={() => { setSelectedHotel(hotel); setIsViewDialogOpen(true) }}>
                            <Eye className="mr-2 h-4 w-4" />View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditHotel(hotel)}>
                            <Pencil className="mr-2 h-4 w-4" />Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedHotel(hotel); setIsRoomsDialogOpen(true) }}>
                            <List className="mr-2 h-4 w-4" />Rooms
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteHotel(hotel.id)} className="text-red-600 focus:text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* View Hotel Modal */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Hotel Details</DialogTitle>
            </DialogHeader>
            {selectedHotel && (
              <div className="space-y-6">
                <div className="w-full h-48 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${selectedHotel.image})` }} />
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{selectedHotel.name}</h3>
                    <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /><span className="font-medium text-sm">{selectedHotel.rating}</span></div>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 mb-4"><MapPin className="w-4 h-4" />{selectedHotel.location}</div>
                  <p className="text-2xl font-bold text-secondary mb-4">{selectedHotel.price} <span className="text-sm font-normal text-gray-500">/night</span></p>
                  <p className="text-gray-600 mb-4">{selectedHotel.description}</p>
                </div>
                {selectedHotel.amenities && selectedHotel.amenities.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedHotel.amenities.map((amenity, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">{amenity}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
              <Button className="bg-secondary hover:bg-secondary/90" onClick={() => { setIsViewDialogOpen(false); if (selectedHotel) handleEditHotel(selectedHotel) }}><Pencil className="w-4 h-4 mr-2" />Edit Hotel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Edit Hotel</DialogTitle><DialogDescription>Update the hotel details.</DialogDescription></DialogHeader>
            {editingHotel && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Hotel Name *</Label><Input value={editingHotel.name} onChange={(e) => setEditingHotel({ ...editingHotel, name: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Location *</Label><Input value={editingHotel.location} onChange={(e) => setEditingHotel({ ...editingHotel, location: e.target.value })} /></div>
                </div>
                <div className="space-y-2"><Label>Description</Label><textarea value={editingHotel.description} onChange={(e) => setEditingHotel({ ...editingHotel, description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary min-h-[100px]" /></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2"><Label>Price per night *</Label><Input value={editingHotel.price} onChange={(e) => setEditingHotel({ ...editingHotel, price: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Rating</Label><Input type="number" step="0.1" max="5" value={editingHotel.rating} onChange={(e) => setEditingHotel({ ...editingHotel, rating: parseFloat(e.target.value) })} /></div>
                  <div className="space-y-2"><Label>Review Count</Label><Input type="number" value={editingHotel.reviewCount} onChange={(e) => setEditingHotel({ ...editingHotel, reviewCount: parseInt(e.target.value) })} /></div>
                </div>
                <div className="space-y-2">
                  <Label>Amenities</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {amenityOptions.map(amenity => (
                      <button key={amenity} type="button" onClick={() => toggleAmenity(amenity, false)} className={`text-xs px-3 py-2 rounded-lg border transition-all ${editingHotel.amenities?.includes(amenity) ? 'bg-secondary/10 border-secondary text-secondary' : 'border-gray-200 text-gray-600 hover:border-secondary/50'}`}>
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button className="bg-secondary hover:bg-secondary/90" onClick={() => { if (editingHotel) { setHotelsList(hotelsList.map(h => h.id === editingHotel.id ? editingHotel : h)); setIsEditDialogOpen(false) } }}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Rooms Dialog */}
        <Dialog open={isRoomsDialogOpen} onOpenChange={setIsRoomsDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Rooms - {selectedHotel?.name}</DialogTitle><DialogDescription>View all rooms for this hotel</DialogDescription></DialogHeader>
            {selectedHotel && (
              <div className="space-y-4">
                {selectedHotel.rooms.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No rooms added yet.</div>
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
                        <span className={`px-2 py-1 text-xs rounded-full ${room.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{room.available ? 'Available' : 'Unavailable'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRoomsDialogOpen(false)}>Close</Button>
              <Button className="bg-secondary hover:bg-secondary/90" onClick={() => { setIsRoomsDialogOpen(false); setIsAddRoomDialogOpen(true) }}><Plus className="w-4 h-4 mr-2" />Add Room</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Room Dialog */}
        <Dialog open={isAddRoomDialogOpen} onOpenChange={setIsAddRoomDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Add New Room - {selectedHotel?.name}</DialogTitle><DialogDescription>Add a new room to this hotel.</DialogDescription></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Room Name *</Label><Input value={newRoom.name} onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })} placeholder="e.g., Deluxe Suite" /></div>
                <div className="space-y-2"><Label>Price per night *</Label><Input value={newRoom.price} onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value, priceValue: parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0 })} placeholder="₦85,000" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Max Guests</Label><Input type="number" value={newRoom.maxGuests} onChange={(e) => setNewRoom({ ...newRoom, maxGuests: parseInt(e.target.value) })} /></div>
                <div className="space-y-2"><Label>Bed Type</Label><select value={newRoom.bedType} onChange={(e) => setNewRoom({ ...newRoom, bedType: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg">{bedTypeOptions.map(bt => <option key={bt} value={bt}>{bt}</option>)}</select></div>
                <div className="space-y-2"><Label>Size</Label><Input value={newRoom.size} onChange={(e) => setNewRoom({ ...newRoom, size: e.target.value })} placeholder="e.g., 45 sqm" /></div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddRoomDialogOpen(false)}>Cancel</Button>
              <Button className="bg-secondary hover:bg-secondary/90" onClick={() => {
                if (selectedHotel && newRoom.name && newRoom.price) {
                  const room: Room = { id: newRoom.name.toLowerCase().replace(/\s+/g, '-'), name: newRoom.name, description: newRoom.description || '', price: newRoom.price, priceValue: newRoom.priceValue || 0, maxGuests: newRoom.maxGuests || 2, bedType: newRoom.bedType || 'King Bed', size: newRoom.size || '', amenities: [], images: newRoom.images || ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop'], available: newRoom.available ?? true }
                  const updatedHotels = hotelsList.map(h => h.id === selectedHotel.id ? { ...h, rooms: [...h.rooms, room] } : h)
                  setHotelsList(updatedHotels)
                  setSelectedHotel(updatedHotels.find(h => h.id === selectedHotel.id) || null)
                  setNewRoom({ name: '', description: '', price: '', priceValue: 0, maxGuests: 2, bedType: 'King Bed', size: '', amenities: [], images: [], available: true })
                  setIsAddRoomDialogOpen(false)
                }
              }}>Add Room</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

