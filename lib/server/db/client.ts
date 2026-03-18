import { createClient } from '@libsql/client'

import { getServerEnv } from '@/lib/server/config/env'

let client: ReturnType<typeof createClient> | null = null

export function getDbClient() {
  if (client) {
    return client
  }

  const env = getServerEnv()

  client = createClient({
    url: env.tursoDatabaseUrl,
    authToken: env.tursoAuthToken,
  })

  return client
}
