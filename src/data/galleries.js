// Real project data sourced from the Behance profile:
// https://www.behance.net/akshythakshyth
//
// Each gallery mirrors an actual published project. Cover images are the
// live project covers hosted on Behance's CDN. Since Behance projects are
// rendered client-side (no server-side gallery data is publicly scrapable),
// each gallery links out to the full project on Behance for the complete
// image set, while showing the real cover image here.

export const BEHANCE_PROFILE_URL = 'https://www.behance.net/akshythakshyth';

export const GALLERIES = [
  {
    id: 'pre-wedding',
    slug: 'pre-wedding',
    name: 'Pre Wedding',
    order: 1,
    coverImageUrl: 'https://mir-s3-cdn-cf.behance.net/projects/404/d9dc0a252453133.Y3JvcCwzOTc1LDMxMDksMCw2MTA.jpg',
    behanceUrl: 'https://www.behance.net/gallery/252453133/pre-wedding',
    description: 'Candid, joyful frames from a pre-wedding shoot — natural light and genuine moments between the couple.'
  },
  {
    id: 'portraits',
    slug: 'portraits',
    name: 'Portraits',
    order: 2,
    coverImageUrl: 'https://mir-s3-cdn-cf.behance.net/projects/404/e58ce5252452155.Y3JvcCwyODg1LDIyNTYsMCwyMzU.jpg',
    behanceUrl: 'https://www.behance.net/gallery/252452155/portraits',
    description: 'Intimate character studies exploring expression, mood, and natural light.'
  },
  {
    id: 'little-krishna',
    slug: 'little-krishna',
    name: 'Little Krishna',
    order: 3,
    coverImageUrl: null,
    behanceUrl: 'https://www.behance.net/gallery/250299163/little-Krishna',
    description: 'A themed portrait series photographed around the Little Krishna concept.'
  },
  {
    id: 'in-to-the-wild',
    slug: 'in-to-the-wild',
    name: 'In to the Wild',
    order: 4,
    coverImageUrl: 'https://mir-s3-cdn-cf.behance.net/projects/404/77dba6250298907.Y3JvcCwzOTM3LDMwODAsNzcwLDA.jpg',
    behanceUrl: 'https://www.behance.net/gallery/250298907/in-to-the-wild',
    description: 'Wildlife and outdoor photography exploring nature\u2019s untamed moments.'
  },
  {
    id: 'street-photography',
    slug: 'street-photography',
    name: 'Street Photography',
    order: 5,
    coverImageUrl: 'https://mir-s3-cdn-cf.behance.net/projects/404/bea83c246460187.Y3JvcCw0MDEzLDMxMzgsMCwxNzk3.jpg',
    behanceUrl: 'https://www.behance.net/gallery/246460187/Street-photography',
    description: 'Unscripted city life, texture, and candid human moments.'
  },
  {
    id: '1st-birthday',
    slug: '1st-birthday',
    name: '1st Birthday',
    order: 6,
    coverImageUrl: 'https://mir-s3-cdn-cf.behance.net/projects/404/f8d6ed246459931.Y3JvcCw1NTUzLDQzNDQsMTA4Niww.jpg',
    behanceUrl: 'https://www.behance.net/gallery/246459931/1-st-Birthday',
    description: 'A first-birthday celebration captured in warm, candid frames.'
  },
  {
    id: 'bharatanatyam',
    slug: 'bharatanatyam',
    name: 'Bharatanatyam',
    order: 7,
    coverImageUrl: 'https://mir-s3-cdn-cf.behance.net/projects/404/b75b07246459589.Y3JvcCw0MzQ0LDMzOTcsMCwyNTQ4.jpg',
    behanceUrl: 'https://www.behance.net/gallery/246459589/Bharatanatyam',
    description: 'Classical Bharatanatyam dance photographed in costume, mid-performance.'
  },
  {
    id: 'automotive',
    slug: 'automotive',
    name: 'Automotive',
    order: 8,
    coverImageUrl: 'https://mir-s3-cdn-cf.behance.net/projects/404/27d9a9246459133.Y3JvcCw0MzQ0LDMzOTcsMCwxNzQx.jpg',
    behanceUrl: 'https://www.behance.net/gallery/246459133/Automotive',
    description: 'Automotive photography focused on form, light, and reflection.'
  }
];

export function getGalleryBySlug(slug) {
  return GALLERIES.find((g) => g.slug === slug) || null;
}
