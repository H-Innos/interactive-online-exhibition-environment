import Image from 'next/image'

interface ExhibitionThumbnailProps {
  src: string
}

export default function QuestionImage({ 
  src, 
}: ExhibitionThumbnailProps) {
  return (
    <div 
     className={`relative flex-shrink-0 overflow-hidden rounded-md bg-gray-200 h-60 w-60`} 
    >
      <Image
        src={src}
        alt={"Question Image"}
        layout="fill"
        objectFit="cover"
      />
    </div>
  )
}