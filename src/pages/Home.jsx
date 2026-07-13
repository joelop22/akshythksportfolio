import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import SEO from '../components/SEO';
import CategoryTile from '../components/CategoryTile';
import LoadingSpinner from '../components/LoadingSpinner';
import ContactSection from '../components/ContactSection';
import { GALLERIES } from '../data/galleries';
import RevealOnScroll from '../components/RevealOnScroll';

export default function Home() {
  const [categories, setCategories] = useState(GALLERIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!db) {
        setCategories(GALLERIES);
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        const fetched = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() });
        });

        setCategories(fetched.length > 0 ? fetched : GALLERIES);
      } catch (error) {
        console.error('Error fetching categories, showing curated galleries:', error);
        setCategories(GALLERIES);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <SEO title="Home" description="Portfolio of photographer Akshyth ks — pre-wedding, portraits, street, and event photography." />

      <div className="flex flex-col flex-1 relative">
        {/* Hero Section */}
        <div className="py-10 sm:py-16 md:py-24 relative z-10 animate-fade-in max-w-3xl">
          <p className="text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] text-neutral-400 uppercase font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
            Photographer
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-8xl font-light tracking-tight text-neutral-900 leading-[1.05] font-sans mt-4 sm:mt-6">
            Akshyth ks
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-neutral-500 font-light leading-relaxed pt-4 sm:pt-6 max-w-xl">
            Photographer shooting on Fujifilm X-T5, from candid weddings and portraits to street life and classical dance.
          </p>
        </div>

        {/* All Galleries */}
        <div className="pt-10 sm:pt-16 border-t border-neutral-200/50 relative z-10">
          <div className="mb-8 sm:mb-12">
            <h2 className="text-[10px] font-bold tracking-[0.3em] text-neutral-400 uppercase">
              Galleries
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-10 md:gap-12">
            {categories.map((category, index) => (
              <RevealOnScroll key={category.id} index={index} className="relative group">
                <div className="hidden sm:block absolute top-0 left-0 -translate-y-6 text-[10px] font-medium tracking-widest text-neutral-300 font-mono">
                  0{index + 1} &mdash;
                </div>
                <CategoryTile category={category} />
              </RevealOnScroll>
            ))}
          </div>
        </div>

        <ContactSection />
      </div>
    </>
  );
}
