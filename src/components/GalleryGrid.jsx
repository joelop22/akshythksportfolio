import React from 'react';
import Masonry from 'react-masonry-css';
import GalleryItem from './GalleryItem';

const breakpointColumnsObj = {
  default: 4,
  1024: 3,
  640: 2
};

export default function GalleryGrid({ images, onImageClick }) {
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-20 border-t border-neutral-800">
        <p className="text-xs text-neutral-400 font-light tracking-widest uppercase">
          No works found in this gallery.
        </p>
      </div>
    );
  }

  const sortedImages = [...images].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="masonry-grid select-none"
      columnClassName="masonry-grid_column"
    >
      {sortedImages.map((image, index) => (
        <GalleryItem
          key={image.id || index}
          image={image}
          index={index}
          onClick={() => onImageClick && onImageClick(index)}
        />
      ))}
    </Masonry>
  );
}
