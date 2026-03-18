import type { AuthUser } from '@/lib/auth/types'
import type { HotelBookingRecord, HotelRecord } from '@/lib/hotels/types'
import type { PropertyRecord } from '@/lib/properties/types'
import { getServerEnv } from '@/lib/server/config/env'
import { sendMailSafely } from '@/lib/server/mail/send'

function wrapEmail(title: string, intro: string, body: string[]) {
  const htmlBody = body.map((item) => `<p style="margin:0 0 12px;color:#334155;line-height:1.6;">${item}</p>`).join('')
  const textBody = [intro, ...body].join('\n\n')

  return {
    html: `
      <div style="background:#f8fafc;padding:32px;font-family:Arial,sans-serif;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:18px;padding:32px;">
          <p style="margin:0 0 8px;color:#0f172a;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">ULO</p>
          <h1 style="margin:0 0 16px;color:#0f172a;font-size:28px;line-height:1.2;">${title}</h1>
          <p style="margin:0 0 16px;color:#334155;line-height:1.6;">${intro}</p>
          ${htmlBody}
        </div>
      </div>
    `,
    text: textBody,
  }
}

function getAdminNotificationEmail() {
  const env = getServerEnv()
  return env.notificationAdminEmail || env.adminEmail || null
}

export async function sendSignupOtpEmail(input: { email: string; name: string; otp: string }) {
  const content = wrapEmail(
    'Verify your ULO account',
    `Hello ${input.name}, use the code below to complete your account creation.`,
    [
      `Your one-time verification code is ${input.otp}.`,
      'This code expires in 10 minutes.',
      'If you did not request this code, you can ignore this email.',
    ]
  )

  await sendMailSafely({
    to: input.email,
    subject: 'Your ULO verification code',
    ...content,
  })
}

export async function sendWelcomeEmail(user: AuthUser) {
  const content = wrapEmail(
    'Your account is ready',
    `Welcome to ULO, ${user.name}.`,
    [
      'Your account has been verified successfully.',
      user.role === 'admin'
        ? 'You can now access the admin dashboard.'
        : 'You can now access your user dashboard and start creating listings.',
    ]
  )

  await sendMailSafely({
    to: user.email,
    subject: 'Welcome to ULO',
    ...content,
  })
}

export async function sendPropertyCreatedEmails(property: PropertyRecord) {
  const ownerEmail = property.createdByEmail || property.contactEmail
  await sendMailSafely({
    to: ownerEmail,
    subject: 'Your property listing was submitted',
    ...wrapEmail(
      'Property submitted',
      `Your property "${property.title}" has been submitted on ULO.`,
      [
        `Reference: ${property.referenceCode}`,
        property.approvalStatus === 'approved'
          ? 'It is already approved and visible on the platform.'
          : 'It is now pending admin review before it appears publicly.',
      ]
    ),
  })

  const adminEmail = getAdminNotificationEmail()
  if (adminEmail) {
    await sendMailSafely({
      to: adminEmail,
      subject: 'New property listing requires review',
      ...wrapEmail(
        'New property listing',
        'A new property listing was submitted on ULO.',
        [
          `Title: ${property.title}`,
          `Location: ${property.location}`,
          `Reference: ${property.referenceCode}`,
          `Submitted by: ${property.createdByName || property.contactName}`,
        ]
      ),
    })
  }
}

export async function sendPropertyApprovalEmail(property: PropertyRecord) {
  const ownerEmail = property.createdByEmail || property.contactEmail
  if (!ownerEmail) return

  const decision = property.approvalStatus === 'approved' ? 'approved' : 'rejected'
  await sendMailSafely({
    to: ownerEmail,
    subject: `Your property listing was ${decision}`,
    ...wrapEmail(
      `Property ${decision}`,
      `Your property "${property.title}" has been ${decision}.`,
      [
        `Reference: ${property.referenceCode}`,
        property.approvalStatus === 'approved'
          ? 'Your listing is now live on ULO.'
          : `Reason: ${property.rejectionReason || 'The admin team rejected this listing during review.'}`,
      ]
    ),
  })
}

export async function sendHotelCreatedEmails(hotel: HotelRecord) {
  const ownerEmail = hotel.createdByEmail || hotel.contactEmail
  await sendMailSafely({
    to: ownerEmail,
    subject: 'Your hotel listing was submitted',
    ...wrapEmail(
      'Hotel submitted',
      `Your hotel "${hotel.name}" has been submitted on ULO.`,
      [
        `${hotel.rooms.length} room listing(s) were included.`,
        hotel.approvalStatus === 'approved'
          ? 'It is already approved and visible on the platform.'
          : 'It is now pending admin review before it appears publicly.',
      ]
    ),
  })

  const adminEmail = getAdminNotificationEmail()
  if (adminEmail) {
    await sendMailSafely({
      to: adminEmail,
      subject: 'New hotel listing requires review',
      ...wrapEmail(
        'New hotel listing',
        'A new hotel listing was submitted on ULO.',
        [
          `Hotel: ${hotel.name}`,
          `Location: ${hotel.location}`,
          `Submitted by: ${hotel.createdByName || hotel.contactEmail}`,
        ]
      ),
    })
  }
}

export async function sendHotelApprovalEmail(hotel: HotelRecord) {
  const ownerEmail = hotel.createdByEmail || hotel.contactEmail
  if (!ownerEmail) return

  const decision = hotel.approvalStatus === 'approved' ? 'approved' : 'rejected'
  await sendMailSafely({
    to: ownerEmail,
    subject: `Your hotel listing was ${decision}`,
    ...wrapEmail(
      `Hotel ${decision}`,
      `Your hotel "${hotel.name}" has been ${decision}.`,
      [
        hotel.approvalStatus === 'approved'
          ? 'Your hotel is now live on ULO.'
          : `Reason: ${hotel.rejectionReason || 'The admin team rejected this listing during review.'}`,
      ]
    ),
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
    ...wrapEmail(
      'New booking request',
      `A guest submitted a booking request for ${hotel.name}.`,
      [
        `Guest: ${booking.guestName}`,
        `Email: ${booking.guestEmail}`,
        `Phone: ${booking.guestPhone}`,
        `Room: ${booking.roomName}`,
        `Stay: ${booking.checkInDate} to ${booking.checkOutDate}`,
      ]
    ),
  })

  await sendMailSafely({
    to: booking.guestEmail,
    subject: `Your booking request for ${hotel.name}`,
    ...wrapEmail(
      'Booking request received',
      `Your reservation request for ${hotel.name} has been received.`,
      [
        `Room: ${booking.roomName}`,
        `Stay: ${booking.checkInDate} to ${booking.checkOutDate}`,
        'The hotel team will contact you with confirmation and next steps.',
      ]
    ),
  })
}
