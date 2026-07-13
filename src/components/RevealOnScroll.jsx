import React from 'react';
import useInView from '../hooks/useInView';

export default function RevealOnScroll({ children, index = 0, className = '' }) {
  const [ref, isInView] = useInView();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${(index % 4) * 100}ms` }}
    >
      {children}
    </div>
  );
}