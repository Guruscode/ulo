'use client'

import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Loader2,
  Search,
  Upload,
} from 'lucide-react'
import { toast } from 'sonner'

import HomeFooter from '@/components/home/home-footer'
import HomeNav from '@/components/home/home-nav'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ApiClientError } from '@/lib/client/api-error'
import {
  initializePropertyVerificationCheckoutRequest,
  trackPropertyVerificationRequest,
} from '@/lib/client/property-verification-client'
import {
  propertyVerificationPackages,
  type PropertyVerificationPackageId,
  type PropertyVerificationRequestRecord,
} from '@/lib/property-verification/types'
import { uploadSignedFile } from '@/lib/upload'

type DocumentField = 'titleDocument' | 'surveyPlan' | 'additionalDocuments'

type UploadState = {
  titleDocument: boolean
  surveyPlan: boolean
  additionalDocuments: boolean
}

const NIGERIA_STATES = [
  'Lagos',
  'Abuja',
  'Ogun',
  'Oyo',
  'Rivers',
  'Delta',
  'Enugu',
  'Anambra',
]

const TITLE_DOCUMENT_TYPES = [
  'Certificate of Occupancy',
  'Deed of Assignment',
  'Governor Consent',
  'Registered Survey',
  'Gazette / Excision',
]

