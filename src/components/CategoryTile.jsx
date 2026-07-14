import React from 'react';
import { Link } from 'react-router-dom';
import ImageWrapper from './ImageWrapper';

export default function CategoryTile({ category }) {
  const { name, slug, coverImageUrl } = category;

  return (
    <Link to={`/work/${slug}`} className="group block select-none">
      <div className="aspect-[4/3] overflow-hidden bg-neutral-100 relative border border-neutral-100">
        <ImageWrapper
          src={coverImageUrl}
          alt={name}
          className="w-full h-full"
          imgClassName="group-hover:scale-[1.03] transition-transform duration-700 ease-out"
        />
      </div>
      <div className="pt-2 sm:pt-3 pb-2 border-b border-neutral-200 flex justify-between items-baseline gap-2">
        <h3 className="text-[10px] sm:text-xs font-medium tracking-widest uppercase text-neutral-800 group-hover:text-accent transition-colors duration-300 truncate">
          {name}
        </h3>
        <span className="inline text-[10px] sm:text-xs text-neutral-400 font-light group-hover:translate-x-1 transition-transform duration-300 shrink-0">
          View &rarr;
        </span>
      </div>
    </Link>
  );
}
