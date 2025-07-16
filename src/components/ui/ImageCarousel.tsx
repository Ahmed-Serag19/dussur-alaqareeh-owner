import React, { useEffect, useRef, useState } from "react";

interface ImageCarouselProps {
  images: string[];
  altPrefix?: string;
  className?: string;
  autoAdvanceMs?: number;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  altPrefix = "Property image",
  className = "",
  autoAdvanceMs = 3000,
}) => {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (images.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, autoAdvanceMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [images.length, autoAdvanceMs]);

  const goTo = (idx: number) => {
    setCurrent(idx);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % images.length);
      }, autoAdvanceMs);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center aspect-video rounded-lg ${className}`}
      >
        <span className="text-gray-400">No image</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full aspect-video ${className}`}>
      <img
        src={images[current]}
        alt={`${altPrefix} ${current + 1}`}
        className="w-full h-full object-cover rounded-lg transition-all duration-500"
        loading="lazy"
      />
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 ">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`w-2.5 h-2.5 rounded-full border border-white focus:outline-none transition-colors duration-200 ${
                current === idx ? "bg-blue-600" : "bg-white/70"
              }`}
              aria-label={`Go to image ${idx + 1}`}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  );
};
