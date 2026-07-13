import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200/50 bg-white select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
        <p className="text-[9px] sm:text-[10px] tracking-widest uppercase text-neutral-400 font-light">
          <Link 
            to="/admin" 
            className="hover:text-accent transition-colors duration-300"
          >
            &copy;
          </Link>
          {' '}{currentYear} Akshythks ks. All rights reserved.
        </p>
        
        <div className="flex items-center space-x-5 sm:space-x-6">
          <a 
            href="https://www.instagram.com/akshythks/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[9px] sm:text-[10px] tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors duration-300 font-light"
          >
            Instagram
          </a>
          <a 
           href="https://wa.me/919946865923"
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[9px] sm:text-[10px] tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors duration-300 font-light"
          >
            Whatsapp
          </a>
          <a 
            href="https://www.behance.net/akshythakshyth" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[9px] sm:text-[10px] tracking-widest uppercase text-neutral-400 hover:text-neutral-900 font-semibold transition-colors duration-300"
          >
            Behance
          </a>
        </div>
      </div>
    </footer>
  );
}
