import { Photograph } from '@/types/photography';

/**
 * Standalone Portrait Photographs.
 * Image assets are stored in public/images/portraits/.
 */
export const portraitsData: Photograph[] = [
  {
    id: 'portrait-reflections-on-the-hooghly',
    src: '/images/portraits/reflections-on-the-hooghly.jpg',
    alt: 'Reflections on the Hooghly — Portrait photograph by Dilkhush Choubey',
    title: 'Reflections on the Hooghly',
    aspectRatio: '3:4',
    width: 1536,
    height: 2048,
    metadata: {
      location: 'Howrah Ghat, Kolkata',
      date: '2025',
      notes: 'Morning light and quiet waters under the cantilever bridge span.',
    },
  },
  {
    id: 'portrait-colors-of-braj',
    src: '/images/portraits/colors-of-braj.jpg',
    alt: 'Colors of Braj — Portrait photograph by Dilkhush Choubey',
    title: 'Colors of Braj',
    aspectRatio: '3:2',
    width: 2781,
    height: 1854,
    metadata: {
      location: 'Vrindavan, India',
      date: '2024',
      notes: 'Gulal-dusted young celebrants during the spring festival of colors.',
    },
  },
  {
    id: 'portrait-quiet-transit',
    src: '/images/portraits/quiet-transit.jpg',
    alt: 'Quiet Transit — Portrait photograph by Dilkhush Choubey',
    title: 'Quiet Transit',
    aspectRatio: '16:9',
    width: 2220,
    height: 1249,
    metadata: {
      location: 'Eastern Railway, India',
      date: '2023',
      notes: 'A mother holding her child in contemplation beside the suburban train window.',
    },
  },
  {
    id: 'portrait-nomad-of-thar',
    src: '/images/portraits/nomad-of-thar.jpg',
    alt: 'Nomad of Thar — Portrait photograph by Dilkhush Choubey',
    title: 'Nomad of Thar',
    aspectRatio: '3:4',
    width: 3223,
    height: 4297,
    metadata: {
      location: 'Pushkar, Rajasthan',
      date: '2024',
      notes: 'Striking weathered portrait of a Rajasthani camel herder.',
    },
  },
];

/**
 * Returns all individual portrait photographs.
 */
export function getPortraitsPhotographs(): Photograph[] {
  return [...portraitsData];
}

