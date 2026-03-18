type RequiredServerEnv = {
  tursoDatabaseUrl: string
  tursoAuthToken: string
  sessionSecret: string
}

type OptionalServerEnv = {
  adminName?: string
  adminEmail?: string
  adminPassword?: string
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
  }

  return cachedEnv
}
