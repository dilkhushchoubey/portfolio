import { Photograph } from '@/types/photography';

/**
 * Standalone Still Photographs.
 * Image assets are stored in public/images/stills/.
 */
export const stillsData: Photograph[] = [
  {
    id: 'still-monochrome-study-01',
    src: '/images/stills/monochrome-study-01.jpg',
    alt: 'Monochrome Study I — Photograph by Dilkhush Choubey',
    title: 'Monochrome Study I',
    aspectRatio: '3:2',
    width: 4032,
    height: 2688,
    metadata: {
      location: 'Kumartuli, Kolkata',
      date: '2024',
      notes: 'Raw earth and hereditary sculpting methods documented along the riverfront.',
    },
  },
  {
    id: 'still-divine-veil',
    src: '/images/stills/divine-veil.jpg',
    alt: 'Divine Veil — Photograph by Dilkhush Choubey',
    title: 'Divine Veil',
    aspectRatio: '3:4',
    width: 3024,
    height: 4032,
    metadata: {
      location: 'Mumbai, India',
      date: '2024',
      notes: 'Sacred garland and ritual smoke during the immersion procession.',
    },
  },
  {
    id: 'still-the-artisans-touch',
    src: '/images/stills/the-artisans-touch.jpg',
    alt: 'The Artisan’s Touch — Photograph by Dilkhush Choubey',
    title: 'The Artisan’s Touch',
    aspectRatio: '3:4',
    width: 2448,
    height: 3264,
    metadata: {
      location: 'Kumartuli, Kolkata',
      date: '2024',
      notes: 'Generations of hereditary craftsmanship shaping sacred forms before the festival.',
    },
  },
  {
    id: 'still-sacred-form',
    src: '/images/stills/sacred-form.jpg',
    alt: 'Sacred Form — Photograph by Dilkhush Choubey',
    title: 'Sacred Form',
    aspectRatio: '3:2',
    width: 3016,
    height: 2011,
    metadata: {
      location: 'Kumartuli, Kolkata',
      date: '2024',
      notes: 'Chiaroscuro study of clay deities emerging from shadow in the workshop.',
    },
  },
  {
    id: 'still-solitude-in-the-alley',
    src: '/images/stills/solitude-in-the-alley.jpg',
    alt: 'Solitude in the Alley — Photograph by Dilkhush Choubey',
    title: 'Solitude in the Alley',
    aspectRatio: '3:2',
    width: 3393,
    height: 2262,
    metadata: {
      location: 'Varanasi, India',
      date: '2024',
      notes: 'High contrast light and deep shadows along the ancient stone alleys.',
    },
  },
  {
    id: 'still-incense-and-devotion',
    src: '/images/stills/incense-and-devotion.jpg',
    alt: 'Incense and Devotion — Photograph by Dilkhush Choubey',
    title: 'Incense and Devotion',
    aspectRatio: '3:4',
    width: 1536,
    height: 2048,
    metadata: {
      location: 'Varanasi, India',
      date: '2024',
      notes: 'Sanctum dhoop offering sending prayer plumes into the evening dusk.',
    },
  },
  {
    id: 'still-master-craftsman',
    src: '/images/stills/master-craftsman.jpg',
    alt: 'Master Craftsman — Photograph by Dilkhush Choubey',
    title: 'Master Craftsman',
    aspectRatio: '3:4',
    width: 2754,
    height: 3672,
    metadata: {
      location: 'Kumartuli, Kolkata',
      date: '2024',
      notes: 'Intricate detail brushwork on terracotta miniature deities.',
    },
  },
  {
    id: 'still-monsoon-over-howrah',
    src: '/images/stills/monsoon-over-howrah.jpg',
    alt: 'Monsoon Over Howrah — Photograph by Dilkhush Choubey',
    title: 'Monsoon Over Howrah',
    aspectRatio: '3:2',
    width: 3342,
    height: 2228,
    metadata: {
      location: 'Kolkata, India',
      date: '2024',
      notes: 'Torrential downpour framing vintage state buses below the iconic steel bridge.',
    },
  },
];

/**
 * Returns all standalone still photographs.
 */
export function getStillsPhotographs(): Photograph[] {
  return [...stillsData];
}

