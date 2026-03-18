export const DEFAULT_PROPERTY_IMAGE =
  'https://images.pexels.com/photos/7415261/pexels-photo-7415261.jpeg'

export const DEFAULT_ESTATE_IMAGE = DEFAULT_PROPERTY_IMAGE

export function resolveImageUrl(value?: string | null, fallback = DEFAULT_PROPERTY_IMAGE) {
  const next = value?.trim()
  return next ? next : fallback
}
