import React from 'react';
import { FaInstagram, FaWhatsapp, FaBehance } from 'react-icons/fa';

export default function SocialIcons({ className = '' }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <a href="https://www.instagram.com/akshythks/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-neutral-400 hover:text-[#E1306C] hover:scale-110 transition-all duration-300">
        <FaInstagram size={20} />
      </a>
      <a href="https://wa.me/919946865923" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-neutral-400 hover:text-[#25D366] hover:scale-110 transition-all duration-300">
        <FaWhatsapp size={20} />
      </a>
      <a href="https://www.behance.net/akshythakshyth" target="_blank" rel="noopener noreferrer" aria-label="Behance" className="text-neutral-400 hover:text-[#1769FF] hover:scale-110 transition-all duration-300">
        <FaBehance size={20} />
      </a>
    </div>
  );
}