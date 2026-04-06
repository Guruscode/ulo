'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Eye, Loader2, Pencil, ShieldCheck, Trash2, XCircle } from 'lucide-react'
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
import { FileUpload } from '@/components/ui/file-upload'
import { ApiClientError } from '@/lib/client/api-error'
import { DEFAULT_PROPERTY_IMAGE, resolveImageUrl } from '@/lib/media/defaults'
import {
  createPropertyRequest,
  deletePropertyRequest,
  listPropertiesRequest,
  updatePropertyApprovalRequest,
  updatePropertyRequest,
} from '@/lib/client/properties-client'
import type { PropertyRecord, PropertyUpsertInput } from '@/lib/properties/types'
import { formatPropertyPrice } from '@/lib/properties/presentation'
import { STATES, CITIES_BY_STATE, type State } from '@/lib/properties/nigeria-locations'

type PropertyManagerMode = 'dashboard' | 'admin'
type PropertyFieldKey = keyof PropertyFormState
type PropertyFieldErrors = Partial<Record<PropertyFieldKey, string[]>>

type PropertyFormState = {
  title: string
  state: string
  city: string
  fullAddress: string
  estate: string
  latitude: string
  longitude: string
  priceValue: string
  currency: 'USD' | 'NGN'
  pricingPeriod:
    | 'sale'
    | 'monthly'
    | '6-months'
    | 'annually'
    | '2-years'
    | '5-years'
    | 'per-day'
    | '3-days'
    | 'per-week'
    | 'per-month'
  type: 'For Sale' | 'For Rent' | 'Land' | 'Shortlet'
  listedBy: 'Agent' | 'Landlord' | 'Dealer' | 'Owner'
  bedrooms: string
  bathrooms: string
  features: string
  imageUrls: [string, string, string, string]
  videoUrl: string
  referenceCode: string
  documentInfo: string
  contactName: string
  contactPhone: string
  contactEmail: string
  verificationStatus: 'not_requested' | 'requested' | 'verified'
  status: 'active' | 'sold' | 'pending'
  description: string
  disclaimerAccepted: boolean
  featured: boolean
}

const PROPERTY_TYPES = ['For Sale', 'For Rent', 'Land', 'Shortlet'] as const

const PRICING_PERIOD_OPTIONS = {
  'For Sale': [{ value: 'sale', label: 'Sale Price' }],
  'For Rent': [
    { value: 'monthly', label: 'Monthly' },
    { value: '6-months', label: '6 Months' },
    { value: 'annually', label: 'Annually' },
    { value: '2-years', label: '2 Years' },
    { value: '5-years', label: '5 Years' },
  ],
  Land: [{ value: 'sale', label: 'Sale Price' }],
  Shortlet: [
    { value: 'per-day', label: 'Per Day' },
    { value: '3-days', label: '3 Days' },
    { value: 'per-week', label: 'Per Week' },
    { value: 'per-month', label: 'Per Month' },
  ],
} as const

function getDefaultPricingPeriod(type: PropertyFormState['type']): PropertyFormState['pricingPeriod'] {
  return PRICING_PERIOD_OPTIONS[type][0].value
}

function isLandType(type: PropertyFormState['type']) {
  return type === 'Land'
}

function buildLandTitle(state: string, city: string) {
  const place = [city, state].filter(Boolean).join(', ').trim()
  return place ? `Land in ${place}` : 'Land Listing'
}

const EMPTY_FORM: PropertyFormState = {
  title: '',
  state: '',
  city: '',
  fullAddress: '',
  estate: '',
  latitude: '',
  longitude: '',
  priceValue: '',
  currency: 'NGN',
  pricingPeriod: 'sale',
  type: 'For Sale',
  listedBy: 'Agent',
  bedrooms: '0',
  bathrooms: '0',
  features: '',
  imageUrls: ['', '', '', ''],
  videoUrl: '',
  referenceCode: '',
  documentInfo: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  verificationStatus: 'not_requested',
  status: 'active',
  description: '',
  disclaimerAccepted: false,
  featured: false,
}

