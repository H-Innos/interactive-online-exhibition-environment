import Image from 'next/image'

interface ExhibitionThumbnailProps {
  src: string
  alt: string
  size?: number
  onClick?: () => void
}

export default function ExhibitionThumbnail({ 
  src, 
  alt, 
  size = 200, 
  onClick 
}: ExhibitionThumbnailProps) {
  const sizeMapping = `h-[${size} w-[${size}]`
  return (
    <div 
     className={`relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-md bg-gray-200 ${sizeMapping}`}
      onClick={onClick}
    >
      <Image
        src={src}
        alt={alt}
        layout="fill"
        objectFit="cover"
      />
    </div>
  )
}