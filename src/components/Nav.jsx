import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Nav() {
  const links = [
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/work' },
    { name: 'About', path: '/about' },
    { name: 'Connect', path: '/contact' }
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 select-none border-b border-neutral-200/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex justify-between items-center gap-3">
        {/* Brand Logo */}
        <Link
          to="/"
          className="text-[11px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase hover:text-accent transition-colors duration-300 shrink-0"
        >
          AK
          <span className="hidden sm:inline"> &mdash; PORTFOLIO</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-10">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `text-[10px] font-semibold tracking-widest uppercase transition-colors duration-300 relative py-1 ${
                  isActive
                    ? 'text-accent font-bold'
                    : 'text-neutral-400 hover:text-neutral-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Mobile Capsule Nav — all links fit inline, no hamburger/drawer required */}
        <div className="md:hidden flex items-center bg-neutral-100/80 rounded-full p-1 gap-0.5 border border-neutral-200/60">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `text-[9px] font-semibold tracking-wider uppercase px-2.5 py-1.5 rounded-full whitespace-nowrap transition-colors duration-300 ${
                  isActive
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
