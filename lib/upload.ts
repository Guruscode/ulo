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
