export type ImageOrientation = 'portrait' | 'landscape' | 'square';

export interface MasonryItem {
  id: string;
  title: string;
  category: 'landscape' | 'portraits' | 'architecture' | 'documentary';
  location: string;
  year?: string;
  img?: string;
  src?: string; // Support either img or src
  width?: number;
  height?: number; // Natural/display pixel height, or legacy weight
  aspectRatio?: number; // width / height (e.g., 1.5 for 3:2 landscape, 0.667 for 2:3 portrait, 1.0 for square)
  orientation?: ImageOrientation;
  mobileSpan?: 1 | 2;
  slug?: string;
}

/**
 * Derives natural orientation and aspect ratio from item metadata.
 * Supports explicit orientation, explicit aspectRatio, width/height dimensions,
 * or legacy height weight.
 */
export function getItemGeometry(item: MasonryItem): {
  orientation: ImageOrientation;
  aspectRatio: number;
} {
  // If explicit orientation is given:
  if (item.orientation) {
    if (item.aspectRatio) {
      return { orientation: item.orientation, aspectRatio: item.aspectRatio };
    }
    if (item.width && item.height) {
      return { orientation: item.orientation, aspectRatio: item.width / item.height };
    }
    const defaultRatio =
      item.orientation === 'landscape' ? 1.5 : item.orientation === 'portrait' ? 0.667 : 1.0;
    return { orientation: item.orientation, aspectRatio: defaultRatio };
  }

  // If explicit aspectRatio is given:
  if (item.aspectRatio) {
    const orientation: ImageOrientation =
      item.aspectRatio > 1.15 ? 'landscape' : item.aspectRatio < 0.88 ? 'portrait' : 'square';
    return { orientation, aspectRatio: item.aspectRatio };
  }

  // If width and height are given:
  if (item.width && item.height) {
    const ratio = item.width / item.height;
    const orientation: ImageOrientation =
      ratio > 1.15 ? 'landscape' : ratio < 0.88 ? 'portrait' : 'square';
    return { orientation, aspectRatio: ratio };
  }

  // Fallback for legacy height-only items:
  const legacyHeight = item.height || 450;
  const legacyRatio = 340 / legacyHeight;
  return {
    orientation: legacyRatio > 1.15 ? 'landscape' : legacyRatio < 0.88 ? 'portrait' : 'square',
    aspectRatio: legacyRatio,
  };
}

export const masonryPortfolioItems: MasonryItem[] = [
  {
    id: '1',
    title: 'Monochrome Study I',
    category: 'documentary',
    location: 'Varanasi, India',
    year: '2024',
    src: '/homepage/01.jpg',
    img: '/homepage/01.jpg',
    width: 4032,
    height: 2688,
    aspectRatio: 1.5,
    orientation: 'landscape',
    mobileSpan: 2,
  },
  {
    id: '2',
    title: 'Canoe in Quiet Waters',
    category: 'portraits',
    location: 'Moraine Lake, Canada',
    year: '2023',
    src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&h=1200&q=80',
    img: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&h=1200&q=80',
    width: 800,
    height: 1200,
    aspectRatio: 0.667,
    orientation: 'portrait',
    mobileSpan: 1,
  },
  {
    id: '3',
    title: 'The Artisan’s Touch',
    category: 'documentary',
    location: 'Kolkata, India',
    year: '2024',
    src: '/homepage/02.jpg',
    img: '/homepage/02.jpg',
    width: 800,
    height: 1200,
    aspectRatio: 0.667,
    orientation: 'portrait',
    mobileSpan: 1,
  },
  {
    id: '4',
    title: 'Grizzly on Moraine',
    category: 'landscape',
    location: 'Denali Ridge, Alaska',
    year: '2023',
    src: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&h=1200&q=80',
    img: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&h=1200&q=80',
    width: 800,
    height: 1200,
    aspectRatio: 0.667,
    orientation: 'portrait',
    mobileSpan: 1,
  },
  {
    id: '5',
    title: 'Monolithic Geometry',
    category: 'architecture',
    location: 'Glass Canopy, Tokyo',
    year: '2024',
    src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&h=1200&q=80',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&h=1200&q=80',
    width: 800,
    height: 1200,
    aspectRatio: 0.667,
    orientation: 'portrait',
    mobileSpan: 1,
  },
  {
    id: '6',
    title: 'Dawn on the Ghats',
    category: 'landscape',
    location: 'Haridwar, India',
    year: '2023',
    src: '/homepage/03.jpg',
    img: '/homepage/03.jpg',
    width: 3878,
    height: 2585,
    aspectRatio: 1.5,
    orientation: 'landscape',
    mobileSpan: 2,
  },
  {
    id: '7',
    title: 'Shadows in the Courtyard',
    category: 'architecture',
    location: 'Jaipur, India',
    year: '2024',
    src: '/homepage/04.jpg',
    img: '/homepage/04.jpg',
    width: 800,
    height: 1200,
    aspectRatio: 0.667,
    orientation: 'portrait',
    mobileSpan: 1,
  },
  {
    id: '8',
    title: 'Apostles at Dawn',
    category: 'landscape',
    location: 'Great Ocean Road, Victoria',
    year: '2024',
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&h=1200&q=80',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&h=1200&q=80',
    width: 800,
    height: 1200,
    aspectRatio: 0.667,
    orientation: 'portrait',
    mobileSpan: 1,
  },
  {
    id: '9',
    title: 'Yosemite Cathedral Rocks',
    category: 'landscape',
    location: 'El Capitan Valley, CA',
    year: '2022',
    src: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1600&h=1067&q=80',
    img: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1600&h=1067&q=80',
    width: 1600,
    height: 1067,
    aspectRatio: 1.5,
    orientation: 'landscape',
    mobileSpan: 2,
  },
  {
    id: '10',
    title: 'Ephemeral Light',
    category: 'landscape',
    location: 'Leh, Ladakh',
    year: '2024',
    src: '/homepage/06.jpg',
    img: '/homepage/06.jpg',
    width: 800,
    height: 1200,
    aspectRatio: 0.667,
    orientation: 'portrait',
    mobileSpan: 1,
  },
  {
    id: '11',
    title: 'Old Quarter Alley',
    category: 'architecture',
    location: 'Dubrovnik Coastline',
    year: '2023',
    src: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&h=1200&q=80',
    img: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&h=1200&q=80',
    width: 800,
    height: 1200,
    aspectRatio: 0.667,
    orientation: 'portrait',
    mobileSpan: 1,
  },
  {
    id: '12',
    title: 'Silent Devotion',
    category: 'documentary',
    location: 'Madurai, India',
    year: '2023',
    src: '/homepage/05.jpg',
    img: '/homepage/05.jpg',
    width: 4032,
    height: 2688,
    aspectRatio: 1.5,
    orientation: 'landscape',
    mobileSpan: 2,
  },
];
