import React from 'react';

export default function ApertureGraphic({ className = '' }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <circle cx="200" cy="200" r="140" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />

      {/* Aperture blades */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const x1 = 200 + 60 * Math.cos(angle);
        const y1 = 200 + 60 * Math.sin(angle);
        const x2 = 200 + 180 * Math.cos(angle);
        const y2 = 200 + 180 * Math.sin(angle);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.4"
          />
        );
      })}

      <circle cx="200" cy="200" r="60" stroke="currentColor" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}