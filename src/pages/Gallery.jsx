import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import SEO from '../components/SEO';
import GalleryGrid from '../components/GalleryGrid';
import Lightbox from '../components/Lightbox';
import LoadingSpinner from '../components/LoadingSpinner';
import { getGalleryBySlug } from '../data/galleries';

export default function Gallery() {
  const { slug } = useParams();
  const [categoryName, setCategoryName] = useState('');
  const [images, setImages] = useState([]);
  const [behanceUrl, setBehanceUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchGalleryData = async () => {
      setLoading(true);
      const curated = getGalleryBySlug(slug);

      if (!db) {
        applyCurated(curated);
        setLoading(false);
        return;
      }

      try {
        // 1. Fetch category metadata to get the proper name
        const catQuery = query(collection(db, 'categories'), where('slug', '==', slug));
        const catSnapshot = await getDocs(catQuery);
        let catTitle = '';
        catSnapshot.forEach((doc) => {
          catTitle = doc.data().name;
        });

        // 2. Fetch images in category
        const imgQuery = query(
          collection(db, 'images'),
          where('categorySlug', '==', slug),
          orderBy('order', 'asc')
        );
        const imgSnapshot = await getDocs(imgQuery);
        const fetchedImages = [];
        imgSnapshot.forEach((doc) => {
          fetchedImages.push({ id: doc.id, ...doc.data() });
        });

        if (fetchedImages.length > 0) {
          setImages(fetchedImages);
          setCategoryName(catTitle || formatSlug(slug));
          setBehanceUrl(curated?.behanceUrl || '');
          setDescription(curated?.description || '');
        } else {
          applyCurated(curated);
        }
      } catch (error) {
        console.error('Error fetching gallery images, showing curated gallery:', error);
        applyCurated(curated);
      } finally {
        setLoading(false);
      }
    };

    const applyCurated = (curated) => {
      if (curated) {
        setCategoryName(curated.name);
        setBehanceUrl(curated.behanceUrl);
        setDescription(curated.description);
        setImages(
          curated.coverImageUrl
            ? [{ id: curated.id, imageUrl: curated.coverImageUrl, title: curated.name, note: 'From Behance' }]
            : []
        );
      } else {
        setCategoryName(formatSlug(slug));
        setImages([]);
      }
    };

    const formatSlug = (s) =>
      s.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    fetchGalleryData();
  }, [slug]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const handlePrev = () => {
    setLightboxIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setLightboxIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <>
      <SEO title={categoryName} description={description || `Gallery viewing for the project: ${categoryName}`} />

      <div className="space-y-8 sm:space-y-10 animate-fade-in">
        {/* Navigation Breadcrumb & Header */}
        <div className="border-b border-neutral-200 pb-5 sm:pb-6 select-none">
          <div className="text-[9px] sm:text-[10px] tracking-widest text-neutral-400 uppercase font-semibold flex items-center gap-2">
            <Link to="/work" className="hover:text-neutral-900 transition-colors">Work</Link>
            <span>/</span>
            <span className="text-neutral-500 font-normal">{categoryName}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-light tracking-tight text-neutral-900 pt-2 font-display">
            {categoryName}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed mt-2 max-w-xl">
              {description}
            </p>
          )}
        </div>

        {/* Gallery Grid */}
        <GalleryGrid
          images={images}
          onImageClick={(index) => setLightboxIndex(index)}
        />

    

        {/* Lightbox Modal */}
        {lightboxIndex !== null && (
          <Lightbox
            images={images}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </div>
    </>
  );
}
