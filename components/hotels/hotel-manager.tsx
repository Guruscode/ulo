'use client'

import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Eye, Loader2, Pencil, Trash2, XCircle } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { StackedCardListSkeleton } from '@/components/ui/page-skeletons'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ApiClientError } from '@/lib/client/api-error'
import {
  createHotelRequest,
  deleteHotelRequest,
  listHotelBookingsRequest,
  listHotelsRequest,
  updateHotelApprovalRequest,
  updateHotelBookingStatusRequest,
  updateHotelRequest,
} from '@/lib/client/hotels-client'
import { formatHotelPrice } from '@/lib/hotels/presentation'
import type { HotelBookingRecord, HotelRecord, HotelUpsertInput } from '@/lib/hotels/types'
import { FileUpload } from '@/components/ui/file-upload';
import { STATES, CITIES_BY_STATE, type State } from '@/lib/properties/nigeria-locations';

type HotelManagerMode = 'dashboard' | 'admin'

type RoomForm = {
  id?: string
  name: string
  description: string
  priceValue: string
  maxGuests: string
  bedType: string
  size: string
  amenities: string
  images: string[]
  available: boolean
}

type HotelForm = {
  name: string
  location: string
  state: string
  city: string
  description: string
  priceValue: string
  images: [string, string, string, string]
  amenities: string
  contactPhone: string
  contactEmail: string
  contactAddress: string
  bankName: string
  bankAccountName: string
  bankAccountNumber: string
  featured: boolean
  status: 'active' | 'inactive' | 'pending'
  rooms: RoomForm[]
}

const EMPTY_ROOM: RoomForm = {
  name: '',
  description: '',
  priceValue: '',
  maxGuests: '2',
  bedType: 'King Bed',
  size: '',
  amenities: '',
  images: [''],
  available: true,
}

const EMPTY_FORM: HotelForm = {
  name: '',
  location: '',
  state: '',
  city: '',
  description: '',
  priceValue: '',
  images: ['', '', '', ''],
  amenities: '',
  contactPhone: '',
  contactEmail: '',
  contactAddress: '',
  bankName: '',
  bankAccountName: '',
  bankAccountNumber: '',
  featured: false,
  status: 'active',
  rooms: [{ ...EMPTY_ROOM }],
}

function toFormState(hotel: HotelRecord): HotelForm {
  const parts = hotel.location.split(', ').reverse();
  const state = parts[0] || '';
  const city = parts.slice(1).reverse().join(', ') || '';

  return {
    name: hotel.name,
    location: hotel.location,
    state,
    city,
    description: hotel.description,
    priceValue: String(hotel.priceValue),
    images: [
      hotel.images[0] || '',
      hotel.images[1] || '',
      hotel.images[2] || '',
      hotel.images[3] || '',
    ],
    amenities: hotel.amenities.join(', '),
    contactPhone: hotel.contactPhone,
    contactEmail: hotel.contactEmail,
    contactAddress: hotel.contactAddress,
    bankName: hotel.bankName,
    bankAccountName: hotel.bankAccountName,
    bankAccountNumber: hotel.bankAccountNumber,
    featured: hotel.featured,
    status: hotel.status,
    rooms: hotel.rooms.map((room) => ({
      id: room.id,
      name: room.name,
      description: room.description,
      priceValue: String(room.priceValue),
      maxGuests: String(room.maxGuests),
      bedType: room.bedType,
      size: room.size,
      amenities: room.amenities.join(', '),
      images: room.images.length > 0 ? room.images : [''],
      available: room.available,
    })),
  }
}