function toFormState(property: PropertyRecord): PropertyFormState {
  const parts = property.location.split(', ').reverse();
  const state = parts[0] || '';
  const city = parts.slice(1).reverse().join(', ') || '';

  return {
    title: property.title,
    state,
    city,
    fullAddress: property.fullAddress,
    estate: property.estate || '',
    latitude: property.latitude === null ? '' : String(property.latitude),
    longitude: property.longitude === null ? '' : String(property.longitude),
    priceValue: String(property.priceValue),
    currency: property.currency,
    pricingPeriod: property.pricingPeriod,
    type: property.type,
    listedBy: property.listedBy,
    bedrooms: String(property.bedrooms),
    bathrooms: String(property.bathrooms),
    features: property.features.join(', '),
    imageUrls: [
      property.imageUrls[0] || '',
      property.imageUrls[1] || '',
      property.imageUrls[2] || '',
      property.imageUrls[3] || '',
    ],
    videoUrl: property.videoUrl || '',
    referenceCode: property.referenceCode,
    documentInfo: property.documentInfo || '',
    contactName: property.contactName,
    contactPhone: property.contactPhone,
    contactEmail: property.contactEmail,
    verificationStatus: property.verificationStatus,
    status: property.status,
    description: property.description,
    disclaimerAccepted: property.disclaimerAccepted,
    featured: property.featured,
  }
}

function toRequestPayload(form: PropertyFormState): PropertyUpsertInput {
  const location = (form.city ? `${form.city}, ${form.state}` : form.state).trim()
  const typeIsLand = isLandType(form.type)

  return {
    title: typeIsLand ? buildLandTitle(form.state, form.city) : form.title.trim(),
    location,
    fullAddress: form.fullAddress.trim(),
    estate: form.estate.trim() || null,
    latitude: form.latitude.trim() ? Number(form.latitude) : null,
    longitude: form.longitude.trim() ? Number(form.longitude) : null,
    priceValue: Number(form.priceValue),
    currency: form.currency,
    pricingPeriod: form.pricingPeriod,
    type: form.type,
    listedBy: form.listedBy,
    bedrooms: typeIsLand ? 0 : Number(form.bedrooms),
    bathrooms: typeIsLand ? 0 : Number(form.bathrooms),
    features: form.features
      .split(',')
      .map((feature) => feature.trim())
      .filter(Boolean),
    imageUrls: form.imageUrls.map((url) => url.trim()),
    videoUrl: form.videoUrl.trim() || null,
    referenceCode: form.referenceCode.trim() || null,
    documentInfo: form.documentInfo.trim() || null,
    contactName: form.contactName.trim(),
    contactPhone: form.contactPhone.trim(),
    contactEmail: form.contactEmail.trim(),
    verificationStatus: form.verificationStatus,
    disclaimerAccepted: form.disclaimerAccepted,
    description: form.description.trim(),
    status: form.status,
    featured: form.featured,
  }
}

