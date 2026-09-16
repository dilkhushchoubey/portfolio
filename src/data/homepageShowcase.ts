export interface HomepageSlide {
  id: string;
  src: string;
  alt: string;
  title: string;
  location: string;
  year: string;
  description?: string;
  width?: number;
  height?: number;
}

/**
 * Manually Curated Homepage Showcase Photographs.
 * Upload your images to public/homepage/ (e.g. 01.jpg, 02.jpg, ...)
 * and edit their individual metadata records below.
 */
export const homepageShowcaseSlides: HomepageSlide[] = [
  {
    id: 'homepage-01',
    src: '/homepage/01.jpg',
    alt: 'Monochrome Study I — Sacred Forms in Northern Light',
    title: 'Monochrome Study I',
    location: 'Varanasi, India',
    year: '2024',
    description: 'Raw earth and hereditary sculpting methods documented along the riverfront.',
    width: 4032,
    height: 2688,
  },
  {
    id: 'homepage-02',
    src: '/homepage/02.jpg',
    alt: 'The Artisan’s Touch — Sacred Geometry and Heritage Craft',
    title: 'The Artisan’s Touch',
    location: 'Kolkata, India',
    year: '2024',
    description: 'Generations of hereditary craftsmanship shaping sacred forms before the autumn festival.',
    width: 3016,
    height: 2011,
  },
  {
    id: 'homepage-03',
    src: '/homepage/03.jpg',
    alt: 'Dawn on the Ghats — Quiet Devotion at Sunrise',
    title: 'Dawn on the Ghats',
    location: 'Haridwar, India',
    year: '2023',
    description: 'First light sweeping across sacred stone steps as early pilgrims gather.',
    width: 3878,
    height: 2585,
  },
  {
    id: 'homepage-04',
    src: '/homepage/04.jpg',
    alt: 'Shadows in the Courtyard — Architecture of Memory',
    title: 'Shadows in the Courtyard',
    location: 'Jaipur, India',
    year: '2024',
    description: 'Geometric interplay of light, lime plaster, and midday shadows in the old city.',
    width: 3740,
    height: 2493,
  },
  {
    id: 'homepage-05',
    src: '/homepage/05.jpg',
    alt: 'Silent Devotion — Temple Corridor Stillness',
    title: 'Silent Devotion',
    location: 'Madurai, India',
    year: '2023',
    description: 'Echoes through pillared granite halls during the evening temple rituals.',
    width: 4032,
    height: 2688,
  },
  {
    id: 'homepage-06',
    src: '/homepage/06.jpg',
    alt: 'Ephemeral Light — Solitude and High Altitude',
    title: 'Ephemeral Light',
    location: 'Leh, Ladakh',
    year: '2024',
    description: 'Stark mountain silhouettes under high-altitude Himalayan sun.',
    width: 4005,
    height: 2670,
  },
];
