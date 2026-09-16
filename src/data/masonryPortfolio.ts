export interface MasonryItem {
  id: string;
  title: string;
  category: 'landscape' | 'portraits' | 'architecture' | 'documentary';
  location: string;
  year?: string;
  img: string;
  height: number; // Height weight for masonry column binning
  slug?: string;
}

export const masonryPortfolioItems: MasonryItem[] = [
  {
    id: '1',
    title: 'Monochrome Study I',
    category: 'documentary',
    location: 'Varanasi, India',
    year: '2024',
    img: '/homepage/01.jpg',
    height: 520,
  },
  {
    id: '2',
    title: 'Canoe in Quiet Waters',
    category: 'portraits',
    location: 'Moraine Lake, Canada',
    year: '2023',
    img: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80',
    height: 380,
  },
  {
    id: '3',
    title: 'The Artisan’s Touch',
    category: 'documentary',
    location: 'Kolkata, India',
    year: '2024',
    img: '/homepage/02.jpg',
    height: 340,
  },
  {
    id: '4',
    title: 'Grizzly on Moraine',
    category: 'landscape',
    location: 'Denali Ridge, Alaska',
    year: '2023',
    img: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80',
    height: 580,
  },
  {
    id: '5',
    title: 'Dawn on the Ghats',
    category: 'landscape',
    location: 'Haridwar, India',
    year: '2023',
    img: '/homepage/03.jpg',
    height: 640,
  },
  {
    id: '6',
    title: 'Monolithic Geometry',
    category: 'architecture',
    location: 'Glass Canopy, Tokyo',
    year: '2024',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    height: 680,
  },
  {
    id: '7',
    title: 'Shadows in the Courtyard',
    category: 'architecture',
    location: 'Jaipur, India',
    year: '2024',
    img: '/homepage/04.jpg',
    height: 320,
  },
  {
    id: '8',
    title: 'Yosemite Cathedral Rocks',
    category: 'landscape',
    location: 'El Capitan Valley, CA',
    year: '2022',
    img: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=800&q=80',
    height: 420,
  },
  {
    id: '9',
    title: 'Silent Devotion',
    category: 'documentary',
    location: 'Madurai, India',
    year: '2023',
    img: '/homepage/05.jpg',
    height: 460,
  },
  {
    id: '10',
    title: 'Apostles at Dawn',
    category: 'landscape',
    location: 'Great Ocean Road, Victoria',
    year: '2024',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    height: 360,
  },
  {
    id: '11',
    title: 'Ephemeral Light',
    category: 'landscape',
    location: 'Leh, Ladakh',
    year: '2024',
    img: '/homepage/06.jpg',
    height: 380,
  },
  {
    id: '12',
    title: 'Old Quarter Alley',
    category: 'architecture',
    location: 'Dubrovnik Coastline',
    year: '2023',
    img: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80',
    height: 480,
  },
];
