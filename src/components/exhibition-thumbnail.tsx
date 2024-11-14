'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

interface ExhibitionThumbnailProps {
  src: string
  alt: string
  size?: number
  onClick?: () => void
  onDelete?: () => void
}

export default function ExhibitionThumbnail({ 
  src, 
  alt, 
  size = 200, 
  onClick,
  onDelete
}: ExhibitionThumbnailProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.()
  }

  return (
    <div 
      className={`relative flex-shrink-0 overflow-hidden rounded-md bg-gray-200 group`}
      style={{ width: size, height: size }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={src}
        alt={alt}
        layout="fill"
        objectFit="cover"
        className="transition-opacity duration-300 ease-in-out group-hover:opacity-75"
      />
      {isHovered && onDelete && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
          aria-label="Delete thumbnail"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}