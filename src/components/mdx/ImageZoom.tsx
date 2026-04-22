'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type ImageZoomProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

export default function ImageZoom({
  src,
  alt = '',
  title,
  width,
  height,
}: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!src) return null;

  const widthNum =
    typeof width === 'number' ? width : Number(width) || 1600;
  const heightNum =
    typeof height === 'number' ? height : Number(height) || 900;

  return (
    <figure className="my-8">
      <div
        className={cn(
          'relative overflow-hidden rounded-lg cursor-zoom-in transition-all duration-300',
          isZoomed && 'cursor-zoom-out'
        )}
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <Image
          src={src}
          alt={alt}
          width={widthNum}
          height={heightNum}
          sizes="(max-width: 768px) 100vw, 800px"
          className={cn(
            'w-full h-auto transition-all duration-300',
            isZoomed && 'scale-150'
          )}
        />
      </div>
      {title && (
        <figcaption className="text-sm text-center mt-2 text-foreground/70 italic">
          {title}
        </figcaption>
      )}
    </figure>
  );
}
