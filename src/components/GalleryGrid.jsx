import React from 'react';
import ImageWrapper from './ImageWrapper';

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
        <div
          key={image.id || index}
          onClick={() => onImageClick && onImageClick(index)}
          className="group cursor-zoom-in block relative overflow-hidden bg-neutral-100 border border-neutral-100"
        >
          <div className="aspect-[4/5] sm:aspect-[3/4] overflow-hidden relative">
            <ImageWrapper
              src={image.imageUrl}
              alt={image.title || 'Creative Work'}
              className="w-full h-full"
              imgClassName="group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            />
            
            {/* 
              Hover Overlay for Metadata:
              Uses pointer-events-none to prevent interfering with ImageWrapper's transparent overlay blocker.
            */}
            <div className="absolute inset-0 bg-neutral-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex flex-col justify-end p-3 pointer-events-none">
              <div className="bg-white/95 backdrop-blur-sm p-3 border border-neutral-100 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <h4 className="text-[11px] font-medium text-neutral-800 tracking-wider uppercase truncate">
                  {image.title || 'Untitled'}
                </h4>
                {image.year && (
                  <p className="text-[9px] text-neutral-400 tracking-widest font-light mt-0.5">
                    {image.year}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
