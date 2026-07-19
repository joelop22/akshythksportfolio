import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import ImageWrapper from './ImageWrapper';

export default function Lightbox({ 
  images, 
  currentIndex, 
  onClose, 
  onPrev, 
  onNext 
}) {
  const activeImage = images[currentIndex];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!activeImage) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [activeImage, onClose, onPrev, onNext]);

  if (!activeImage) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between bg-neutral-50/98 backdrop-blur-md transition-opacity duration-300 ease-out ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      {/* Top Bar (Close and Navigation Counts) */}
      <div className="w-full flex justify-between items-center px-6 py-4 border-b border-neutral-800">
        <span className="text-xs tracking-widest text-neutral-400 uppercase font-light">
          {currentIndex + 1} &mdash; {images.length}
        </span>
        <button 
          onClick={onClose}
          className="text-neutral-400 hover:text-neutral-100 transition-colors p-2"
          aria-label="Close Lightbox"
        >
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* Main Image Container */}
      <div className="flex-1 relative flex items-center justify-between px-4 sm:px-12 md:px-24">
        {/* Prev Arrow */}
        <button 
          onClick={onPrev}
          disabled={images.length <= 1}
          className="text-neutral-400 hover:text-neutral-100 disabled:opacity-0 transition-colors p-3 absolute left-4 sm:left-8 z-20"
          aria-label="Previous Image"
        >
          <ChevronLeft size={32} strokeWidth={1.2} />
        </button>

        {/* Center Image Wrapper */}
        <div className="w-full h-full max-h-[70vh] flex items-center justify-center relative p-4">
         <ImageWrapper
            key={activeImage.imageUrl}
            src={activeImage.imageUrl}
            alt={activeImage.title}
            className="max-w-full max-h-full object-contain lightbox-image-enter"
            imgClassName="max-w-full max-h-[70vh] object-contain mx-auto"
          />
        </div>

        {/* Next Arrow */}
        <button 
          onClick={onNext}
          disabled={images.length <= 1}
          className="text-neutral-400 hover:text-neutral-100 disabled:opacity-0 transition-colors p-3 absolute right-4 sm:right-8 z-20"
          aria-label="Next Image"
        >
          <ChevronRight size={32} strokeWidth={1.2} />
        </button>
      </div>

      {/* Metadata Bottom Drawer */}
      <div className="w-full bg-neutral-900 border-t border-neutral-800 px-6 py-6 text-center select-none z-10">
        <div className="max-w-xl mx-auto space-y-1">
          <h2 className="text-sm font-medium tracking-wide uppercase text-neutral-200">
            {activeImage.title || 'Untitled'}
          </h2>
          {(activeImage.year || activeImage.note) && (
            <p className="text-xs text-neutral-400 font-light flex items-center justify-center gap-2">
              {activeImage.year && <span className="font-medium">{activeImage.year}</span>}
              {activeImage.year && activeImage.note && <span>&bull;</span>}
              {activeImage.note && <span>{activeImage.note}</span>}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
