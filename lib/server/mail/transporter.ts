import nodemailer from 'nodemailer'

import { getServerEnv } from '@/lib/server/config/env'

let cachedTransporter: nodemailer.Transporter | null = null

export function getMailConfig() {
  const env = getServerEnv()

  if (!env.smtpHost || !env.smtpPort || !env.smtpUser || !env.smtpPass) {
    return null
  }

  return {
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure ?? env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
    from: {
      address: env.smtpFromEmail || env.smtpUser,
      name: env.smtpFromName || 'ULO',
    },
  }
}

export function getMailTransporter() {
  const config = getMailConfig()
  if (!config) {
    return null
  }

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    })
  }

  return {
    transporter: cachedTransporter,
    from: config.from,
  }
}
