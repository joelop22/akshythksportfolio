import React from 'react';

export default function Preloader({ isLoading }) {
  return (
    <div
      className={`fixed inset-0 z-[100] bg-offwhite flex items-center justify-center transition-opacity duration-700 ease-out ${
        isLoading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <span className="font-display text-2xl sm:text-3xl tracking-widest text-neutral-900">
        Akshyth ks
      </span>
    </div>
  );
}