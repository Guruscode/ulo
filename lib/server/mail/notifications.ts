import type { AuthUser } from '@/lib/auth/types'
import type { HotelBookingRecord, HotelRecord } from '@/lib/hotels/types'
import type { PropertyVerificationRequestRecord } from '@/lib/property-verification/types'
import type { PropertyRecord } from '@/lib/properties/types'
import { getServerEnv } from '@/lib/server/config/env'
import { sendMailSafely } from '@/lib/server/mail/send'

type EmailSection = {
  label: string
  value: string
}

type EmailTemplateInput = {
  eyebrow: string
  title: string
  intro: string
  body: string[]
  sections?: EmailSection[]
  actionLabel?: string
  actionUrl?: string
  closing?: string
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function absoluteUrl(path: string) {
  const env = getServerEnv()
  const appUrl = env.appUrl?.replace(/\/$/, '')
  if (!appUrl) {
    return path
  }
  return `${appUrl}${path.startsWith('/') ? path : `/${path}`}`
}

function renderEmail(input: EmailTemplateInput) {
  const paragraphs = input.body
    .map((item) => `<p style="margin:0 0 14px;color:#475569;font-size:15px;line-height:1.75;">${escapeHtml(item)}</p>`)
    .join('')

  const detailRows = (input.sections || [])
    .map(
      (section) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;font-weight:600;width:160px;">
            ${escapeHtml(section.label)}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;">
            ${escapeHtml(section.value)}
          </td>
        </tr>
      `
    )
    .join('')

  const actionButton =
    input.actionLabel && input.actionUrl
      ? `
        <div style="margin:28px 0 12px;">
          <a
            href="${escapeHtml(input.actionUrl)}"
            style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:999px;font-size:14px;font-weight:700;"
          >
            ${escapeHtml(input.actionLabel)}
          </a>
        </div>
      `
      : ''

  const html = `
    <div style="margin:0;padding:32px 16px;background:#f8fafc;font-family:Arial,sans-serif;">
      <div style="max-width:680px;margin:0 auto;">
        <div style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);border-radius:28px 28px 0 0;padding:28px 32px;color:#ffffff;">
          <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#cbd5e1;">
            ${escapeHtml(input.eyebrow)}
          </p>
          <p style="margin:0;font-size:30px;font-weight:800;line-height:1.2;">${escapeHtml(input.title)}</p>
          <p style="margin:14px 0 0;color:#e2e8f0;font-size:15px;line-height:1.7;">
            ${escapeHtml(input.intro)}
          </p>
        </div>

        <div style="background:#ffffff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 28px 28px;padding:32px;">
          ${paragraphs}

          ${detailRows ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:18px 0 8px;border-collapse:collapse;">${detailRows}</table>` : ''}

          ${actionButton}

          <div style="margin-top:28px;padding:18px 20px;border-radius:18px;background:#f8fafc;border:1px solid #e2e8f0;">
            <p style="margin:0;color:#0f172a;font-size:14px;font-weight:700;">ULO Platform Notice</p>
            <p style="margin:8px 0 0;color:#64748b;font-size:13px;line-height:1.7;">
              ${escapeHtml(input.closing || 'If you did not expect this email, you can safely ignore it or contact support if something looks suspicious.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  `

  const text = [
    input.eyebrow.toUpperCase(),
    input.title,
    input.intro,
    '',
    ...input.body,
    '',
    ...(input.sections || []).map((section) => `${section.label}: ${section.value}`),
    input.actionLabel && input.actionUrl ? `${input.actionLabel}: ${input.actionUrl}` : '',
    '',
    input.closing || 'If you did not expect this email, you can safely ignore it.',
  ]
    .filter(Boolean)
    .join('\n')

  return { html, text }
}

function getAdminNotificationEmail() {
  const env = getServerEnv()
  return env.notificationAdminEmail || env.adminEmail || 'theuloreal@gmail.com'
}

export async function sendSignupOtpEmail(input: { email: string; name: string; otp: string }) {
  await sendMailSafely({
    to: input.email,
    subject: 'Your ULO verification code',
    ...renderEmail({
      eyebrow: 'Account Verification',
      title: 'Verify your ULO account',
      intro: `Hello ${input.name}, complete your signup with the one-time verification code below.`,
      body: [
        'Enter the code exactly as shown to continue creating your account.',
        'For security reasons, the code expires in 10 minutes and should not be shared with anyone.',
      ],
      sections: [
        { label: 'Verification Code', value: input.otp },
        { label: 'Valid For', value: '10 minutes' },
        { label: 'Email', value: input.email },
      ],
      actionLabel: 'Open ULO',
      actionUrl: absoluteUrl('/signup'),
      closing: 'If you did not request this verification code, you can ignore this email. No account will be created unless the code is used.',
    }),
  })
}

export async function sendWelcomeEmail(user: AuthUser) {
  await sendMailSafely({
    to: user.email,
    subject: 'Welcome to ULO',
    ...renderEmail({
      eyebrow: 'Welcome',
      title: 'Your account is ready',
      intro: `Welcome to ULO, ${user.name}. Your account has been verified successfully.`,
      body: [
        user.role === 'admin'
          ? 'You can now manage users, listings, hotels, neighbourhood guides, and blog content from the admin dashboard.'
          : 'You can now access your dashboard, update your profile, save listings, and start submitting properties or hotels based on your account type.',
        'We recommend reviewing your profile details first so your public-facing information stays accurate.',
      ],
      sections: [
        { label: 'Account Email', value: user.email },
        { label: 'Account Role', value: user.role === 'admin' ? 'Administrator' : user.accountType?.replace('_', ' ') || 'User' },
      ],
      actionLabel: user.role === 'admin' ? 'Open Admin Dashboard' : 'Open Dashboard',
      actionUrl: absoluteUrl(user.role === 'admin' ? '/admin' : '/dashboard'),
      closing: 'If you have any questions getting started, reply through the support channels on the platform and our team will help you.',
    }),
  })
}

export async function sendAdminRegistrationEmail(user: AuthUser) {
  const adminEmail = getAdminNotificationEmail()
  if (!adminEmail) return

  await sendMailSafely({
    to: adminEmail,
    subject: 'New user registration on ULO',
    ...renderEmail({
      eyebrow: 'Admin Alert',
      title: 'A new user completed registration',
      intro: 'A new account has just been created on ULO.',
      body: [
        'Review the account details below and approve the user if their account type requires admin approval.',
      ],
      sections: [
        { label: 'Name', value: user.name },
        { label: 'Email', value: user.email },
        { label: 'Account Type', value: user.accountType?.replace('_', ' ') || 'user' },
        { label: 'Approval Status', value: user.approvalStatus || 'approved' },
      ],
      actionLabel: 'Open Users',
      actionUrl: absoluteUrl('/admin/users'),
    }),
  })
}

export async function sendPropertyCreatedEmails(property: PropertyRecord) {
  const ownerEmail = property.createdByEmail || property.contactEmail

  await sendMailSafely({
    to: ownerEmail,
    subject: 'Your property listing was submitted',
    ...renderEmail({
      eyebrow: 'Property Submission',
      title: 'Property submitted successfully',
      intro: `Your property listing "${property.title}" has been received on ULO.`,
      body: [
        property.approvalStatus === 'approved'
          ? 'The listing is already approved and can be viewed on the platform.'
          : 'The listing is now pending admin review and will remain hidden publicly until the review is complete.',
        'You can keep monitoring the listing status from your dashboard.',
      ],
      sections: [
        { label: 'Reference', value: property.referenceCode },
        { label: 'Property Type', value: property.type },
        { label: 'Location', value: property.location },
        { label: 'Status', value: property.approvalStatus.replace('_', ' ') },
      ],
      actionLabel: 'View Dashboard',
      actionUrl: absoluteUrl('/dashboard/properties'),
    }),
  })

  const adminEmail = getAdminNotificationEmail()
  if (!adminEmail) return

  await sendMailSafely({
    to: adminEmail,
    subject: 'New property listing requires review',
    ...renderEmail({
      eyebrow: 'Admin Review',
      title: 'New property listing submitted',
      intro: 'A new property listing has been submitted and may require admin review.',
      body: [
        'Review the submission details, media, and contact information before making an approval decision.',
      ],
      sections: [
        { label: 'Title', value: property.title },
        { label: 'Reference', value: property.referenceCode },
        { label: 'Location', value: property.location },
        { label: 'Submitted By', value: property.createdByName || property.contactName },
      ],
      actionLabel: 'Review Properties',
      actionUrl: absoluteUrl('/admin/properties'),
    }),
  })
}

export async function sendPropertyApprovalEmail(property: PropertyRecord) {
  const ownerEmail = property.createdByEmail || property.contactEmail
  if (!ownerEmail) return

  const approved = property.approvalStatus === 'approved'
  await sendMailSafely({
    to: ownerEmail,
    subject: `Your property listing was ${approved ? 'approved' : 'rejected'}`,
    ...renderEmail({
      eyebrow: 'Property Review',
      title: approved ? 'Your property is now live' : 'Your property was not approved',
      intro: approved
        ? `Your property "${property.title}" has been approved and is now visible on ULO.`
        : `Your property "${property.title}" was reviewed but could not be approved at this time.`,
      body: approved
        ? ['Your listing is now available to platform visitors and leads can begin reaching out through your shared contact details.']
        : ['Please review the reason below, make the necessary corrections, and submit the listing again when ready.'],
      sections: approved
        ? [
            { label: 'Reference', value: property.referenceCode },
            { label: 'Location', value: property.location },
          ]
        : [
            { label: 'Reference', value: property.referenceCode },
            { label: 'Reason', value: property.rejectionReason || 'The admin team rejected this listing during review.' },
          ],
      actionLabel: approved ? 'View My Listings' : 'Update Listing',
      actionUrl: absoluteUrl('/dashboard/properties'),
    }),
  })
}

export async function sendPropertyVerificationTrackingEmail(request: PropertyVerificationRequestRecord) {
  await sendMailSafely({
    to: request.requesterEmail,
    subject: 'Your property verification request is confirmed',
    ...renderEmail({
      eyebrow: 'Property Verification',
      title: 'Tracking code issued',
      intro: `Your payment for ${request.packageName} has been confirmed and your verification request is now in review.`,
      body: [
        'Keep your tracking code safe. You can use it at any time to check the progress of your application.',
        'Our team will review your submitted documents and begin the verification process based on the selected package turnaround time.',
      ],
      sections: [
        { label: 'Tracking Code', value: request.trackingCode },
        { label: 'Package', value: request.packageName },
        { label: 'Property', value: request.propertyTitle || request.propertyAddress },
        { label: 'Amount Paid', value: `NGN ${request.amount.toLocaleString()}` },
      ],
      actionLabel: 'Track Verification',
      actionUrl: absoluteUrl(`/verify-property?tracking=${encodeURIComponent(request.trackingCode)}`),
      closing: 'If you did not authorize this verification request, contact support immediately and include the tracking code above.',
    }),
  })

  const adminEmail = getAdminNotificationEmail()
  if (!adminEmail) return

  await sendMailSafely({
    to: adminEmail,
    subject: 'New property verification request paid',
    ...renderEmail({
      eyebrow: 'Admin Alert',
      title: 'A verification request is ready for review',
      intro: 'A property verification request has been paid and should be reviewed by the operations team.',
      body: [
        'Use the tracking code and requester details below to begin document review and due diligence work.',
      ],
      sections: [
        { label: 'Tracking Code', value: request.trackingCode },
        { label: 'Requester', value: request.requesterName },
        { label: 'Email', value: request.requesterEmail },
        { label: 'Package', value: request.packageName },
      ],
      actionLabel: 'Open Support Page',
      actionUrl: absoluteUrl('/help'),
    }),
  })
}

export async function sendHotelCreatedEmails(hotel: HotelRecord) {
  const ownerEmail = hotel.createdByEmail || hotel.contactEmail

  await sendMailSafely({
    to: ownerEmail,
    subject: 'Your hotel listing was submitted',
    ...renderEmail({
      eyebrow: 'Hotel Submission',
      title: 'Hotel submitted successfully',
      intro: `Your hotel listing "${hotel.name}" has been received on ULO.`,
      body: [
        hotel.approvalStatus === 'approved'
          ? 'The hotel is already approved and visible on the platform.'
          : 'The hotel is pending admin review and will remain hidden publicly until approval is completed.',
        'Room information included in the submission is saved together with the hotel record.',
      ],
      sections: [
        { label: 'Hotel Name', value: hotel.name },
        { label: 'Location', value: hotel.location },
        { label: 'Rooms Submitted', value: String(hotel.rooms.length) },
        { label: 'Status', value: hotel.approvalStatus.replace('_', ' ') },
      ],
      actionLabel: 'Manage Hotels',
      actionUrl: absoluteUrl('/dashboard/hotels'),
    }),
  })

  const adminEmail = getAdminNotificationEmail()
  if (!adminEmail) return

  await sendMailSafely({
    to: adminEmail,
    subject: 'New hotel listing requires review',
    ...renderEmail({
      eyebrow: 'Admin Review',
      title: 'New hotel listing submitted',
      intro: 'A new hotel listing was submitted and is ready for review.',
      body: ['Check the hotel information, room inventory, contact details, and uploaded media before approving or rejecting the submission.'],
      sections: [
        { label: 'Hotel', value: hotel.name },
        { label: 'Location', value: hotel.location },
        { label: 'Submitted By', value: hotel.createdByName || hotel.contactEmail },
        { label: 'Rooms', value: String(hotel.rooms.length) },
      ],
      actionLabel: 'Review Hotels',
      actionUrl: absoluteUrl('/admin/hotels'),
    }),
  })
}

export async function sendHotelApprovalEmail(hotel: HotelRecord) {
  const ownerEmail = hotel.createdByEmail || hotel.contactEmail
  if (!ownerEmail) return

  const approved = hotel.approvalStatus === 'approved'
  await sendMailSafely({
    to: ownerEmail,
    subject: `Your hotel listing was ${approved ? 'approved' : 'rejected'}`,
    ...renderEmail({
      eyebrow: 'Hotel Review',
      title: approved ? 'Your hotel is now live' : 'Your hotel was not approved',
      intro: approved
        ? `Your hotel "${hotel.name}" has been approved and is now visible on ULO.`
        : `Your hotel "${hotel.name}" was reviewed but could not be approved at this time.`,
      body: approved
        ? ['Guests can now discover the hotel, browse rooms, and begin sending reservation requests through the platform.']
        : ['Please review the reason below, make corrections where needed, and submit the hotel again when ready.'],
      sections: approved
        ? [
            { label: 'Hotel', value: hotel.name },
            { label: 'Location', value: hotel.location },
          ]
        : [
            { label: 'Hotel', value: hotel.name },
            { label: 'Reason', value: hotel.rejectionReason || 'The admin team rejected this hotel during review.' },
          ],
      actionLabel: approved ? 'Manage Hotels' : 'Update Hotel',
      actionUrl: absoluteUrl('/dashboard/hotels'),
    }),
  })
}

export async function sendHotelBookingEmails(input: {
  hotel: HotelRecord
  booking: HotelBookingRecord & { guestEmail: string }
}) {
  const { hotel, booking } = input

  await sendMailSafely({
    to: hotel.contactEmail,
    subject: `New booking request for ${hotel.name}`,
    ...renderEmail({
      eyebrow: 'Booking Request',
      title: 'A guest submitted a new booking request',
      intro: `A reservation request has been submitted for ${hotel.name}.`,
      body: ['Review the guest details below and contact them to confirm availability, payment requirements, and next steps.'],
      sections: [
        { label: 'Guest', value: booking.guestName },
        { label: 'Email', value: booking.guestEmail },
        { label: 'Phone', value: booking.guestPhone },
        { label: 'Room', value: booking.roomName },
        { label: 'Stay Dates', value: `${booking.checkInDate} to ${booking.checkOutDate}` },
      ],
      actionLabel: 'Open Hotel Dashboard',
      actionUrl: absoluteUrl('/dashboard/hotels'),
    }),
  })

  await sendMailSafely({
    to: booking.guestEmail,
    subject: `Your booking request for ${hotel.name}`,
    ...renderEmail({
      eyebrow: 'Booking Received',
      title: 'Your booking request has been received',
      intro: `We have received your reservation request for ${hotel.name}.`,
      body: [
        'The hotel team will review the request and contact you using the details you provided.',
        'Keep an eye on your email and phone for the next update from the hotel.',
      ],
      sections: [
        { label: 'Hotel', value: hotel.name },
        { label: 'Room', value: booking.roomName },
        { label: 'Stay Dates', value: `${booking.checkInDate} to ${booking.checkOutDate}` },
      ],
      actionLabel: 'Browse More Hotels',
      actionUrl: absoluteUrl('/hotels'),
    }),
  })
}

export async function sendHotelBookingReceiptEmails(input: {
  hotel: HotelRecord
  booking: HotelBookingRecord
}) {
  const { hotel, booking } = input

  await sendMailSafely({
    to: hotel.contactEmail,
    subject: `Payment receipt submitted for ${hotel.name}`,
    ...renderEmail({
      eyebrow: 'Payment Receipt',
      title: 'A guest uploaded a payment receipt',
      intro: `${booking.guestName} has submitted a payment receipt for their booking at ${hotel.name}.`,
      body: [
        'Review the booking and receipt, then contact the guest to confirm the payment.',
      ],
      sections: [
        { label: 'Guest', value: booking.guestName },
        { label: 'Email', value: booking.guestEmail },
        { label: 'Phone', value: booking.guestPhone },
        { label: 'Room', value: booking.roomName },
        { label: 'Stay Dates', value: `${booking.checkInDate} to ${booking.checkOutDate}` },
        { label: 'Receipt URL', value: booking.paymentReceiptUrl || 'Not provided' },
      ],
      actionLabel: 'Open Hotel Dashboard',
      actionUrl: absoluteUrl('/dashboard/hotels'),
    }),
  })

  await sendMailSafely({
    to: booking.guestEmail,
    subject: `Receipt received for your ${hotel.name} booking`,
    ...renderEmail({
      eyebrow: 'Receipt Received',
      title: 'Your payment receipt has been shared',
      intro: `We have recorded your payment receipt for ${hotel.name}.`,
      body: [
        'The hotel team has been notified and will review the receipt you uploaded.',
        'Keep your phone and email available in case the hotel needs any clarification.',
      ],
      sections: [
        { label: 'Hotel', value: hotel.name },
        { label: 'Room', value: booking.roomName },
        { label: 'Receipt URL', value: booking.paymentReceiptUrl || 'Uploaded' },
      ],
      actionLabel: 'Browse More Hotels',
      actionUrl: absoluteUrl('/hotels'),
    }),
  })
}
