import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import SEO from '../components/SEO';
import CategoryTile from '../components/CategoryTile';
import LoadingSpinner from '../components/LoadingSpinner';
import { GALLERIES } from '../data/galleries';

export default function Work() {
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
      <SEO title="Work" description="Index of work galleries: pre-wedding, portraits, street photography, events, dance, and automotive." />

      <div className="space-y-8 sm:space-y-12 animate-fade-in">
        <div className="border-b border-neutral-800 pb-5 sm:pb-6">
          <h1 className="text-2xl md:text-3xl font-light tracking-tight text-neutral-100 font-display">
            Galleries
          </h1>
          <p className="text-[10px] sm:text-xs text-neutral-400 mt-2 font-light tracking-widest uppercase">
            Selected Creative Works
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-8">
          {categories.map((category) => (
            <CategoryTile key={category.id} category={category} />
          ))}
        </div>
      </div>
    </>
  );
}