export default function VerifyPropertyPage() {
  const searchParams = useSearchParams()
  const [trackOpen, setTrackOpen] = useState(false)
  const [packagesOpen, setPackagesOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedPackageId, setSelectedPackageId] = useState<PropertyVerificationPackageId>('basic')
  const [submittingCheckout, setSubmittingCheckout] = useState(false)
  const [trackingId, setTrackingId] = useState(searchParams.get('tracking') || '')
  const [trackingEmail, setTrackingEmail] = useState('')
  const [trackingResults, setTrackingResults] = useState<PropertyVerificationRequestRecord[]>([])
  const [trackingLoading, setTrackingLoading] = useState(false)
  const [uploading, setUploading] = useState<UploadState>({
    titleDocument: false,
    surveyPlan: false,
    additionalDocuments: false,
  })
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneCode: '+234',
    phone: '',
    state: '',
    area: '',
    propertyAddress: '',
    goal: '',
    titleDocumentType: '',
    titleDocumentUrls: [] as string[],
    surveyPlanUrls: [] as string[],
    additionalDocumentUrls: [] as string[],
  })

  const titleDocumentInputRef = useRef<HTMLInputElement>(null)
  const surveyPlanInputRef = useRef<HTMLInputElement>(null)
  const additionalDocumentsInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setForm((current) => ({
      ...current,
      propertyAddress: searchParams.get('address') || current.propertyAddress,
      area: searchParams.get('location') || current.area,
    }))
  }, [searchParams])

  useEffect(() => {
    const queryTracking = searchParams.get('tracking')
    if (!queryTracking) return
    setTrackingId(queryTracking)
    setTrackOpen(true)
  }, [searchParams])

  const selectedPackage = useMemo(
    () => propertyVerificationPackages.find((item) => item.id === selectedPackageId) || propertyVerificationPackages[0],
    [selectedPackageId]
  )

  const propertyId = searchParams.get('propertyId')
  const propertyTitle = searchParams.get('title') || 'Property'
  const propertyLocation = searchParams.get('location') || 'Nigeria'

  const openFormForPackage = (packageId: PropertyVerificationPackageId) => {
    setSelectedPackageId(packageId)
    setPackagesOpen(false)
    setFormOpen(true)
  }

  const openFilePicker = (field: DocumentField) => {
    if (field === 'titleDocument') {
      titleDocumentInputRef.current?.click()
      return
    }
    if (field === 'surveyPlan') {
      surveyPlanInputRef.current?.click()
      return
    }
    additionalDocumentsInputRef.current?.click()
  }

  const handleFileSelection = async (field: DocumentField, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return

    setUploading((current) => ({ ...current, [field]: true }))

    try {
      const urls = await Promise.all(
        Array.from(fileList).map((file) =>
          uploadSignedFile({
            file,
            folder: 'property-verifications',
            resourceType: 'raw',
          })
        )
      )

      setForm((current) => ({
        ...current,
        titleDocumentUrls: field === 'titleDocument' ? urls : current.titleDocumentUrls,
        surveyPlanUrls: field === 'surveyPlan' ? urls : current.surveyPlanUrls,
        additionalDocumentUrls:
          field === 'additionalDocuments'
            ? [...current.additionalDocumentUrls, ...urls]
            : current.additionalDocumentUrls,
      }))

      toast.success(`${urls.length} file${urls.length === 1 ? '' : 's'} uploaded.`)
    } catch (error) {
      console.error(error)
      toast.error('Unable to upload documents right now.')
    } finally {
      setUploading((current) => ({ ...current, [field]: false }))
      if (titleDocumentInputRef.current) titleDocumentInputRef.current.value = ''
      if (surveyPlanInputRef.current) surveyPlanInputRef.current.value = ''
      if (additionalDocumentsInputRef.current) additionalDocumentsInputRef.current.value = ''
    }
  }

  const handleTrackApplication = async () => {
    setTrackingLoading(true)
    try {
      const response = await trackPropertyVerificationRequest({
        trackingCode: trackingId,
        email: trackingEmail,
      })
      setTrackingResults(response.requests)
      if (response.requests.length === 0) {
        toast.error('No verification request found.')
      }
    } catch (error) {
      const message = error instanceof ApiClientError ? error.message : 'Unable to track the application right now.'
      toast.error(message)
      setTrackingResults([])
    } finally {
      setTrackingLoading(false)
    }
  }

  const handleContinueToPayment = async () => {
    if (submittingCheckout) return

    setSubmittingCheckout(true)
    try {
      const response = await initializePropertyVerificationCheckoutRequest({
        propertyId,
        propertyTitle,
        propertyLocation,
        propertyAddress: form.propertyAddress,
        fullName: form.fullName,
        email: form.email,
        phone: `${form.phoneCode}${form.phone}`.replace(/\s+/g, ''),
        state: form.state,
        area: form.area,
        goal: form.goal || null,
        packageId: selectedPackage.id,
        titleDocumentType: form.titleDocumentType || null,
        titleDocumentUrls: form.titleDocumentUrls,
        surveyPlanUrls: form.surveyPlanUrls,
        additionalDocumentUrls: form.additionalDocumentUrls,
      })

      toast.success(`Redirecting to payment. Your tracking code is ${response.trackingCode}.`)
      window.location.href = response.authorizationUrl
    } catch (error) {
      const message = error instanceof ApiClientError ? error.message : 'Unable to start payment right now.'
      toast.error(message)
    } finally {
      setSubmittingCheckout(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfcfb] text-slate-950">
      <HomeNav />

      <main>
        <section className="px-4 pb-24 pt-24 sm:px-6 lg:px-8">
          <div className="mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center text-center">
            <p className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Property Verification
            </p>
            <h1 className="mt-8 max-w-5xl text-5xl font-semibold tracking-tight text-balance text-slate-950 md:text-7xl">
              Verify property documents with <span className="text-primary">speed</span>
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-slate-500">
              Confirm what exists on paper, in government records, and on ground before you transfer.
            </p>
            <p className="mt-4 text-sm text-slate-500">
              Preparing a request for <span className="font-semibold text-slate-700">{propertyTitle}</span> in {propertyLocation}.
            </p>

            <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="h-14 rounded-2xl px-10 text-base font-semibold"
                onClick={() => setPackagesOpen(true)}
              >
                Start verification <ArrowUpRight className="h-4 w-4" />
              </Button>
              <button
                onClick={() => setTrackOpen(true)}
                className="text-lg font-medium text-slate-900 transition hover:text-primary"
              >
                Track application
              </button>
            </div>
          </div>
        </section>
      </main>

      <HomeFooter />

      <Dialog open={trackOpen} onOpenChange={setTrackOpen}>
        <DialogContent className="max-w-2xl rounded-[28px] border border-slate-200 p-0 shadow-2xl">
          <div className="p-8">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="text-3xl font-semibold text-slate-950">Track Application</DialogTitle>
              <DialogDescription className="text-lg text-slate-500">
                Enter your tracking ID or email
              </DialogDescription>
            </DialogHeader>

            <div className="mt-8 space-y-6">
              <Field label="Tracking ID">
                <Input
                  value={trackingId}
                  onChange={(event) => setTrackingId(event.target.value)}
                  placeholder="VP-XXXXXX-XXXXXX"
                  className="h-14 rounded-2xl border-2 border-primary px-5 text-lg"
                />
              </Field>

              <div className="flex items-center gap-4 text-slate-400">
                <div className="h-px flex-1 bg-slate-200" />
                <span>or</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <Field label="Email">
                <Input
                  type="email"
                  value={trackingEmail}
                  onChange={(event) => setTrackingEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="h-14 rounded-2xl px-5 text-lg"
                />
              </Field>

              {trackingResults.length > 0 ? (
                <div className="space-y-3 rounded-3xl bg-slate-50 p-4">
                  {trackingResults.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Tracking Code</p>
                          <p className="mt-1 text-lg font-semibold text-slate-950">{item.trackingCode}</p>
                          <p className="mt-2 text-sm text-slate-600">{item.propertyTitle || item.propertyAddress}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</p>
                          <p className="mt-1 text-sm font-medium text-primary">{formatStatus(item.verificationStatus)}</p>
                          <p className="mt-1 text-xs text-slate-500">{formatStatus(item.paymentStatus)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={() => setTrackOpen(false)}
                  className="text-lg text-slate-500 transition hover:text-slate-900"
                >
                  Cancel
                </button>
                <Button
                  size="lg"
                  className="h-14 rounded-2xl bg-slate-950 px-8 text-base text-white hover:bg-slate-900"
                  onClick={() => void handleTrackApplication()}
                  disabled={trackingLoading}
                >
                  {trackingLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Track
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={packagesOpen} onOpenChange={setPackagesOpen}>
        <DialogContent className="max-h-[88vh] max-w-5xl overflow-y-auto rounded-[28px] border border-slate-200 p-0 shadow-2xl">
          <div className="p-8 md:p-10">
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-semibold tracking-tight text-slate-950">Choose a Package</h2>
              <p className="mt-2 text-base text-slate-500">Select the level of verification you need before continuing.</p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {propertyVerificationPackages.map((item) => (
                <div key={item.id} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                  {item.featured ? (
                    <span className="inline-flex rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                      Most Popular
                    </span>
                  ) : (
                    <span className="inline-block h-6" />
                  )}

                  <h3 className="mt-4 text-2xl font-semibold text-slate-950">{item.name}</h3>
                  <p className="mt-3 text-4xl font-semibold text-slate-950">{item.priceLabel}</p>
                  <p className="mt-1 text-lg text-slate-500">{item.turnaround}</p>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    <span className="font-semibold text-slate-900">Best for:</span> {item.bestFor}
                  </p>

                  <div className="mt-5 space-y-2">
                    {item.includes.slice(0, 4).map((entry) => (
                      <div key={entry} className="flex items-start gap-2 text-sm text-slate-600">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{entry}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    size="lg"
                    className="mt-6 h-12 w-full rounded-full"
                    onClick={() => openFormForPackage(item.id)}
                  >
                    Get Started <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[92vh] max-w-6xl overflow-y-auto rounded-[30px] border border-slate-200 p-0 shadow-2xl">
          <div className="p-6 md:p-8">
            <div className="mb-8 flex items-start gap-4">
              <button
                type="button"
                className="mt-1 rounded-full p-3 text-slate-900 transition hover:bg-slate-100"
                onClick={() => {
                  setFormOpen(false)
                  setPackagesOpen(true)
                }}
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h2 className="text-3xl font-semibold text-slate-950">{selectedPackage.name}</h2>
                <p className="mt-1 text-lg text-slate-500">
                  {selectedPackage.priceLabel} · {selectedPackage.turnaround}
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-2xl font-semibold text-slate-950">Your Information</h3>
                <div className="mt-5 grid gap-4 lg:grid-cols-3">
                  <Field label="Full Name *">
                    <Input
                      value={form.fullName}
                      onChange={(event) => setForm({ ...form, fullName: event.target.value })}
                      placeholder="Full name"
                      className="h-14 rounded-2xl px-5 text-lg"
                    />
                  </Field>
                  <Field label="Email *">
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(event) => setForm({ ...form, email: event.target.value })}
                      placeholder="Email"
                      className="h-14 rounded-2xl px-5 text-lg"
                    />
                  </Field>
                  <div className="grid gap-3 md:grid-cols-[140px_1fr]">
                    <Field label="Phone *">
                      <Select value={form.phoneCode} onValueChange={(value) => setForm({ ...form, phoneCode: value })}>
                        <SelectTrigger className="h-14 rounded-2xl px-4 text-lg">
                          <SelectValue placeholder="+234" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+234">+234</SelectItem>
                          <SelectItem value="+233">+233</SelectItem>
                          <SelectItem value="+44">+44</SelectItem>
                          <SelectItem value="+1">+1</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="&nbsp;">
                      <Input
                        value={form.phone}
                        onChange={(event) => setForm({ ...form, phone: event.target.value })}
                        placeholder="Phone number"
                        className="h-14 rounded-2xl px-5 text-lg"
                      />
                    </Field>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-slate-950">Property Location</h3>
                <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1fr_1.5fr]">
                  <Field label="State *">
                    <Select value={form.state} onValueChange={(value) => setForm({ ...form, state: value })}>
                      <SelectTrigger className="h-14 rounded-2xl px-5 text-lg">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        {NIGERIA_STATES.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Area / LGA">
                    <Input
                      value={form.area}
                      onChange={(event) => setForm({ ...form, area: event.target.value })}
                      placeholder="e.g., Lekki"
                      className="h-14 rounded-2xl px-5 text-lg"
                    />
                  </Field>
                  <Field label="Property Address *">
                    <Input
                      value={form.propertyAddress}
                      onChange={(event) => setForm({ ...form, propertyAddress: event.target.value })}
                      placeholder="Full address"
                      className="h-14 rounded-2xl px-5 text-lg"
                    />
                  </Field>
                </div>

                <div className="mt-4">
                  <Field label="What would you like to achieve with our search? (Optional)">
                    <Textarea
                      value={form.goal}
                      onChange={(event) => setForm({ ...form, goal: event.target.value })}
                      placeholder="e.g. I want to confirm the authenticity of the C of O before purchasing the property"
                      className="min-h-[140px] rounded-[24px] px-5 py-4 text-lg"
                    />
                  </Field>
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-semibold text-slate-950">Required Documents</h3>
                <div className="mt-5 space-y-5">
                  <DocumentDropzone
                    label="Title Document *"
                    typeValue={form.titleDocumentType}
                    onTypeChange={(value) => setForm({ ...form, titleDocumentType: value })}
                    files={form.titleDocumentUrls}
                    title="Upload title document"
                    helper="PDF, JPG, PNG (max 10MB)"
                    uploading={uploading.titleDocument}
                    onPick={() => openFilePicker('titleDocument')}
                  />
                  <DocumentDropzone
                    label="Survey Plan *"
                    files={form.surveyPlanUrls}
                    title="Upload survey plan"
                    helper="PDF, JPG, PNG (max 10MB)"
                    uploading={uploading.surveyPlan}
                    onPick={() => openFilePicker('surveyPlan')}
                  />
                  <DocumentDropzone
                    label="Additional Documents (Optional)"
                    files={form.additionalDocumentUrls}
                    title="Add more files"
                    helper="Upload any extra supporting documents."
                    uploading={uploading.additionalDocuments}
                    optional
                    onPick={() => openFilePicker('additionalDocuments')}
                  />
                </div>
              </section>

              <div className="flex justify-end pt-2">
                <Button
                  size="lg"
                  className="h-14 rounded-2xl px-8 text-base font-semibold"
                  onClick={() => void handleContinueToPayment()}
                  disabled={submittingCheckout}
                >
                  {submittingCheckout ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Continue to Payment
                </Button>
              </div>
            </div>
          </div>

          <input
            ref={titleDocumentInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="sr-only"
            onChange={(event) => void handleFileSelection('titleDocument', event.target.files)}
          />
          <input
            ref={surveyPlanInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="sr-only"
            onChange={(event) => void handleFileSelection('surveyPlan', event.target.files)}
          />
          <input
            ref={additionalDocumentsInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            className="sr-only"
            onChange={(event) => void handleFileSelection('additionalDocuments', event.target.files)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2.5">
      <Label className="text-base font-medium text-slate-900">{label}</Label>
      {children}
    </div>
  )
}

function DocumentDropzone({
  label,
  files,
  title,
  helper,
  onPick,
  uploading,
  optional = false,
  typeValue,
  onTypeChange,
}: {
  label: string
  files: string[]
  title: string
  helper: string
  onPick: () => void
  uploading: boolean
  optional?: boolean
  typeValue?: string
  onTypeChange?: (value: string) => void
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Label className="text-xl font-medium text-slate-950">{label}</Label>
        {onTypeChange ? (
          <Select value={typeValue} onValueChange={onTypeChange}>
            <SelectTrigger className="h-12 w-full rounded-2xl px-4 text-base md:w-[220px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {TITLE_DOCUMENT_TYPES.map((item) => (
                <SelectItem key={item} value={item}>{item}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onPick}
        className="flex w-full items-center gap-4 rounded-[22px] border-2 border-dashed border-primary/35 bg-[#fbf9ff] px-5 py-6 text-left transition hover:border-primary hover:bg-primary/5"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
        </div>
        <div className="min-w-0">
          <p className="text-xl font-medium text-slate-950">{uploading ? 'Uploading...' : title}</p>
          <p className="mt-1 text-sm text-slate-500">{helper}</p>
          {files.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {files.map((file) => (
                <span key={file} className="max-w-full truncate rounded-full bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
                  {extractFileName(file)}
                </span>
              ))}
            </div>
          ) : optional ? null : null}
        </div>
      </button>
    </div>
  )
}

function formatStatus(value: string) {
  return value.replace(/_/g, ' ')
}

function extractFileName(value: string) {
  const segments = value.split('/')
  return segments[segments.length - 1] || value
}
