import { Photograph } from '@/types/photography';

/**
 * Standalone Still Photographs.
 * Assets stored in public/images/stills/.
 *
 * Ordered by approved editorial ranking (Rank 1 to 14).
 * Desktop columns are designated via the `column` property ('left' | 'right').
 */
export const stillsData: Photograph[] = [
  // Rank 1: Left Column #1 (Landscape 3:2)
  {
    id: 'still-img-0091',
    src: '/images/stills/IMG_0091.JPG',
    alt: 'Monsoon Over Howrah — Photograph by Dilkhush Choubey',
    title: 'Monsoon Over Howrah',
    aspectRatio: '3:2',
    width: 3342,
    height: 2228,
    column: 'left',
    rank: 1,
    metadata: {
      location: 'Kolkata, India',
      date: '2024',
      notes: 'Torrential downpour framing vintage state buses below the iconic steel bridge.',
    },
  },
  // Rank 2: Right Column #1 (Landscape 16:9)
  {
    id: 'still-img-5467',
    src: '/images/stills/IMG_5467.jpg',
    alt: 'Quiet Transit — Photograph by Dilkhush Choubey',
    title: 'Quiet Transit',
    aspectRatio: '16:9',
    width: 2220,
    height: 1249,
    column: 'right',
    rank: 2,
    metadata: {
      location: 'Eastern Railway, India',
      date: '2023',
      notes: 'A mother holding her child in contemplation beside the suburban train window.',
    },
  },
  // Rank 3: Right Column #2 (Portrait 3:4)
  {
    id: 'still-img-3866',
    src: '/images/stills/IMG_3866.JPG',
    alt: 'Mother and Child — Photograph by Dilkhush Choubey',
    title: 'Mother and Child',
    aspectRatio: '3:4',
    width: 1536,
    height: 2048,
    column: 'right',
    rank: 3,
    metadata: {
      location: 'Kolkata, India',
      date: '2025',
      notes: 'Morning light and quiet waters under the cantilever bridge span.',
    },
  },
  // Rank 4: Left Column #2 (Landscape 4:3)
  {
    id: 'still-img-5559',
    src: '/images/stills/IMG_5559.heic',
    alt: 'Still photograph by Dilkhush Choubey',
    aspectRatio: '4:3',
    width: 4032,
    height: 3024,
    column: 'left',
    rank: 4,
  },
  // Rank 5: Left Column #3 (Landscape 4:3)
  {
    id: 'still-img-5832',
    src: '/images/stills/IMG_5832.heic',
    alt: 'Still photograph by Dilkhush Choubey',
    aspectRatio: '4:3',
    width: 3024,
    height: 2268,
    column: 'left',
    rank: 5,
  },
  // Rank 6: Right Column #3 (Portrait 3:4)
  {
    id: 'still-51e6df02-6e1b-483b-96b6-b6bbd4a5910a-3',
    src: '/images/stills/51E6DF02-6E1B-483B-96B6-B6BBD4A5910A-3.jpg',
    alt: 'The Artisan’s Touch — Photograph by Dilkhush Choubey',
    title: 'The Artisan’s Touch',
    aspectRatio: '3:4',
    width: 2448,
    height: 3264,
    column: 'right',
    rank: 6,
    metadata: {
      location: 'Kumartuli, Kolkata',
      date: '2024',
      notes: 'Generations of hereditary craftsmanship shaping sacred forms before the festival.',
    },
  },
  // Rank 7: Right Column #4 (Landscape 3:2)
  {
    id: 'still-img-0643',
    src: '/images/stills/IMG_0643.heic',
    alt: 'Still photograph by Dilkhush Choubey',
    aspectRatio: '3:2',
    width: 3723,
    height: 2482,
    column: 'right',
    rank: 7,
  },
  // Rank 8: Left Column #4 (Landscape 4:3)
  {
    id: 'still-dscf9700',
    src: '/images/stills/DSCF9700.jpg',
    alt: 'Still photograph by Dilkhush Choubey',
    aspectRatio: '4:3',
    width: 3024,
    height: 2268,
    column: 'left',
    rank: 8,
  },
  // Rank 9: Left Column #5 (Landscape 4:3)
  {
    id: 'still-img-1579',
    src: '/images/stills/IMG_1579.heic',
    alt: 'Still photograph by Dilkhush Choubey',
    aspectRatio: '4:3',
    width: 2783,
    height: 2087,
    column: 'left',
    rank: 9,
  },
  // Rank 10: Right Column #5 (Landscape 3:2)
  {
    id: 'still-img-5456',
    src: '/images/stills/IMG_5456.heic',
    alt: 'Solitude in the Alley — Photograph by Dilkhush Choubey',
    title: 'Solitude in the Alley',
    aspectRatio: '3:2',
    width: 2781,
    height: 1854,
    column: 'right',
    rank: 10,
    metadata: {
      location: 'Kolkata, India',
      date: '2024',
      notes: 'High contrast light and deep shadows along the ancient stone alleys.',
    },
  },
  // Rank 11: Right Column #6 (Landscape 3:2)
  {
    id: 'still-img-8830',
    src: '/images/stills/IMG_8830.jpg',
    alt: 'Still photograph by Dilkhush Choubey',
    aspectRatio: '3:2',
    width: 3663,
    height: 2442,
    column: 'right',
    rank: 11,
  },
  // Rank 12: Right Column #7 (Landscape 3:2)
  {
    id: 'still-img-0647',
    src: '/images/stills/IMG_0647.heic',
    alt: 'Still photograph by Dilkhush Choubey',
    aspectRatio: '3:2',
    width: 8064,
    height: 5376,
    column: 'right',
    rank: 12,
  },
  // Rank 13: Left Column #6 (Portrait 3:4)
  {
    id: 'still-img-1664',
    src: '/images/stills/IMG_1664.heic',
    alt: 'Divine Veil — Photograph by Dilkhush Choubey',
    title: 'Divine Veil',
    aspectRatio: '3:4',
    width: 3024,
    height: 4032,
    column: 'left',
    rank: 13,
    metadata: {
      location: 'Mumbai, India',
      date: '2024',
      notes: 'Sacred garland and ritual smoke during the immersion procession.',
    },
  },
  // Rank 14: Left Column #7 (Landscape 4:3)
  {
    id: 'still-img-0501',
    src: '/images/stills/IMG_0501.jpg',
    alt: 'Still photograph by Dilkhush Choubey',
    aspectRatio: '4:3',
    width: 2853,
    height: 2140,
    column: 'left',
    rank: 14,
  },
];

/**
 * Returns all standalone still photographs sorted by priority rank.
 */
export function getStillsPhotographs(): Photograph[] {
  return [...stillsData].sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
}

/**
 * Returns left column stills in configured display order.
 */
export function getLeftColumnStills(): Photograph[] {
  return stillsData.filter((p) => p.column === 'left');
}

/**
 * Returns right column stills in configured display order.
 */
export function getRightColumnStills(): Photograph[] {
  return stillsData.filter((p) => p.column === 'right');
}
