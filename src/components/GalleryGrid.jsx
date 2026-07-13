import React from 'react';
import GalleryItem from './GalleryItem';

export default function GalleryGrid({ images, onImageClick }) {
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-20 border-t border-neutral-100">
        <p className="text-xs text-neutral-400 font-light tracking-widest uppercase">
          No works found in this gallery.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 select-none">
          {images.map((image, index) => (
        <GalleryItem
          key={image.id || index}
          image={image}
          index={index}
          onClick={() => onImageClick && onImageClick(index)}
        />
  ))}
    </div>
  );
}