function approvalBadgeClass(status: PropertyRecord['approvalStatus']) {
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

function getValidationErrors(error: ApiClientError) {
  const details = error.details as
    | {
        fieldErrors?: Record<string, string[] | undefined>
      }
    | undefined

  return {
    message: error.message,
    fieldErrors: (details?.fieldErrors ?? {}) as PropertyFieldErrors,
  }
}

export function PropertyManager({ mode }: { mode: PropertyManagerMode }) {
  const [properties, setProperties] = useState<PropertyRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [approvalFilter, setApprovalFilter] = useState('all')
  const [viewProperty, setViewProperty] = useState<PropertyRecord | null>(null)
  const [editingProperty, setEditingProperty] = useState<PropertyRecord | null>(null)
  const [openForm, setOpenForm] = useState(false)
  const [formStep, setFormStep] = useState(0)
  const [form, setForm] = useState<PropertyFormState>(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<PropertyFieldErrors>({})
  const [actingPropertyId, setActingPropertyId] = useState<string | null>(null)

  const steps =
    mode === 'dashboard'
      ? ['Property Type', 'Property Details', 'Media & Contact', 'Review', 'Subscription']
      : ['Property Type', 'Property Details', 'Media & Contact', 'Review']
  const canEditCoordinates = mode === 'admin' && Boolean(editingProperty)

  const loadProperties = async () => {
    setLoading(true)

    try {
      const response = await listPropertiesRequest({
        scope: mode === 'admin' ? 'admin' : 'mine',
        search: search || undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        approvalStatus: mode === 'admin' && approvalFilter !== 'all' ? approvalFilter : undefined,
      })
      setProperties(response.properties)
    } catch (error) {
      const message =
        error instanceof ApiClientError ? error.message : 'Unable to load properties right now.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProperties()
  }, [mode, search, typeFilter, approvalFilter])

  const pendingCount = useMemo(
    () => properties.filter((property) => property.approvalStatus === 'pending_review').length,
    [properties]
  )

  const updateImageUrlAtIndex = (index: number, value: string) => {
    const next = [...form.imageUrls] as PropertyFormState['imageUrls']
    next[index] = value
    setForm({ ...form, imageUrls: next })
  }

  const openCreateForm = () => {
    setEditingProperty(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setFieldErrors({})
    setFormStep(0)
    setOpenForm(true)
  }

  const openEditForm = (property: PropertyRecord) => {
    setEditingProperty(property)
    setForm(toFormState(property))
    setFormError('')
    setFieldErrors({})
    setFormStep(0)
    setOpenForm(true)
  }

  const handleCloseForm = () => {
    setOpenForm(false)
    setEditingProperty(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setFieldErrors({})
    setFormStep(0)
  }

  const handleSubmit = async () => {
    setSaving(true)
    setFormError('')
    setFieldErrors({})

    try {
      const payload = toRequestPayload(form)
      const sanitizedPayload =
        mode === 'admin'
          ? payload
          : {
              ...payload,
              status: 'active' as const,
              verificationStatus: 'not_requested' as const,
              disclaimerAccepted: true,
              referenceCode: null,
              featured: false,
            }

      if (editingProperty) {
        await updatePropertyRequest(editingProperty.id, sanitizedPayload)
        toast.success(mode === 'admin' ? 'Property updated.' : 'Property updated and sent for review.')
      } else {
        await createPropertyRequest(sanitizedPayload)
        toast.success(mode === 'admin' ? 'Property created.' : 'Property created and awaiting approval.')
      }

      handleCloseForm()
      await loadProperties()
    } catch (error) {
      if (error instanceof ApiClientError && error.code === 'VALIDATION_ERROR') {
        const validation = getValidationErrors(error)
        setFormError(validation.message)
        setFieldErrors(validation.fieldErrors)
      } else {
        const message =
          error instanceof ApiClientError ? error.message : 'Unable to save the property right now.'
        setFormError(message)
        toast.error(message)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (property: PropertyRecord) => {
    if (actingPropertyId) return
    setActingPropertyId(property.id)
    try {
      await deletePropertyRequest(property.id)
      toast.success('Property deleted.')
      await loadProperties()
    } catch (error) {
      const message =
        error instanceof ApiClientError ? error.message : 'Unable to delete the property right now.'
      toast.error(message)
    } finally {
      setActingPropertyId(null)
    }
  }

  const handleApproval = async (property: PropertyRecord, approvalStatus: 'approved' | 'rejected') => {
    if (actingPropertyId) return
    setActingPropertyId(property.id)
    try {
      await updatePropertyApprovalRequest(property.id, {
        approvalStatus,
        rejectionReason: approvalStatus === 'rejected' ? 'Rejected by admin review.' : null,
      })
      toast.success(approvalStatus === 'approved' ? 'Property approved.' : 'Property rejected.')
      await loadProperties()
    } catch (error) {
      const message =
        error instanceof ApiClientError ? error.message : 'Unable to update approval right now.'
      toast.error(message)
    } finally {
      setActingPropertyId(null)
    }
  }

  const canGoNext =
    formStep === 0
      ? Boolean(form.type)
      : formStep === 1
        ? Boolean(
            form.state &&
              form.city &&
              form.fullAddress &&
              form.priceValue &&
              form.description &&
              form.features.trim() &&
              (isLandType(form.type) || form.title.trim()) &&
              (isLandType(form.type) || form.bedrooms !== '') &&
              (isLandType(form.type) || form.bathrooms !== '')
          )
        : formStep === 2
          ? form.imageUrls.every(Boolean) &&
            Boolean(
              form.contactName &&
                form.contactPhone &&
                form.contactEmail &&
                (mode === 'admin' ? form.disclaimerAccepted : true)
            )
          : true

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'admin' ? 'Admin Properties' : 'My Properties'}
          </h1>
          <p className="mt-1 text-gray-600">
            {mode === 'admin'
              ? `Review, approve, and manage every property listing. ${pendingCount} pending review.`
              : 'Create listings, track approval, and manage your own property inventory.'}
          </p>
        </div>
        <Button className="bg-secondary text-white hover:bg-secondary/90" onClick={openCreateForm}>
          Create Property
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            placeholder="Search by title, location, estate, or code"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All property types</SelectItem>
              {PROPERTY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {mode === 'admin' ? (
            <Select value={approvalFilter} onValueChange={setApprovalFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Approval status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All approvals</SelectItem>
                <SelectItem value="pending_review">Pending review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="rounded-lg border bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Approved properties only appear on the public site after admin review.
            </div>
          )}
        </div>
      </Card>

      {loading ? (
        <ManagerListSkeleton />
      ) : properties.length === 0 ? (
        <Card className="p-12 text-center">
          <h2 className="text-xl font-semibold text-gray-900">No properties yet</h2>
          <p className="mt-2 text-gray-600">
            {mode === 'admin'
              ? 'No properties are available in the system yet.'
              : 'Create your first listing to start the approval flow.'}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {properties.map((property) => (
            <Card key={property.id} className="p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="grid flex-1 gap-4 md:grid-cols-[240px_1fr]">
                  <div className="overflow-hidden rounded-xl border bg-slate-50">
                    <img
                      src={property.imageUrls[0]}
                      alt={property.title}
                      className="h-44 w-full object-cover"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold text-gray-900">{property.title}</h2>
                      <Badge className={approvalBadgeClass(property.approvalStatus)}>
                        {property.approvalStatus.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">{property.type}</Badge>
                      <Badge variant="outline">{property.listedBy}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{property.location}</p>
                    <p className="text-lg font-semibold text-secondary">
                      {formatPropertyPrice(property)}
                    </p>
                    <div className="grid gap-2 text-sm text-gray-600 md:grid-cols-3">
                      {property.type !== 'Land' ? <p>{property.bedrooms} bed</p> : null}
                      {property.type !== 'Land' ? <p>{property.bathrooms} bath</p> : null}
                      <p>Status: {property.status}</p>
                      <p>Verification: {property.verificationStatus}</p>
                      <p>Code: {property.referenceCode}</p>
                    </div>
                    <p className="line-clamp-2 text-sm text-gray-600">{property.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 xl:w-56 xl:flex-col">
                  <Button variant="outline" onClick={() => setViewProperty(property)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button variant="outline" disabled={Boolean(actingPropertyId)} onClick={() => openEditForm(property)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  {mode === 'admin' && property.approvalStatus !== 'approved' ? (
                    <Button
                      className="bg-emerald-600 text-white hover:bg-emerald-700"
                      disabled={Boolean(actingPropertyId)}
                      onClick={() => void handleApproval(property, 'approved')}
                    >
                      {actingPropertyId === property.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                      Approve
                    </Button>
                  ) : null}
                  {mode === 'admin' && property.approvalStatus !== 'rejected' ? (
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      disabled={Boolean(actingPropertyId)}
                      onClick={() => void handleApproval(property, 'rejected')}
                    >
                      {actingPropertyId === property.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                      Reject
                    </Button>
                  ) : null}
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    disabled={Boolean(actingPropertyId)}
                    onClick={() => void handleDelete(property)}
                  >
                    {actingPropertyId === property.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={openForm} onOpenChange={(open) => (!open ? handleCloseForm() : setOpenForm(true))}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editingProperty ? 'Edit Property' : 'Create Property'}</DialogTitle>
            <DialogDescription>
              Complete the listing carefully. Upload exactly 4 images, each no larger than 4 MB.
            </DialogDescription>
          </DialogHeader>

          <div className="mb-4 flex flex-wrap gap-2">
            {steps.map((step, index) => (
              <Badge key={step} variant={index === formStep ? 'default' : 'outline'}>
                {index + 1}. {step}
              </Badge>
            ))}
          </div>

          {formError ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <p className="font-medium text-red-800">{formError}</p>
              {Object.entries(fieldErrors).length > 0 ? (
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {Object.entries(fieldErrors).flatMap(([field, messages]) =>
                    (messages ?? []).map((message, index) => (
                      <li key={`${field}-${index}`}>
                        <span className="font-medium">{field}</span>: {message}
                      </li>
                    ))
                  )}
                </ul>
              ) : null}
            </div>
          ) : null}

          {formStep === 0 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Property Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(value) =>
                    setForm({
                      ...form,
                      type: value as PropertyFormState['type'],
                      pricingPeriod: getDefaultPricingPeriod(value as PropertyFormState['type']),
                      title: value === 'Land' ? '' : form.title,
                      bedrooms: value === 'Land' ? '0' : form.bedrooms,
                      bathrooms: value === 'Land' ? '0' : form.bathrooms,
                    })
                  }
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-xl border bg-slate-50 p-4 text-sm text-slate-600">
                {form.type === 'Land'
                  ? 'Land listings skip title, bedrooms, bathrooms, and pricing duration. You will only fill the relevant land fields next.'
                  : `The next step will show only the fields required for ${form.type.toLowerCase()} listings.`}
              </div>
            </div>
          ) : null}

          {formStep === 1 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {!isLandType(form.type) ? (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
                  {fieldErrors.title?.[0] ? <p className="text-sm text-red-600">{fieldErrors.title[0]}</p> : null}
                </div>
              ) : null}
              <div className="space-y-2">
                <Label>State</Label>
                <Select value={form.state} onValueChange={(value) => setForm({ ...form, state: value, city: '' })}>
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
                </Select>
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Select value={form.city} onValueChange={(value) => setForm({ ...form, city: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {form.state ? CITIES_BY_STATE[form.state as State]?.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    )) : []}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="listedBy">Listed By</Label>
                <Select value={form.listedBy} onValueChange={(value) => setForm({ ...form, listedBy: value as PropertyFormState['listedBy'] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Agent">Agent</SelectItem>
                    <SelectItem value="Landlord">Landlord</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceValue">Price</Label>
                <Input id="priceValue" type="number" value={form.priceValue} onChange={(event) => setForm({ ...form, priceValue: event.target.value })} />
                {fieldErrors.priceValue?.[0] ? <p className="text-sm text-red-600">{fieldErrors.priceValue[0]}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={form.currency} onValueChange={(value) => setForm({ ...form, currency: value as PropertyFormState['currency'] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NGN">NGN</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricingPeriod">Pricing Period</Label>
                <Select value={form.pricingPeriod} onValueChange={(value) => setForm({ ...form, pricingPeriod: value as PropertyFormState['pricingPeriod'] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PRICING_PERIOD_OPTIONS[form.type].map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {mode === 'admin' ? (
                <div className="space-y-2">
                  <Label htmlFor="status">Listing Status</Label>
                  <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value as PropertyFormState['status'] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
              {!isLandType(form.type) ? (
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input id="bedrooms" type="number" value={form.bedrooms} onChange={(event) => setForm({ ...form, bedrooms: event.target.value })} />
                </div>
              ) : null}
              {!isLandType(form.type) ? (
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input id="bathrooms" type="number" step="0.5" value={form.bathrooms} onChange={(event) => setForm({ ...form, bathrooms: event.target.value })} />
                </div>
              ) : null}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fullAddress">Full Address</Label>
                <Input id="fullAddress" value={form.fullAddress} onChange={(event) => setForm({ ...form, fullAddress: event.target.value })} />
                {fieldErrors.fullAddress?.[0] ? <p className="text-sm text-red-600">{fieldErrors.fullAddress[0]}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="estate">Estate / Area (optional)</Label>
                <Input id="estate" value={form.estate} onChange={(event) => setForm({ ...form, estate: event.target.value })} placeholder="e.g., Victoria Garden City, Lekki Phase 1" />
              </div>
              {canEditCoordinates ? (
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude <span className="text-xs text-gray-500">(admin edit only)</span></Label>
                  <Input id="latitude" value={form.latitude} onChange={(event) => setForm({ ...form, latitude: event.target.value })} />
                </div>
              ) : null}
              {canEditCoordinates ? (
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude <span className="text-xs text-gray-500">(admin edit only)</span></Label>
                  <Input id="longitude" value={form.longitude} onChange={(event) => setForm({ ...form, longitude: event.target.value })} />
                </div>
              ) : null}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="features">Features</Label>
                <Textarea id="features" rows={4} value={form.features} onChange={(event) => setForm({ ...form, features: event.target.value })} placeholder="Pool, Gym, Security, Parking" />
                {fieldErrors.features?.[0] ? <p className="text-sm text-red-600">{fieldErrors.features[0]}</p> : null}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={5} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
                {fieldErrors.description?.[0] ? <p className="text-sm text-red-600">{fieldErrors.description[0]}</p> : null}
              </div>
              {mode === 'admin' ? (
                <div className="space-y-2">
                  <Label htmlFor="verificationStatus">Verification Status</Label>
                  <Select value={form.verificationStatus} onValueChange={(value) => setForm({ ...form, verificationStatus: value as PropertyFormState['verificationStatus'] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_requested">Not requested</SelectItem>
                      <SelectItem value="requested">Requested</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
              {mode === 'admin' ? (
                <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900">Featured Listing</p>
                    <p className="text-sm text-gray-500">Promote on the public site.</p>
                  </div>
                  <Switch checked={form.featured} onCheckedChange={(checked) => setForm({ ...form, featured: checked })} />
                </div>
              ) : null}
            </div>
          ) : null}

          {formStep === 2 ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {form.imageUrls.map((imageUrl, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`image-${index}`}>Image {index + 1}</Label>
                    <div className="space-y-2">
                      <FileUpload
                        id={`image-${index}`}
                        label={`Upload Image ${index + 1} (Max 4 MB)`}
                        uploadingLabel="Uploading image..."
                        accept="image/*"
                        maxSizeMb={4}
                        onUpload={(url) => updateImageUrlAtIndex(index, url)}
                      />
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={`Property upload ${index + 1}`}
                          className="h-28 w-full rounded-lg border object-cover"
                        />
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
              {fieldErrors.imageUrls?.[0] ? <p className="text-sm text-red-600">{fieldErrors.imageUrls[0]}</p> : null}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">Neighbourhood / Tour Video</Label>
                  <div className="space-y-2">
                    <FileUpload
                      id="videoUrl"
                      label="Upload Video (Max 4 MB)"
                      uploadingLabel="Uploading video..."
                      accept="video/*"
                      maxSizeMb={4}
                      onUpload={(url) => setForm({ ...form, videoUrl: url })}
                    />
                    {form.videoUrl ? (
                      <video
                        src={form.videoUrl}
                        controls
                        className="max-h-52 w-full rounded-lg border bg-black"
                      />
                    ) : null}
                  </div>
                  {fieldErrors.videoUrl?.[0] ? <p className="text-sm text-red-600">{fieldErrors.videoUrl[0]}</p> : null}
                </div>
                {mode === 'admin' ? (
                  <div className="space-y-2">
                    <Label htmlFor="referenceCode">Reference Code</Label>
                    <Input id="referenceCode" value={form.referenceCode} onChange={(event) => setForm({ ...form, referenceCode: event.target.value })} />
                  </div>
                ) : null}
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input id="contactName" value={form.contactName} onChange={(event) => setForm({ ...form, contactName: event.target.value })} />
                  {fieldErrors.contactName?.[0] ? <p className="text-sm text-red-600">{fieldErrors.contactName[0]}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input id="contactPhone" value={form.contactPhone} onChange={(event) => setForm({ ...form, contactPhone: event.target.value })} />
                  {fieldErrors.contactPhone?.[0] ? <p className="text-sm text-red-600">{fieldErrors.contactPhone[0]}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input id="contactEmail" type="email" value={form.contactEmail} onChange={(event) => setForm({ ...form, contactEmail: event.target.value })} />
                  {fieldErrors.contactEmail?.[0] ? <p className="text-sm text-red-600">{fieldErrors.contactEmail[0]}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documentInfo">Document Information</Label>
                  <Input id="documentInfo" value={form.documentInfo} onChange={(event) => setForm({ ...form, documentInfo: event.target.value })} />
                  {fieldErrors.documentInfo?.[0] ? <p className="text-sm text-red-600">{fieldErrors.documentInfo[0]}</p> : null}
                </div>
              </div>
              {mode === 'admin' ? (
                <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900">Disclaimer Accepted</p>
                    <p className="text-sm text-gray-500">Confirm the platform disclaimer before submission.</p>
                  </div>
                  <Switch checked={form.disclaimerAccepted} onCheckedChange={(checked) => setForm({ ...form, disclaimerAccepted: checked })} />
                </div>
              ) : (
                <div className="rounded-lg border bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  The platform disclaimer is applied automatically for dashboard listings.
                </div>
              )}
            </div>
          ) : null}

          {formStep === 3 ? (
            <div className="space-y-4 rounded-xl border bg-slate-50 p-5 text-sm text-slate-700">
              {!isLandType(form.type) ? <p><span className="font-medium text-slate-900">Title:</span> {form.title}</p> : null}
              <p><span className="font-medium text-slate-900">Location:</span> {[form.city, form.state].filter(Boolean).join(', ')}</p>
              <p><span className="font-medium text-slate-900">Price:</span> {form.priceValue} {form.currency}</p>
              <p><span className="font-medium text-slate-900">Pricing Model:</span> {PRICING_PERIOD_OPTIONS[form.type].find((option) => option.value === form.pricingPeriod)?.label}</p>
              <p><span className="font-medium text-slate-900">Type:</span> {form.type}</p>
              {!isLandType(form.type) ? <p><span className="font-medium text-slate-900">Bedrooms:</span> {form.bedrooms}</p> : null}
              {!isLandType(form.type) ? <p><span className="font-medium text-slate-900">Bathrooms:</span> {form.bathrooms}</p> : null}
              <p><span className="font-medium text-slate-900">Images:</span> {form.imageUrls.filter(Boolean).length} of 4 supplied</p>
              <p><span className="font-medium text-slate-900">Contact:</span> {form.contactName} ({form.contactEmail})</p>
              <p><span className="font-medium text-slate-900">Approval flow:</span> {mode === 'admin' ? 'Admin-created listings can be published immediately.' : 'This listing will stay hidden from the public site until admin approval.'}</p>
            </div>
          ) : null}

          {formStep === 4 ? (
            <div className="rounded-xl border bg-slate-50 p-5">
              <h3 className="text-lg font-semibold text-gray-900">Subscription Check</h3>
              <p className="mt-2 text-sm text-gray-600">
                Your active subscription is checked when you submit this listing. Free plans and paid plans have different property limits.
              </p>
              <div className="mt-4 rounded-xl border bg-white p-4 text-sm text-slate-600">
                <p>
                  If you have already reached your plan limit, submission will be blocked until you upgrade your subscription.
                </p>
                <div className="mt-4">
                  <Button asChild variant="outline">
                    <Link href="/dashboard/subscriptions">
                      Manage subscription
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
            <Button variant="outline" onClick={handleCloseForm} disabled={saving}>
              Cancel
            </Button>
            <div className="flex gap-2">
              {formStep > 0 ? (
                <Button variant="outline" onClick={() => setFormStep((step) => step - 1)} disabled={saving}>
                  Back
                </Button>
              ) : null}
              {formStep < steps.length - 1 ? (
                <Button onClick={() => setFormStep((step) => step + 1)} disabled={!canGoNext || saving}>
                  Next
                </Button>
              ) : (
                <Button onClick={() => void handleSubmit()} disabled={saving}>
                  {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : editingProperty ? 'Save Property' : 'Create Property'}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(viewProperty)} onOpenChange={(open) => (!open ? setViewProperty(null) : undefined)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          {viewProperty ? (
            <>
              <DialogHeader>
                <DialogTitle>{viewProperty.title}</DialogTitle>
                <DialogDescription>{viewProperty.location}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-3">
                  <img src={resolveImageUrl(viewProperty.imageUrls[0], DEFAULT_PROPERTY_IMAGE)} alt={viewProperty.title} className="h-72 w-full rounded-xl object-cover" />
                  <div className="grid grid-cols-2 gap-3">
                    {(viewProperty.imageUrls.length > 1 ? viewProperty.imageUrls.slice(1) : [DEFAULT_PROPERTY_IMAGE]).map((imageUrl, index) => (
                      <img key={index} src={resolveImageUrl(imageUrl, DEFAULT_PROPERTY_IMAGE)} alt={`${viewProperty.title} ${index + 2}`} className="h-32 w-full rounded-xl object-cover" />
                    ))}
                  </div>
                </div>
                <div className="space-y-4 text-sm text-gray-600">
                  <p className="text-xl font-semibold text-secondary">{formatPropertyPrice(viewProperty)}</p>
                  <p>{viewProperty.description}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <p><span className="font-medium text-gray-900">Reference:</span> {viewProperty.referenceCode}</p>
                    <p><span className="font-medium text-gray-900">Approval:</span> {viewProperty.approvalStatus}</p>
                    <p><span className="font-medium text-gray-900">Type:</span> {viewProperty.type}</p>
                    <p><span className="font-medium text-gray-900">Listed by:</span> {viewProperty.listedBy}</p>
                    {viewProperty.type !== 'Land' ? <p><span className="font-medium text-gray-900">Bedrooms:</span> {viewProperty.bedrooms}</p> : null}
                    {viewProperty.type !== 'Land' ? <p><span className="font-medium text-gray-900">Bathrooms:</span> {viewProperty.bathrooms}</p> : null}
                    <p><span className="font-medium text-gray-900">Verification:</span> {viewProperty.verificationStatus}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Full Address</p>
                    <p>{viewProperty.fullAddress}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Contact</p>
                    <p>{viewProperty.contactName}</p>
                    <p>{viewProperty.contactPhone}</p>
                    <p>{viewProperty.contactEmail}</p>
                  </div>
                  {viewProperty.videoUrl ? (
                    <a href={viewProperty.videoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-secondary underline">
                      Open neighbourhood video
                    </a>
                  ) : null}
                  {mode === 'admin' ? (
                    <div className="rounded-lg border bg-slate-50 p-4">
                      <p className="font-medium text-gray-900">Submitted By</p>
                      <p>{viewProperty.createdByName || 'System seed'}</p>
                      <p>{viewProperty.createdByEmail || 'Seeded property'}</p>
                    </div>
                  ) : null}
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
