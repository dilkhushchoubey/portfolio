import { Photograph } from '@/types/photography';
import rawManifest from './generated/stills.manifest.json';
import {
  stillsMetadataRegistry,
  resolveStillMetadata,
  getFilenamePriority,
} from './stillsMetadata';

export { getFilenamePriority, stillsMetadataRegistry, resolveStillMetadata };

/**
 * Automatically discovered and synchronized Stills photographs.
 * Sourced from public/images/stills/ with metadata loaded exclusively from stillsMetadata.json.
 */
export const stillsData: Photograph[] = (rawManifest as Photograph[]).map((photo) => {
  const meta = resolveStillMetadata(photo.originalFilename || photo.src);
  const year = meta.year || meta.date;
  const nextPhoto: Photograph = {
    ...photo,
    alt: meta.alt || photo.alt,
    metadata: {
      ...photo.metadata,
      ...(meta.location ? { location: meta.location } : {}),
      ...(year ? { year, date: year } : {}),
      ...(meta.notes ? { notes: meta.notes } : {}),
    },
    ...(meta.column ? { column: meta.column } : {}),
  };
  if (meta.title) {
    nextPhoto.title = meta.title;
  } else {
    delete nextPhoto.title;
  }
  return nextPhoto;
});

/**
 * Returns all standalone still photographs sorted by priority tier and rank.
 */
export function getStillsPhotographs(): Photograph[] {
  return [...stillsData].sort((a, b) => {
    const prioA = getFilenamePriority(a.originalFilename || a.src);
    const prioB = getFilenamePriority(b.originalFilename || b.src);
    if (prioA !== prioB) {
      return prioA - prioB;
    }
    return (a.rank ?? 0) - (b.rank ?? 0);
  });
}

/**
 * Returns left column stills in configured display order.
 */
export function getLeftColumnStills(): Photograph[] {
  return getStillsPhotographs().filter((p) => p.column === 'left');
}

/**
 * Returns right column stills in configured display order.
 */
export function getRightColumnStills(): Photograph[] {
  return getStillsPhotographs().filter((p) => p.column === 'right');
}
