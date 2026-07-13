import React from 'react';

/**
 * ImageWrapper component enforces client-side image protection.
 * It deters casual saving through:
 * 1. Disabling context menu (onContextMenu preventDefault)
 * 2. Disabling drag-and-drop (draggable={false} and user-drag: none)
 * 3. Disabling selection (user-select: none)
 * 4. Transparent overlay: Blocks the browser from targeting the raw <img> tag directly,
 *    so dragging or saving targets the transparent overlay instead of the asset.
 * 
 * --- NOTE ON SECURITY LIMITATIONS ---
 * This implementation is a deterrent against casual right-click savers and is not
 * a cryptographically secure protection. A tech-savvy user can inspect the DOM via
 * Developer Tools to retrieve the raw URL, grab the asset from the Network tab, or take a screenshot.
 * 
 * --- RECOMMENDATIONS FOR MAXIMUM PROTECTION ---
 * If absolute asset safety is required in the future:
 * 1. Upload watermarked previews to Firebase Storage for public consumption.
 * 2. Upload original high-resolution assets to a private bucket path with Auth tokens.
 * 3. Render lower-resolution WebP images on the public galleries to minimize source quality.
 */
export default function ImageWrapper({ 
  src, 
  alt, 
  className = '', 
  imgClassName = '', 
  loading = 'lazy',
  ...props 
}) {
  const [failed, setFailed] = React.useState(false);
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  if (!src || failed) {
    return (
      <div className={`relative overflow-hidden select-none bg-neutral-100 flex items-center justify-center ${className}`}>
        <span className="text-[9px] tracking-[0.2em] uppercase text-neutral-300 font-semibold px-4 text-center">
          {alt || 'Image unavailable'}
        </span>
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden select-none ${className}`}
      onContextMenu={handleContextMenu}
    >
      <img
        src={src}
        alt={alt}
        loading={loading}
        draggable={false}
        onError={() => setFailed(true)}
        className={`image-protect w-full h-full object-cover ${imgClassName}`}
        {...props}
      />
      {/* 
        A transparent absolute cover that overlays the img. 
        Attempts to click, right-click, select, or drag-and-drop will interact with this empty box 
        rather than the image file underneath.
      */}
      <div 
        className="absolute inset-0 bg-transparent z-10 select-none cursor-zoom-in"
        onContextMenu={handleContextMenu}
        draggable={false}
      />
    </div>
  );
}
