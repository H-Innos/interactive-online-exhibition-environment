import React, { useState, useRef } from "react";
import { configurations } from "~/lib/constants/config";

interface CoverImageProps {
  thumbnailUrl?: string | null ;
  exhibitionCoverUrl?: string | null;
  initialPosition: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
}

const CoverImage: React.FC<CoverImageProps> = ({
  thumbnailUrl,
  exhibitionCoverUrl,
  initialPosition,
  onPositionChange,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const isDragging = useRef(false);

  function handleDragStart() {
    isDragging.current = true;
  }

  function handleDragEnd() {
    isDragging.current = false;
  }

  function handleDrag(e: React.MouseEvent) {
    if (isDragging.current) {
      const container = e.currentTarget.getBoundingClientRect();
      const newPosition = {
        x: Math.min(100, Math.max(0, ((e.clientX - container.left) / container.width) * 100)),
        y: Math.min(100, Math.max(0, ((e.clientY - container.top) / container.height) * 100)),
      };
      setPosition(newPosition);
      onPositionChange(newPosition);
    }
  }

  console.log("Cover Image URL:", thumbnailUrl);
  console.log("Thumbnail URL:", exhibitionCoverUrl);

  const backgroundImage =
  exhibitionCoverUrl && exhibitionCoverUrl.trim() !== ""
      ? exhibitionCoverUrl
      : thumbnailUrl && thumbnailUrl.trim() !== ""
      ? thumbnailUrl
      : configurations.DEFAULT_COVER_IMAGE_URL;

  console.log("Background Image URL:", backgroundImage);

  return (
    <div
      className="relative h-48 w-full sm:h-64 bg-cover bg-center mb-4"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: `${position.x}% ${position.y}%`,
      }}
      onMouseDown={handleDragStart}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      <div className="absolute inset-0 bg-black bg-opacity-25 cursor-move"></div>
    </div>
  );
};

export default CoverImage;