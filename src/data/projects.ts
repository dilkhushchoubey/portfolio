import { Project, Photograph } from '@/types/photography';

export const projectsData: Project[] = [
  {
    id: 'kumartuli',
    slug: 'kumartuli-where-clay-becomes-faith',
    title: 'Kumartuli: Where Clay Becomes Faith',
    kind: 'project',
    year: '2026–',
    location: 'Kumartuli, Kolkata, India',
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
        src: '/images/projects/kumartuli/kumartuli_01.JPG',
        alt: 'Kumartuli — Photograph 01',
        aspectRatio: '3:2',
        width: 4032,
        height: 2688,
      },
      {
        id: 'kumartuli-02',
        src: '/images/projects/kumartuli/kumartuli_02.JPG',
        alt: 'Kumartuli — Photograph 02',
        aspectRatio: '3:2',
        width: 3016,
        height: 2011,
      },
      {
        id: 'kumartuli-03',
        src: '/images/projects/kumartuli/kumartuli_03.jpg',
        alt: 'Kumartuli — Photograph 03',
        aspectRatio: '3:2',
        width: 3878,
        height: 2585,
      },
      {
        id: 'kumartuli-04',
        src: '/images/projects/kumartuli/kumartuli_04.JPG',
        alt: 'Kumartuli — Photograph 04',
        aspectRatio: '3:2',
        width: 3740,
        height: 2493,
      },
      {
        id: 'kumartuli-05',
        src: '/images/projects/kumartuli/kumartuli_05.JPG',
        alt: 'Kumartuli — Photograph 05',
        aspectRatio: '3:2',
        width: 4032,
        height: 2688,
      },
      {
        id: 'kumartuli-06',
        src: '/images/projects/kumartuli/kumartuli_06.JPG',
        alt: 'Kumartuli — Photograph 06',
        aspectRatio: '3:2',
        width: 4005,
        height: 2670,
      },
      {
        id: 'kumartuli-07',
        src: '/images/projects/kumartuli/kumartuli_07.JPG',
        alt: 'Kumartuli — Photograph 07',
        aspectRatio: '3:2',
        width: 3715,
        height: 2477,
      },
      {
        id: 'kumartuli-08',
        src: '/images/projects/kumartuli/kumartuli_08.JPG',
        alt: 'Kumartuli — Photograph 08',
        aspectRatio: '3:2',
        width: 3295,
        height: 2197,
      },
      {
        id: 'kumartuli-09',
        src: '/images/projects/kumartuli/kumartuli_09.JPG',
        alt: 'Kumartuli — Photograph 09',
        aspectRatio: '3:2',
        width: 3922,
        height: 2615,
      },
      {
        id: 'kumartuli-10',
        src: '/images/projects/kumartuli/kumartuli_010.jpg',
        alt: 'Kumartuli — Photograph 10',
        aspectRatio: '3:2',
        width: 3393,
        height: 2262,
      },
      {
        id: 'kumartuli-11',
        src: '/images/projects/kumartuli/kumartuli_011.JPG',
        alt: 'Kumartuli — Photograph 11',
        aspectRatio: '3:2',
        width: 4032,
        height: 2688,
      },
      {
        id: 'kumartuli-12',
        src: '/images/projects/kumartuli/kumartuli_012.JPG',
        alt: 'Kumartuli — Photograph 12',
        aspectRatio: '3:2',
        width: 3835,
        height: 2557,
      },
      {
        id: 'kumartuli-13',
        src: '/images/projects/kumartuli/kumartuli_013.JPG',
        alt: 'Kumartuli — Photograph 13',
        aspectRatio: '3:2',
        width: 3538,
        height: 2359,
      },
      {
        id: 'kumartuli-14',
        src: '/images/projects/kumartuli/kumartuli_014.JPG',
        alt: 'Kumartuli — Photograph 14',
        aspectRatio: '3:2',
        width: 3142,
        height: 2095,
      },
      {
        id: 'kumartuli-15',
        src: '/images/projects/kumartuli/kumartuli_015.JPG',
        alt: 'Kumartuli — Photograph 15',
        aspectRatio: '3:2',
        width: 3509,
        height: 2339,
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
