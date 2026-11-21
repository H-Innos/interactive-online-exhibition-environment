"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "~/lib/utils";

interface RemovableImagePorps {
  src: string;
  alt: string;
  onClick?: () => void;
  onDelete?: () => void;
  className?: string;
}

export default function RemovableImage({
  src,
  alt,
  onClick,
  onDelete,
  className,
}: RemovableImagePorps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <div
      className={cn(
        "group relative flex-shrink-0 overflow-hidden rounded-md bg-gray-200",
        { "cursor-pointer": onClick },
        className,
      )}
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
          className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
          aria-label="Delete thumbnail"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
