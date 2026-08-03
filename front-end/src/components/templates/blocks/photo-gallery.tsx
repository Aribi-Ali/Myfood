'use client'
import { cn } from '@/lib/utils'

interface PhotoGalleryProps {
  images: { id: number; image: string | null; caption: string | null }[]
  className?: string
}

export function PhotoGallery({ images, className }: PhotoGalleryProps) {
  if (!images?.length) return null
  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 gap-2', className)}>
      {images.map((img) => (
        <div key={img.id} className="relative aspect-square overflow-hidden rounded-lg">
          {img.image ? (
            <img
              src={img.image}
              alt={img.caption || ''}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-black/10 flex items-center justify-center text-xs opacity-40">
              No image
            </div>
          )}
          {img.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              <span className="text-white text-xs">{img.caption}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
