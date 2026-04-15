'use client'

import { useState } from 'react'
import { Grid2x2 } from 'lucide-react'

import { cn } from '@/lib/utils'

type FeaturedImageGalleryProps = {
  images: string[]
  title: string
  badgeLabel?: string
}

export function FeaturedImageGallery({ images, title, badgeLabel }: FeaturedImageGalleryProps) {
  const galleryImages = images.slice(0, 8)
  const [activeImage, setActiveImage] = useState(galleryImages[0] ?? '')

  if (galleryImages.length === 0) {
    return null
  }

  const activeIndex = galleryImages.indexOf(activeImage)
  const sideImages = galleryImages.filter((_, index) => index !== activeIndex)

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <button
        type="button"
        className="relative overflow-hidden rounded-[28px] bg-slate-100 lg:col-span-7"
        onClick={() => setActiveImage(activeImage)}
      >
        <img
          src={activeImage}
          alt={title}
          className="h-[320px] w-full object-cover transition-transform duration-500 hover:scale-[1.02] md:h-[460px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
        {badgeLabel ? (
          <div className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm">
            {badgeLabel}
          </div>
        ) : null}
      </button>

      <div className="grid grid-cols-2 gap-4 lg:col-span-5">
        {sideImages.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActiveImage(image)}
            className={cn(
              'group relative overflow-hidden rounded-[24px] bg-slate-100 text-left',
              sideImages.length === 1 ? 'col-span-2' : '',
              sideImages.length === 3 && index === 2 ? 'col-span-2' : '',
            )}
          >
            <img
              src={image}
              alt={`${title} view ${index + 2}`}
              className="h-[152px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] md:h-[220px]"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-full bg-white/92 px-4 py-2 text-sm font-medium text-slate-900 shadow-sm">
              <span>View photo</span>
              <Grid2x2 className="h-4 w-4" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
