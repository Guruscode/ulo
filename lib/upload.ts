type CloudinaryUploadConfig = {
  cloudName: string
  apiKey: string
  timestamp: number
  folder: string
  signature: string
}

// Client-safe upload utils (no server secrets)
export async function getSignedUploadUrl(folder = 'uploads'): Promise<CloudinaryUploadConfig> {
  const res = await fetch('/api/upload/signed-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder }),
  })
  if (!res.ok) throw new Error('Failed to get upload signature')
  return res.json()
}

export async function uploadSignedFile(input: {
  file: File
  folder?: string
  resourceType?: 'image' | 'raw' | 'video' | 'auto'
}) {
  const config = await getSignedUploadUrl(input.folder || 'uploads')
  const formData = new FormData()
  formData.append('file', input.file)
  formData.append('api_key', config.apiKey)
  formData.append('timestamp', String(config.timestamp))
  formData.append('signature', config.signature)
  formData.append('folder', config.folder)

  const resourceType = input.resourceType || 'image'
  const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/${resourceType}/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Cloudinary upload failed')
  }

  const result = (await response.json()) as { secure_url?: string }
  if (!result.secure_url) {
    throw new Error('Upload URL missing')
  }

  return result.secure_url
}
