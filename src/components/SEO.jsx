import { useEffect } from 'react';

export default function SEO({ title, description }) {
  useEffect(() => {
    const baseTitle = 'Creative Portfolio';
    document.title = title ? `${title} — ${baseTitle}` : baseTitle;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description || 'A minimal, content-first creative portfolio showcasing fine art and design work.';
  }, [title, description]);

  return null;
}
