import { Project } from '@/types/photography';

export const projectsData: Project[] = [
  {
    id: 'kumartuli',
    slug: 'kumartuli-where-clay-becomes-faith',
    title: 'Kumartuli: Where Clay Becomes Faith',
    subtitle: 'An observational inquiry into the sculptors of northern Kolkata',
    kind: 'project',
    year: '2023–2024',
    location: 'Kolkata, West Bengal, India',
    statement: [
      'In the labyrinthine lanes of Kumartuli along the Hooghly riverbank, generations of hereditary artisans mold alluvial silt from the riverbed into sacred iconography.',
      'Over the monsoon months preceding Durga Puja, bamboo frames, straw, and clay coalesce into divine figures before receiving life through the ceremonial painting of the eyes. This series documents the physical weight, dust, and quiet absorption of the artisans whose hands bridge the elemental earth and communal transcendence.',
    ],
    order: 1,
    featured: true,
    coverImage: {
      id: 'kumartuli-cover',
      src: '/images/projects/kumartuli/kumartuli-01.svg',
      alt: 'Artisan applying alluvial river silt to straw effigy, Kumartuli, Kolkata',
      title: 'The First Layer',
      aspectRatio: '3:2',
      width: 1800,
      height: 1200,
      metadata: {
        location: 'Kumartuli, Kolkata, India',
        date: 'October 2023',
        time: '07:15 AM',
      },
    },
    photographs: [
      {
        id: 'kumartuli-01',
        src: '/images/projects/kumartuli/kumartuli-01.svg',
        alt: 'Artisan applying alluvial river silt to straw effigy, Kumartuli, Kolkata',
        title: 'The First Layer',
        aspectRatio: '3:2',
        width: 1800,
        height: 1200,
        metadata: {
          location: 'Kumartuli Lane 4, Kolkata',
          date: 'October 12, 2023',
          time: '07:15 AM',
        },
      },
      {
        id: 'kumartuli-02',
        src: '/images/projects/kumartuli/kumartuli-02.svg',
        alt: 'Bamboo and straw armatures suspended in workshop gloom',
        title: 'Skeletons in Straw',
        aspectRatio: '4:3',
        width: 1600,
        height: 1200,
        metadata: {
          location: 'Potters Studio, Kumartuli',
          date: 'October 14, 2023',
          time: '11:40 AM',
        },
      },
      {
        id: 'kumartuli-03',
        src: '/images/projects/kumartuli/kumartuli-03.svg',
        alt: 'Hands shaping delicate facial contours of the goddess',
        title: 'Chokkhu Daan: Bestowing Vision',
        aspectRatio: '3:2',
        width: 1800,
        height: 1200,
        metadata: {
          location: 'Workshops of Banamali Sarkar Street',
          date: 'October 18, 2023',
          time: '04:30 PM',
        },
      },
      {
        id: 'kumartuli-04',
        src: '/images/projects/kumartuli/kumartuli-04.svg',
        alt: 'Finished idols awaiting transport along the Hooghly riverbank',
        title: 'The Threshold of the River',
        aspectRatio: '3:2',
        width: 1800,
        height: 1200,
        metadata: {
          location: 'Hooghly Ghat, North Kolkata',
          date: 'October 20, 2023',
          time: '06:10 AM',
        },
      },
    ],
  },
  {
    id: 'rolls-royce-holi',
    slug: 'rolls-royce-holi',
    title: 'Rolls Royce Holi',
    subtitle: 'Ritual, patronage, and chromatic collision',
    kind: 'project',
    year: '2024',
    location: 'Rajasthan, India',
    statement: [
      'A visual encounter with the spectacle of celebratory privilege and communal ritual in Rajasthan. During the festival of Holi, aristocratic vintage vehicles pass through historic courtyards saturated in gulal and abir.',
      'The series examines the friction between ceremonial pageantry, heritage machinery, and the democratic chaos of powdered color that coats both metal and skin without distinction.',
    ],
    order: 2,
    featured: true,
    coverImage: {
      id: 'rolls-royce-cover',
      src: '/images/projects/rolls-royce-holi/rolls-royce-01.svg',
      alt: 'Vintage Rolls Royce covered in crimson and saffron pigment dust, Rajasthan',
      title: 'The Coated Silver Ghost',
      aspectRatio: '3:2',
      width: 1800,
      height: 1200,
      metadata: {
        location: 'Jaipur Palace Courtyard, Rajasthan',
        date: 'March 2024',
        time: '11:20 AM',
      },
    },
    photographs: [
      {
        id: 'rolls-royce-01',
        src: '/images/projects/rolls-royce-holi/rolls-royce-01.svg',
        alt: 'Vintage Rolls Royce covered in crimson and saffron pigment dust, Rajasthan',
        title: 'The Coated Silver Ghost',
        aspectRatio: '3:2',
        width: 1800,
        height: 1200,
        metadata: {
          location: 'City Palace Environs, Jaipur',
          date: 'March 25, 2024',
          time: '11:20 AM',
        },
      },
      {
        id: 'rolls-royce-02',
        src: '/images/projects/rolls-royce-holi/rolls-royce-02.svg',
        alt: 'Crowd dispersing clouds of abir against stone palace arches',
        title: 'Canopy of Vermilion',
        aspectRatio: '4:3',
        width: 1600,
        height: 1200,
        metadata: {
          location: 'Tripolia Gate, Jaipur',
          date: 'March 25, 2024',
          time: '01:05 PM',
        },
      },
      {
        id: 'rolls-royce-03',
        src: '/images/projects/rolls-royce-holi/rolls-royce-03.svg',
        alt: 'Driver resting on running board under stained glass canopy',
        title: 'Intermission in Ochre',
        aspectRatio: '3:2',
        width: 1800,
        height: 1200,
        metadata: {
          location: 'Jaleb Chowk, Jaipur',
          date: 'March 25, 2024',
          time: '02:45 PM',
        },
      },
      {
        id: 'rolls-royce-04',
        src: '/images/projects/rolls-royce-holi/rolls-royce-04.svg',
        alt: 'Chromium hood ornament shrouded in rose powder',
        title: 'Spirit of Ecstasy in Gulal',
        aspectRatio: '4:3',
        width: 1600,
        height: 1200,
        metadata: {
          location: 'Palace Gardens, Jaipur',
          date: 'March 25, 2024',
          time: '04:15 PM',
        },
      },
    ],
  },
  {
    id: 'solitary-river-dawn',
    slug: 'the-solitary-river-dawn-on-the-ghats',
    title: 'The Solitary River: Dawn on the Ghats',
    subtitle: 'A short visual study along the sacred riverfront',
    kind: 'series',
    year: '2024',
    location: 'Varanasi, Uttar Pradesh, India',
    statement: [
      'A focused short photographic series captured over four consecutive dawns along the river Ganga. The works observe stillness before morning prayers transform the stone riverbanks into civic devotion.',
    ],
    order: 3,
    featured: false,
    coverImage: {
      id: 'river-dawn-cover',
      src: '/images/series/solitary-river/river-dawn-01.svg',
      alt: 'A lone wooden boat adrift in morning mist on the river Ganga, Varanasi',
      title: 'Mist on the Water',
      aspectRatio: '3:2',
      width: 1800,
      height: 1200,
      metadata: {
        location: 'Assi Ghat, Varanasi',
        date: 'January 2024',
        time: '05:48 AM',
      },
    },
    photographs: [
      {
        id: 'river-dawn-01',
        src: '/images/series/solitary-river/river-dawn-01.svg',
        alt: 'A lone wooden boat adrift in morning mist on the river Ganga, Varanasi',
        title: 'Mist on the Water',
        aspectRatio: '3:2',
        width: 1800,
        height: 1200,
        metadata: {
          location: 'Assi Ghat, Varanasi',
          date: 'January 14, 2024',
          time: '05:48 AM',
        },
      },
      {
        id: 'river-dawn-02',
        src: '/images/series/solitary-river/river-dawn-02.svg',
        alt: 'Silhouetted bather stepping into the cold river current',
        title: 'First Immersion',
        aspectRatio: '4:3',
        width: 1600,
        height: 1200,
        metadata: {
          location: 'Tulsi Ghat, Varanasi',
          date: 'January 15, 2024',
          time: '06:05 AM',
        },
      },
      {
        id: 'river-dawn-03',
        src: '/images/series/solitary-river/river-dawn-03.svg',
        alt: 'Flock of migratory Siberian gulls sweeping over the stone steps',
        title: 'The Winter Migrants',
        aspectRatio: '3:2',
        width: 1800,
        height: 1200,
        metadata: {
          location: 'Kedar Ghat, Varanasi',
          date: 'January 16, 2024',
          time: '06:30 AM',
        },
      },
      {
        id: 'river-dawn-04',
        src: '/images/series/solitary-river/river-dawn-04.svg',
        alt: 'Pujari preparing brass oil lamps on cold sandstone steps',
        title: 'Kindling the Flame',
        aspectRatio: '4:3',
        width: 1600,
        height: 1200,
        metadata: {
          location: 'Dashashwamedh Ghat, Varanasi',
          date: 'January 17, 2024',
          time: '06:52 AM',
        },
      },
    ],
  },
];

export function getAllProjects(): Project[] {
  return [...projectsData].sort((a, b) => a.order - b.order);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projectsData.find((project) => project.slug === slug);
}

export function getMajorProjects(): Project[] {
  return projectsData.filter((project) => project.kind === 'project');
}

export function getShortSeries(): Project[] {
  return projectsData.filter((project) => project.kind === 'series');
}
