import React from 'react';
import ImageWrapper from './ImageWrapper';
import useInView from '../hooks/useInView';

const getAspectRatio = (size) => {
  if (!size) return '4 / 5';
  const [w, h] = size.split('x').map(Number);
  if (!w || !h) return '4 / 5';
  return `${w} / ${h}`;
};

export default function GalleryItem({ image, index, onClick }) {
  const [ref, isInView] = useInView();

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`group cursor-zoom-in block relative overflow-hidden bg-neutral-100 border border-neutral-100 transition-all duration-700 ease-out mb-3 sm:mb-6 break-inside-avoid w-full ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${(index % 4) * 100}ms` }}
    >
      <div className="overflow-hidden relative" style={{ aspectRatio: getAspectRatio(image.size) }}>
        <ImageWrapper
          src={image.imageUrl}
          alt={image.title || 'Creative Work'}
          className="w-full h-full"
          imgClassName="group-hover:scale-[1.03] transition-transform duration-700 ease-out"
        />
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
  );
}