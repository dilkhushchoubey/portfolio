import { Photograph } from '@/types/photography';
import rawManifest from './generated/portraits.manifest.json';
import {
  portraitsMetadataRegistry,
  resolvePortraitMetadata,
  getFilenamePriority,
} from './portraitsMetadata';

export { getFilenamePriority, portraitsMetadataRegistry, resolvePortraitMetadata };

/**
 * Automatically discovered and synchronized Portrait photographs.
 * Sourced from public/images/portraits/ with metadata loaded exclusively from portraitsMetadata.json.
 */
export const portraitsData: Photograph[] = (rawManifest as Photograph[]).map((photo) => {
  const meta = resolvePortraitMetadata(photo.originalFilename || photo.src);
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
 * Returns all standalone portrait photographs sorted strictly by filename priority
 * (Priority 1 -> Priority 2 -> Priority 3 -> No suffix), then by rank.
 */
export function getPortraitsPhotographs(): Photograph[] {
  return [...portraitsData].sort((a, b) => {
    const prioA = getFilenamePriority(a.originalFilename || a.src);
    const prioB = getFilenamePriority(b.originalFilename || b.src);
    if (prioA !== prioB) {
      return prioA - prioB;
    }
    return (a.rank ?? 0) - (b.rank ?? 0);
  });
}

/**
 * Returns left column portraits in configured display order.
 */
export function getLeftColumnPortraits(): Photograph[] {
  return getPortraitsPhotographs().filter((p) => p.column === 'left');
}

/**
 * Returns right column portraits in configured display order.
 */
export function getRightColumnPortraits(): Photograph[] {
  return getPortraitsPhotographs().filter((p) => p.column === 'right');
}
