import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] py-12">
      <div className="w-8 h-8 border-2 border-neutral-200 border-t-accent rounded-full animate-spin"></div>
      <p className="mt-4 text-xs tracking-widest text-neutral-400 uppercase font-light">Loading</p>
    </div>
  );
}
