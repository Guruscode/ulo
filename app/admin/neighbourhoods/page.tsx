'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Edit, MapPin, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import AdminLayout from '@/components/admin/admin-layout'
import { FileUpload } from '@/components/ui/file-upload'
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
import { Textarea } from '@/components/ui/textarea'
import { ApiClientError } from '@/lib/client/api-error'
import {
  createAdminNeighbourhoodRequest,
  deleteAdminNeighbourhoodRequest,
  listAdminNeighbourhoodsRequest,
  updateAdminNeighbourhoodRequest,
} from '@/lib/client/admin-neighbourhood-client'
import type { NeighbourhoodRecord } from '@/lib/server/neighbourhoods/types'

type FormState = {
  name: string
  description: string
  fullDescription: string
  image: string
  latitude: string
  longitude: string
  amenities: string
  highlights: string
  population: string
  avgIncome: string
  avgAge: string
}

const EMPTY_FORM: FormState = {
  name: '',
  description: '',
  fullDescription: '',
  image: '',
  latitude: '',
  longitude: '',
  amenities: '',
  highlights: '',
  population: '',
  avgIncome: '',
  avgAge: '',
}

export default function AdminNeighbourhoodsPage() {
  const [items, setItems] = useState<NeighbourhoodRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<NeighbourhoodRecord | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  const loadItems = async () => {
    setIsLoading(true)
    try {
      const response = await listAdminNeighbourhoodsRequest()
      setItems(response.neighbourhoods)
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : 'Unable to load neighbourhoods.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadItems()
  }, [])

  const openCreate = () => {
    setEditingItem(null)
    setForm(EMPTY_FORM)
    setIsOpen(true)
  }

  const openEdit = (item: NeighbourhoodRecord) => {
    setEditingItem(item)
    setForm({
      name: item.name,
      description: item.description,
      fullDescription: item.fullDescription,
      image: item.image,
      latitude: item.latitude,
      longitude: item.longitude,
      amenities: item.amenities.join('\n'),
      highlights: item.highlights.join('\n'),
      population: item.population,
      avgIncome: item.avgIncome,
      avgAge: item.avgAge,
    })
    setIsOpen(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const payload = {
        name: form.name,
        description: form.description,
        fullDescription: form.fullDescription,
        image: form.image,
        latitude: form.latitude,
        longitude: form.longitude,
        amenities: form.amenities.split('\n').map((item) => item.trim()).filter(Boolean),
        highlights: form.highlights.split('\n').map((item) => item.trim()).filter(Boolean),
        population: form.population,
        avgIncome: form.avgIncome,
        avgAge: form.avgAge,
        phases: editingItem?.phases || [],
      }

      if (editingItem) {
        const response = await updateAdminNeighbourhoodRequest(editingItem.id, payload)
        setItems((current) => current.map((item) => (item.id === editingItem.id ? response.neighbourhood : item)))
      } else {
        const response = await createAdminNeighbourhoodRequest(payload)
        setItems((current) => [response.neighbourhood, ...current])
      }

      setIsOpen(false)
      setEditingItem(null)
      setForm(EMPTY_FORM)
      toast.success(`Neighbourhood ${editingItem ? 'updated' : 'created'}.`)
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : 'Unable to save neighbourhood.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteAdminNeighbourhoodRequest(deleteId)
      setItems((current) => current.filter((item) => item.id !== deleteId))
      setDeleteId(null)
      toast.success('Neighbourhood deleted.')
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : 'Unable to delete neighbourhood.')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Neighbourhood Guide</h1>
            <p className="mt-1 text-sm text-slate-600">Admin controls the neighbourhood content shown on the homepage and detail pages.</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Neighbourhood
          </Button>
        </div>

        {isLoading ? <Card className="p-10 text-center">Loading neighbourhoods...</Card> : null}

        {!isLoading && items.length === 0 ? <Card className="p-10 text-center text-slate-600">No neighbourhoods found.</Card> : null}

        {!isLoading && items.length > 0 ? (
          <div className="grid gap-4">
            {items.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    <div className="relative h-24 w-32 overflow-hidden rounded-xl bg-slate-100">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="128px" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-lg font-semibold text-slate-900">{item.name}</h2>
                      <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{item.latitude}</span>
                        <span>{item.longitude}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => openEdit(item)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => setDeleteId(item.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : null}

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Neighbourhood' : 'Create Neighbourhood'}</DialogTitle>
              <DialogDescription>These entries power the homepage Neighbourhood Guide and each public detail page.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Short Description</Label>
                  <Input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Hero Image</Label>
                <FileUpload
                  id="neighbourhood-image"
                  accept="image/*"
                  label={form.image ? 'Change Neighbourhood Image' : 'Upload Neighbourhood Image'}
                  uploadingLabel="Uploading Image..."
                  onUpload={(url) => setForm((current) => ({ ...current, image: url }))}
                />
                {form.image ? (
                  <div className="relative h-48 w-full overflow-hidden rounded-xl bg-slate-100">
                    <Image src={form.image} alt="Neighbourhood preview" fill className="object-cover" sizes="100vw" />
                  </div>
                ) : null}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input value={form.latitude} onChange={(event) => setForm({ ...form, latitude: event.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input value={form.longitude} onChange={(event) => setForm({ ...form, longitude: event.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Full Description</Label>
                <Textarea value={form.fullDescription} onChange={(event) => setForm({ ...form, fullDescription: event.target.value })} rows={6} />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Population</Label>
                  <Input value={form.population} onChange={(event) => setForm({ ...form, population: event.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Average Income</Label>
                  <Input value={form.avgIncome} onChange={(event) => setForm({ ...form, avgIncome: event.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Average Age</Label>
                  <Input value={form.avgAge} onChange={(event) => setForm({ ...form, avgAge: event.target.value })} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Amenities</Label>
                  <Textarea value={form.amenities} onChange={(event) => setForm({ ...form, amenities: event.target.value })} rows={6} placeholder="One amenity per line" />
                </div>
                <div className="space-y-2">
                  <Label>Highlights</Label>
                  <Textarea value={form.highlights} onChange={(event) => setForm({ ...form, highlights: event.target.value })} rows={6} placeholder="One highlight per line" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : editingItem ? 'Save Changes' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={Boolean(deleteId)} onOpenChange={() => setDeleteId(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Neighbourhood</DialogTitle>
              <DialogDescription>This will remove the neighbourhood from the homepage and its public detail page.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
