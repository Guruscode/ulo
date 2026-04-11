type RequiredServerEnv = {
  tursoDatabaseUrl: string
  tursoAuthToken: string
  sessionSecret: string
}

type OptionalServerEnv = {
  adminName?: string
  adminEmail?: string
  adminPassword?: string
  smtpHost?: string
  smtpPort?: number
  smtpSecure?: boolean
  smtpUser?: string
  smtpPass?: string
  smtpFromEmail?: string
  smtpFromName?: string
  notificationAdminEmail?: string
  appUrl?: string
  paystackSecretKey?: string
  paystackPublicKey?: string
  subscriptionBankName?: string
  subscriptionAccountName?: string
  subscriptionAccountNumber?: string
  subscriptionWhatsappNumber?: string
}

export type ServerEnv = RequiredServerEnv & OptionalServerEnv

let cachedEnv: ServerEnv | null = null

function getRequiredEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export function getServerEnv(): ServerEnv {
  if (cachedEnv) {
    return cachedEnv
  }

  cachedEnv = {
    tursoDatabaseUrl: getRequiredEnv('TURSO_DATABASE_URL'),
    tursoAuthToken: getRequiredEnv('TURSO_AUTH_TOKEN'),
    sessionSecret: getRequiredEnv('SESSION_SECRET'),
    adminName: process.env.ADMIN_NAME,
    adminEmail: process.env.ADMIN_EMAIL?.toLowerCase(),
    adminPassword: process.env.ADMIN_PASSWORD,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
    smtpSecure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : undefined,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    smtpFromEmail: process.env.SMTP_FROM_EMAIL,
    smtpFromName: process.env.SMTP_FROM_NAME,
    notificationAdminEmail: process.env.NOTIFICATION_ADMIN_EMAIL?.toLowerCase(),
    appUrl: process.env.APP_URL,
    paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,
    paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY,
    subscriptionBankName: process.env.SUBSCRIPTION_BANK_NAME,
    subscriptionAccountName: process.env.SUBSCRIPTION_ACCOUNT_NAME,
    subscriptionAccountNumber: process.env.SUBSCRIPTION_ACCOUNT_NUMBER,
    subscriptionWhatsappNumber: process.env.SUBSCRIPTION_WHATSAPP_NUMBER || '2349161921437',
  }

  return cachedEnv
}
