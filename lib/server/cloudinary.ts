import { createHash } from 'crypto'

import { env } from '@/lib/server/env'

export function getCloudinaryUploadSignature(folder = 'uploads') {
  const timestamp = Math.floor(Date.now() / 1000)
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`
  const signature = createHash('sha1').update(paramsToSign).digest('hex')

  return {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    timestamp,
    folder,
    signature,
  }
}