function toPayload(form: HotelForm): HotelUpsertInput {
  return {
    name: form.name.trim(),
    location: (form.city ? `${form.city}, ${form.state}` : form.state || form.location).trim(),
    description: form.description.trim(),
    rating: 0,
    reviewCount: 0,
    priceValue: Number(form.priceValue),
    images: form.images.map((image) => image.trim()),
    amenities: form.amenities.split(',').map((amenity) => amenity.trim()).filter(Boolean),
    contactPhone: form.contactPhone.trim(),
    contactEmail: form.contactEmail.trim(),
    contactAddress: form.contactAddress.trim(),
    bankName: form.bankName.trim(),
    bankAccountName: form.bankAccountName.trim(),
    bankAccountNumber: form.bankAccountNumber.trim(),
    featured: form.featured,
    status: form.status,
    rooms: form.rooms.map((room) => ({
      id: room.id,
      name: room.name.trim(),
      description: room.description.trim(),
      priceValue: Number(room.priceValue),
      maxGuests: Number(room.maxGuests),
      bedType: room.bedType.trim(),
      size: room.size.trim(),
      amenities: room.amenities.split(',').map((amenity) => amenity.trim()).filter(Boolean),
      images: room.images.map((image) => image.trim()).filter(Boolean),
      available: room.available,
    })),
  }
}

function approvalClass(status: HotelRecord['approvalStatus']) {
  switch (status) {
    case 'approved':
      return 'bg-emerald-100 text-emerald-700'
    case 'rejected':
      return 'bg-red-100 text-red-700'
    case 'draft':
      return 'bg-slate-100 text-slate-700'
    default:
      return 'bg-amber-100 text-amber-700'
  }
}

