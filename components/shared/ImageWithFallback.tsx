'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
}

/**
 * Image component with fallback for broken images
 */
export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc = '/placeholder.jpg',
  priority = false,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  const handleError = () => {
    if (!error) {
      setImgSrc(fallbackSrc);
      setError(true);
    }
  };

  if (error && imgSrc === fallbackSrc) {
    return (
      <div
        className={cn('flex items-center justify-center bg-muted', className)}
        style={{ width, height }}
      >
        <ImageOff className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      priority={priority}
    />
  );
}

