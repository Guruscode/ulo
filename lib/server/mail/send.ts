import { getMailTransporter } from '@/lib/server/mail/transporter'

type SendMailInput = {
  to: string | string[]
  subject: string
  html: string
  text: string
}

export async function sendMail(input: SendMailInput) {
  const mail = getMailTransporter()

  if (!mail) {
    console.warn('[mail] SMTP is not configured. Skipping email:', input.subject)
    return { skipped: true as const }
  }

  await mail.transporter.sendMail({
    from: `"${mail.from.name}" <${mail.from.address}>`,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  })

  return { skipped: false as const }
}

export async function sendMailSafely(input: SendMailInput) {
  try {
    await sendMail(input)
  } catch (error) {
    console.error('[mail] failed to send email', error)
  }
}