export function HotelManager({ mode }: { mode: HotelManagerMode }) {
  const [hotels, setHotels] = useState<HotelRecord[]>([])
  const [bookings, setBookings] = useState<HotelBookingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [approvalFilter, setApprovalFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewHotel, setViewHotel] = useState<HotelRecord | null>(null)
  const [editingHotel, setEditingHotel] = useState<HotelRecord | null>(null)
  const [form, setForm] = useState<HotelForm>(EMPTY_FORM)
  const [openForm, setOpenForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [actingHotelId, setActingHotelId] = useState<string | null>(null)
  const [actingBookingId, setActingBookingId] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const [hotelResponse, bookingResponse] = await Promise.all([
        listHotelsRequest({
          scope: mode === 'admin' ? 'admin' : 'mine',
          search: search || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          approvalStatus: approvalFilter !== 'all' ? approvalFilter : undefined,
        }),
        listHotelBookingsRequest(mode === 'admin' ? 'admin' : 'mine'),
      ])
      setHotels(hotelResponse.hotels)
      setBookings(bookingResponse.bookings)
    } catch (error) {
      const message =
        error instanceof ApiClientError ? error.message : 'Unable to load hotels right now.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [mode, search, approvalFilter, statusFilter])

  const openCreate = () => {
    setEditingHotel(null)
    setForm(EMPTY_FORM)
    setOpenForm(true)
  }

  const openEdit = (hotel: HotelRecord) => {
    setEditingHotel(hotel)
    setForm(toFormState(hotel))
    setOpenForm(true)
  }

  const closeForm = () => {
    setEditingHotel(null)
    setForm(EMPTY_FORM)
    setOpenForm(false)
  }

  const pendingHotels = useMemo(
    () => hotels.filter((hotel) => hotel.approvalStatus === 'pending_review').length,
    [hotels]
  )

  const canSave =
    form.images.every(Boolean) &&
    Boolean(form.bankName && form.bankAccountName && form.bankAccountNumber) &&
    form.rooms.length > 0 &&
    form.rooms.every((room) => room.name && room.priceValue && room.images[0])

  const saveHotel = async () => {
    setSaving(true)
    try {
      const payload = toPayload(form)
      const sanitizedPayload =
        mode === 'admin'
          ? payload
          : {
              ...payload,
              status: 'active' as const,
              featured: false,
            }
      if (editingHotel) {
        await updateHotelRequest(editingHotel.id, sanitizedPayload)
        toast.success(mode === 'admin' ? 'Hotel updated.' : 'Hotel updated and sent for review.')
      } else {
        await createHotelRequest(sanitizedPayload)
        toast.success(mode === 'admin' ? 'Hotel created.' : 'Hotel created and awaiting approval.')
      }
      closeForm()
      await loadData()
    } catch (error) {
      if (error instanceof ApiClientError && error.code === 'SUBSCRIPTION_LIMIT_REACHED') {
        toast.error(error.message)
        return
      }
      const message =
        error instanceof ApiClientError ? error.message : 'Unable to save the hotel right now.'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  const deleteHotel = async (hotel: HotelRecord) => {
    if (actingHotelId) return
    setActingHotelId(hotel.id)
    try {
      await deleteHotelRequest(hotel.id)
      toast.success('Hotel deleted.')
      await loadData()
    } catch (error) {
      const message =
        error instanceof ApiClientError ? error.message : 'Unable to delete the hotel right now.'
      toast.error(message)
    } finally {
      setActingHotelId(null)
    }
  }

  const updateApproval = async (hotel: HotelRecord, approvalStatus: 'approved' | 'rejected') => {
    if (actingHotelId) return
    setActingHotelId(hotel.id)
    try {
      await updateHotelApprovalRequest(hotel.id, {
        approvalStatus,
        rejectionReason: approvalStatus === 'rejected' ? 'Rejected by admin review.' : null,
      })
      toast.success(approvalStatus === 'approved' ? 'Hotel approved.' : 'Hotel rejected.')
      await loadData()
    } catch (error) {
      const message =
        error instanceof ApiClientError ? error.message : 'Unable to update hotel approval.'
      toast.error(message)
    } finally {
      setActingHotelId(null)
    }
  }

  const updateBookingStatus = async (bookingId: string, status: HotelBookingRecord['status']) => {
    if (actingBookingId) return
    setActingBookingId(bookingId)
    try {
      await updateHotelBookingStatusRequest(bookingId, status)
      toast.success('Booking status updated.')
      await loadData()
    } catch (error) {
      const message =
        error instanceof ApiClientError ? error.message : 'Unable to update booking status.'
      toast.error(message)
    } finally {
      setActingBookingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{mode === 'admin' ? 'Hotels Management' : 'My Hotels'}</h1>
          <p className="mt-1 text-gray-600">
            {mode === 'admin'
              ? `Review, approve, and manage all hotel listings. ${pendingHotels} pending review.`
              : 'Create, edit, and manage your hotel listings and room inventory.'}
          </p>
        </div>
        <Button className="bg-secondary text-white hover:bg-secondary/90" onClick={openCreate}>Create Hotel</Button>
      </div>

      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Input placeholder="Search by name or location" value={search} onChange={(event) => setSearch(event.target.value)} />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue placeholder="Hotel status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Select value={approvalFilter} onValueChange={setApprovalFilter}>
            <SelectTrigger><SelectValue placeholder="Approval status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All approvals</SelectItem>
              <SelectItem value="pending_review">Pending review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-4">
          {loading ? (
            <ManagerListSkeleton />
          ) : hotels.length === 0 ? (
            <Card className="p-12 text-center">
              <h2 className="text-xl font-semibold text-gray-900">No hotels yet</h2>
              <p className="mt-2 text-gray-600">Create your first hotel listing to begin.</p>
            </Card>
          ) : (
            hotels.map((hotel) => (
              <Card key={hotel.id} className="p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="grid flex-1 gap-4 md:grid-cols-[220px_1fr]">
                    <img src={hotel.image} alt={hotel.name} className="h-44 w-full rounded-xl object-cover" />
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-semibold text-gray-900">{hotel.name}</h2>
                        <Badge className={approvalClass(hotel.approvalStatus)}>{hotel.approvalStatus.replace('_', ' ')}</Badge>
                        <Badge variant="outline">{hotel.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{hotel.location}</p>
                      <p className="text-lg font-semibold text-secondary">{formatHotelPrice(hotel.priceValue)} / night</p>
                      <div className="grid gap-2 text-sm text-gray-600 md:grid-cols-3">
                        <p>{hotel.rooms.length} rooms</p>
                        <p>{hotel.rating} rating</p>
                        <p>{hotel.reviewCount} reviews</p>
                        <p>Phone: {hotel.contactPhone}</p>
                        <p>Email: {hotel.contactEmail}</p>
                        <p>{hotel.featured ? 'Featured' : 'Standard'}</p>
                        <p>Bank: {hotel.bankName}</p>
                        <p>Acct Name: {hotel.bankAccountName}</p>
                        <p>Acct No: {hotel.bankAccountNumber}</p>
                      </div>
                      <p className="line-clamp-2 text-sm text-gray-600">{hotel.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 xl:w-52 xl:flex-col">
                    <Button variant="outline" onClick={() => setViewHotel(hotel)}><Eye className="mr-2 h-4 w-4" />View</Button>
                    <Button variant="outline" disabled={Boolean(actingHotelId)} onClick={() => openEdit(hotel)}><Pencil className="mr-2 h-4 w-4" />Edit</Button>
                    {mode === 'admin' && hotel.approvalStatus !== 'approved' ? (
                      <Button className="bg-emerald-600 text-white hover:bg-emerald-700" disabled={Boolean(actingHotelId)} onClick={() => void updateApproval(hotel, 'approved')}>
                        {actingHotelId === hotel.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}Approve
                      </Button>
                    ) : null}
                    {mode === 'admin' && hotel.approvalStatus !== 'rejected' ? (
                      <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" disabled={Boolean(actingHotelId)} onClick={() => void updateApproval(hotel, 'rejected')}>
                        {actingHotelId === hotel.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}Reject
                      </Button>
                    ) : null}
                    <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" disabled={Boolean(actingHotelId)} onClick={() => void deleteHotel(hotel)}>
                      {actingHotelId === hotel.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <Card className="p-5">
          <h2 className="text-lg font-semibold text-gray-900">Bookings</h2>
          <p className="mt-1 text-sm text-gray-500">Manage room reservations tied to your hotels.</p>
          <div className="mt-4 space-y-3">
            {bookings.length === 0 ? (
              <p className="text-sm text-gray-500">No bookings yet.</p>
            ) : (
              bookings.map((booking) => (
                <div key={booking.id} className="rounded-xl border p-4">
                  <p className="font-medium text-gray-900">{booking.guestName}</p>
                  <p className="text-sm text-gray-500">{booking.hotelName} · {booking.roomName}</p>
                  <p className="text-sm text-gray-500">{booking.guestEmail}</p>
                  <p className="mt-1 text-sm text-gray-500">{booking.checkInDate} to {booking.checkOutDate}</p>
                  <p className="mt-1 text-sm text-gray-500">Payment: {booking.paymentStatus.replace('_', ' ')}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{booking.status}</Badge>
                    {booking.paymentReceiptUrl ? (
                      <a
                        href={booking.paymentReceiptUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-secondary underline underline-offset-4"
                      >
                        View receipt
                      </a>
                    ) : null}
                    <Select value={booking.status} onValueChange={(value) => void updateBookingStatus(booking.id, value as HotelBookingRecord['status'])} disabled={actingBookingId === booking.id}>
                      <SelectTrigger className="h-8 w-[160px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="checked_in">Checked in</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Dialog open={openForm} onOpenChange={(open) => (!open ? closeForm() : setOpenForm(true))}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>{editingHotel ? 'Edit Hotel' : 'Create Hotel'}</DialogTitle>
            <DialogDescription>Complete hotel information, upload gallery images up to 4 MB each, and manage room inventory.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Hotel Name</Label><Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div>
            <div className="space-y-2"><Label>State</Label><Select value={form.state} onValueChange={(value) => setForm({ ...form, state: value, city: '' })}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select></div>
            <div className="space-y-2"><Label>City</Label><Select value={form.city} onValueChange={(value) => setForm({ ...form, city: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {(form.state ? CITIES_BY_STATE[form.state as State] || [] : []).map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            </div>
            <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></div>
            <div className="space-y-2"><Label>Price per Night</Label><Input type="number" value={form.priceValue} onChange={(event) => setForm({ ...form, priceValue: event.target.value })} /></div>
            {mode === 'admin' ? (
              <div className="space-y-2"><Label>Status</Label><Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value as HotelForm['status'] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem><SelectItem value="pending">Pending</SelectItem></SelectContent></Select></div>
            ) : null}
            <div className="space-y-2 md:col-span-2"><Label>Amenities</Label><Textarea rows={3} value={form.amenities} onChange={(event) => setForm({ ...form, amenities: event.target.value })} placeholder="Free WiFi, Restaurant, Pool" /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={form.contactPhone} onChange={(event) => setForm({ ...form, contactPhone: event.target.value })} /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.contactEmail} onChange={(event) => setForm({ ...form, contactEmail: event.target.value })} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Address</Label><Input value={form.contactAddress} onChange={(event) => setForm({ ...form, contactAddress: event.target.value })} /></div>
            <div className="space-y-2"><Label>Bank Name</Label><Input value={form.bankName} onChange={(event) => setForm({ ...form, bankName: event.target.value })} /></div>
            <div className="space-y-2"><Label>Account Name</Label><Input value={form.bankAccountName} onChange={(event) => setForm({ ...form, bankAccountName: event.target.value })} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Account Number</Label><Input value={form.bankAccountNumber} onChange={(event) => setForm({ ...form, bankAccountNumber: event.target.value })} /></div>
            {mode === 'admin' ? (
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900">Featured Hotel</p>
                    <p className="text-sm text-gray-500">Promote this listing on the public hotels page.</p>
                  </div>
                  <Switch checked={form.featured} onCheckedChange={(checked) => setForm({ ...form, featured: checked })} />
                </div>
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {form.images.map((image, index) => (
              <div key={index} className="space-y-2">
                <Label>Upload Image {index + 1}</Label>
                <div className="flex gap-2">
                  <FileUpload
                    id={`hotel-image-${index}`}
                    label={`Upload Image ${index + 1} (Max 4 MB)`}
                    uploadingLabel="Uploading image..."
                    accept="image/*"
                    maxSizeMb={4}
                    onUpload={(url) => {
                      const next = [...form.images] as HotelForm['images']
                      next[index] = url
                      setForm({ ...form, images: next })
                    }}
                  />
                  {image && <img src={image} alt="" className="h-20 w-20 rounded object-cover" />}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Rooms</h3>
              <Button
                variant="outline"
                onClick={() => setForm({ ...form, rooms: [...form.rooms, { ...EMPTY_ROOM }] })}
              >
                Add Room
              </Button>
            </div>
            <div className="space-y-4">
              {form.rooms.map((room, index) => (
                <Card key={`${room.id || 'new'}-${index}`} className="p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Room {index + 1}</h4>
                    {form.rooms.length > 1 ? (
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                        onClick={() =>
                          setForm({ ...form, rooms: form.rooms.filter((_, roomIndex) => roomIndex !== index) })
                        }
                      >
                        Remove
                      </Button>
                    ) : null}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2"><Label>Room Name</Label><Input value={room.name} onChange={(event) => { const next = [...form.rooms]; next[index] = { ...room, name: event.target.value }; setForm({ ...form, rooms: next }) }} /></div>
                    <div className="space-y-2"><Label>Room Price</Label><Input type="number" value={room.priceValue} onChange={(event) => { const next = [...form.rooms]; next[index] = { ...room, priceValue: event.target.value }; setForm({ ...form, rooms: next }) }} /></div>
                    <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea rows={3} value={room.description} onChange={(event) => { const next = [...form.rooms]; next[index] = { ...room, description: event.target.value }; setForm({ ...form, rooms: next }) }} /></div>
                    <div className="space-y-2"><Label>Max Guests</Label><Input type="number" value={room.maxGuests} onChange={(event) => { const next = [...form.rooms]; next[index] = { ...room, maxGuests: event.target.value }; setForm({ ...form, rooms: next }) }} /></div>
                    <div className="space-y-2"><Label>Bed Type</Label><Input value={room.bedType} onChange={(event) => { const next = [...form.rooms]; next[index] = { ...room, bedType: event.target.value }; setForm({ ...form, rooms: next }) }} /></div>
                    <div className="space-y-2"><Label>Room Size</Label><Input value={room.size} onChange={(event) => { const next = [...form.rooms]; next[index] = { ...room, size: event.target.value }; setForm({ ...form, rooms: next }) }} /></div>
                    <div className="space-y-2"><Label>Room Amenities</Label><Input value={room.amenities} onChange={(event) => { const next = [...form.rooms]; next[index] = { ...room, amenities: event.target.value }; setForm({ ...form, rooms: next }) }} /></div>
                    <div className="space-y-2">
                      <Label>Room Image</Label>
                      <div className="flex gap-2">
                        <FileUpload
                          id={`room-image-${index}`}
                          label="Upload Room Image (Max 4 MB)"
                          uploadingLabel="Uploading image..."
                          accept="image/*"
                          maxSizeMb={4}
                          onUpload={(url) => {
                            const next = [...form.rooms]
                            next[index] = { ...room, images: [url] }
                            setForm({ ...form, rooms: next })
                          }}
                        />
                        {room.images[0] ? (
                          <img src={room.images[0]} alt="" className="h-20 w-20 rounded object-cover" />
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border px-4 py-3 md:col-span-2">
                      <div>
                        <p className="font-medium text-gray-900">Room Available</p>
                        <p className="text-sm text-gray-500">Show the room as bookable on the public hotel page.</p>
                      </div>
                      <Switch checked={room.available} onCheckedChange={(checked) => { const next = [...form.rooms]; next[index] = { ...room, available: checked }; setForm({ ...form, rooms: next }) }} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeForm} disabled={saving}>Cancel</Button>
            <Button onClick={() => void saveHotel()} disabled={!canSave || saving}>
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : editingHotel ? 'Save Hotel' : 'Create Hotel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(viewHotel)} onOpenChange={(open) => (!open ? setViewHotel(null) : undefined)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          {viewHotel ? (
            <>
              <DialogHeader>
                <DialogTitle>{viewHotel.name}</DialogTitle>
                <DialogDescription>{viewHotel.location}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-3">
                  <img src={viewHotel.image} alt={viewHotel.name} className="h-72 w-full rounded-xl object-cover" />
                  <div className="grid grid-cols-2 gap-3">
                    {viewHotel.images.slice(1).map((image, index) => (
                      <img key={index} src={image} alt={`${viewHotel.name} ${index + 2}`} className="h-32 w-full rounded-xl object-cover" />
                    ))}
                  </div>
                </div>
                <div className="space-y-4 text-sm text-gray-600">
                  <p className="text-xl font-semibold text-secondary">{formatHotelPrice(viewHotel.priceValue)} / night</p>
                  <p>{viewHotel.description}</p>
                  <p><span className="font-medium text-gray-900">Approval:</span> {viewHotel.approvalStatus}</p>
                  <p><span className="font-medium text-gray-900">Status:</span> {viewHotel.status}</p>
                  <p><span className="font-medium text-gray-900">Amenities:</span> {viewHotel.amenities.join(', ')}</p>
                  <p><span className="font-medium text-gray-900">Contact:</span> {viewHotel.contactPhone} · {viewHotel.contactEmail}</p>
                  <p><span className="font-medium text-gray-900">Bank:</span> {viewHotel.bankName}</p>
                  <p><span className="font-medium text-gray-900">Account Name:</span> {viewHotel.bankAccountName}</p>
                  <p><span className="font-medium text-gray-900">Account Number:</span> {viewHotel.bankAccountNumber}</p>
                  <div>
                    <p className="font-medium text-gray-900">Rooms</p>
                    <div className="mt-2 space-y-2">
                      {viewHotel.rooms.map((room) => (
                        <div key={room.id} className="rounded-lg border p-3">
                          <p className="font-medium text-gray-900">{room.name}</p>
                          <p>{room.priceLabel} / night</p>
                          <p>{room.maxGuests} guests · {room.bedType}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ManagerListSkeleton() {
  return <StackedCardListSkeleton count={4} showImage />
}
