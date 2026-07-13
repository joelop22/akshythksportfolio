import React from 'react';
import { Link } from 'react-router-dom';

export default function ContactSection() {
  return (
    <div className="mt-20 sm:mt-28 pt-10 sm:pt-14 border-t border-neutral-200/50 select-none">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
        <div className="md:col-span-2 space-y-3">
          <h2 className="text-[10px] font-bold tracking-[0.3em] text-neutral-400 uppercase">
            Get In Touch
          </h2>
          <p className="text-xl sm:text-2xl font-light text-neutral-900 tracking-tight leading-snug">
            Have a shoot, collaboration, or project in mind?
          </p>
          <p className="text-sm text-neutral-500 font-light leading-relaxed max-w-md pt-1">
            Open for bookings, exhibitions, and creative collaborations.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end w-full">
          <Link
            to="/contact"
            className="w-full sm:w-auto text-center text-[10px] font-bold tracking-[0.2em] uppercase text-white bg-neutral-950 hover:bg-accent hover:border-accent transition-colors duration-300 px-8 py-4 border border-neutral-950"
          >
            Send a Message
          </Link>
          <div className="flex items-center gap-5 pt-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors duration-300 font-light"
            >
              Instagram
            </a>
            <a
              href="https://www.behance.net/akshythakshyth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors duration-300 font-light"
            >
              Behance
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
