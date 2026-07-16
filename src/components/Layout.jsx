import React from 'react';
import Nav from './Nav';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-offwhite text-neutral-100">
      <Nav />
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-start">
        {children}
      </main>
      <Footer />
    </div>
  );
}
