import React from 'react';
import { X } from 'lucide-react';

export default function EditModal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-neutral-900 border border-neutral-800 max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 relative">
        <div className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-3">
          <h3 className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-100 transition-colors"
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}