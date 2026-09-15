import { Project, Photograph } from '@/types/photography';

export const projectsData: Project[] = [
  {
    id: 'kumartuli',
    slug: 'kumartuli-where-clay-becomes-faith',
    title: 'Kumartuli: Where Clay Becomes Faith',
    kind: 'project',
    year: '2023–2024',
    location: 'Kolkata, India',
    statement: [
      'A photographic series documenting the traditional clay idol artisans of Kumartuli along the Hooghly river in northern Kolkata.',
      'Over the months leading to Durga Puja, raw clay, straw, and bamboo are shaped into sacred forms through generations of hereditary craftsmanship.',
    ],
    coverPhotoId: 'kumartuli-01',
    order: 1,
    featured: true,
    photographs: [
      {
        id: 'kumartuli-01',
        src: '/images/projects/kumartuli/kumartuli-01.svg',
        alt: 'Artisan applying alluvial river silt to straw effigy in Kumartuli, Kolkata',
        title: 'The First Layer',
        aspectRatio: '3:2',
        width: 1800,
        height: 1200,
        metadata: {
          location: 'Kumartuli, Kolkata',
          date: 'October 2023',
          time: '07:15 AM',
        },
      },
      {
        id: 'kumartuli-02',
        src: '/images/projects/kumartuli/kumartuli-02.svg',
        alt: 'Bamboo and straw armatures suspended in workshop interior, Kumartuli',
        title: 'Armatures in Straw',
        aspectRatio: '4:3',
        width: 1600,
        height: 1200,
        metadata: {
          location: 'Kumartuli, Kolkata',
          date: 'October 2023',
          time: '11:40 AM',
        },
      },
      {
        id: 'kumartuli-03',
        src: '/images/projects/kumartuli/kumartuli-03.svg',
        alt: 'Hands shaping facial contours of clay sculpture, Kumartuli',
        title: 'Chokkhu Daan',
        aspectRatio: '3:2',
        width: 1800,
        height: 1200,
        metadata: {
          location: 'Kumartuli, Kolkata',
          date: 'October 2023',
          time: '04:30 PM',
        },
      },
      {
        id: 'kumartuli-04',
        src: '/images/projects/kumartuli/kumartuli-04.svg',
        alt: 'Clay sculptures awaiting transport along the riverbank in northern Kolkata',
        title: 'Riverbank Workshop',
        aspectRatio: '3:2',
        width: 1800,
        height: 1200,
        metadata: {
          location: 'Kumartuli, Kolkata',
          date: 'October 2023',
          time: '06:10 AM',
        },
      },
    ],
  },
  {
    id: 'rolls-royce-holi',
    slug: 'rolls-royce-holi',
    title: 'Rolls Royce Holi',
    kind: 'project',
    year: '2024',
    location: 'Rajasthan, India',
    statement: [
      'Photographs from Holi celebrations in Rajasthan, observing vintage Rolls Royce automobiles amidst communal festival festivities and pigment dust.',
    ],
    coverPhotoId: 'rolls-royce-01',
    order: 2,
    featured: true,
    photographs: [
      {
        id: 'rolls-royce-01',
        src: '/images/projects/rolls-royce-holi/rolls-royce-01.svg',
        alt: 'Vintage Rolls Royce automobile coated in red and saffron Holi pigment, Rajasthan',
        title: 'Coated Silver Ghost',
        aspectRatio: '3:2',
        width: 1800,
        height: 1200,
        metadata: {
          location: 'Rajasthan, India',
          date: 'March 2024',
          time: '11:20 AM',
        },
      },
      {
        id: 'rolls-royce-02',
        src: '/images/projects/rolls-royce-holi/rolls-royce-02.svg',
        alt: 'Atmosphere of colored powder rising above historical arches during Holi, Rajasthan',
        title: 'Pigment Cloud',
        aspectRatio: '4:3',
        width: 1600,
        height: 1200,
        metadata: {
          location: 'Rajasthan, India',
          date: 'March 2024',
          time: '01:05 PM',
        },
      },
      {
        id: 'rolls-royce-03',
        src: '/images/projects/rolls-royce-holi/rolls-royce-03.svg',
        alt: 'Driver seated on running board of vintage vehicle during Holi, Rajasthan',
        title: 'Resting by the Running Board',
        aspectRatio: '3:2',
        width: 1800,
        height: 1200,
        metadata: {
          location: 'Rajasthan, India',
          date: 'March 2024',
          time: '02:45 PM',
        },
      },
      {
        id: 'rolls-royce-04',
        src: '/images/projects/rolls-royce-holi/rolls-royce-04.svg',
        alt: 'Car mascot and hood ornament dusted with gulal pigment, Rajasthan',
        title: 'Mascot in Powder',
        aspectRatio: '4:3',
        width: 1600,
        height: 1200,
        metadata: {
          location: 'Rajasthan, India',
          date: 'March 2024',
          time: '04:15 PM',
        },
      },
    ],
  },
];

/**
 * Returns all photographic works sorted by display order.
 */
export function getAllProjects(): Project[] {
  return [...projectsData].sort((a, b) => a.order - b.order);
}

/**
 * Returns a project or series by its URL slug.
 */
export function getProjectBySlug(slug: string): Project | undefined {
  return projectsData.find((project) => project.slug === slug);
}

/**
 * Returns featured photographic works.
 */
export function getFeaturedProjects(): Project[] {
  return projectsData.filter((project) => project.featured);
}

/**
 * Returns the designated cover photograph for a project or series.
 * References the photograph matching `project.coverPhotoId`.
 * Falls back to the first photograph if the id is not found.
 */
export function getProjectCover(project: Project): Photograph {
  const found = project.photographs.find((p) => p.id === project.coverPhotoId);
  return found || project.photographs[0];
}

/**
 * Returns previous and next projects for sequential navigation.
 */
export function getAdjacentProjects(slug: string): {
  prevProject: Project | null;
  nextProject: Project | null;
} {
  const all = getAllProjects();
  const currentIndex = all.findIndex((p) => p.slug === slug);

  if (currentIndex === -1) {
    return { prevProject: null, nextProject: null };
  }

  return {
    prevProject: currentIndex > 0 ? all[currentIndex - 1] : null,
    nextProject: currentIndex < all.length - 1 ? all[currentIndex + 1] : null,
  };
}

/**
 * Returns works with kind: "project".
 */
export function getMajorProjects(): Project[] {
  return projectsData.filter((project) => project.kind === 'project');
}

/**
 * Returns works with kind: "series".
 */
export function getShortSeries(): Project[] {
  return projectsData.filter((project) => project.kind === 'series');
}
