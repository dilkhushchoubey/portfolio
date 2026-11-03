import rawMetadata from './galleryMetadata.json';

export interface PhotographMetadata {
  title?: string;
  location?: string;
  date?: string;
  notes?: string;
  alt?: string;
  column?: 'left' | 'right';
}

/**
 * Curated registry of photograph metadata.
 * Loaded from src/data/galleryMetadata.json.
 */
export const galleryMetadataRegistry: Record<string, PhotographMetadata> = rawMetadata;

/**
 * Strips priority suffix (e.g. '_1', '_2', '-3') and extension from filename.
 */
export function getBaseStem(filename: string): string {
  const withoutExt = filename.replace(/\.[^.]+$/, '');
  return withoutExt.replace(/[_-][1-9]$/, '');
}

/**
 * Formats a clean, readable fallback title from a filename stem.
 * E.g., 'IMG_0501_1.jpg' -> 'IMG 0501'
 */
export function formatFallbackTitle(filename: string): string {
  const stem = getBaseStem(filename);
  const cleaned = stem.replace(/[-_]+/g, ' ').trim();
  
  if (/^(IMG|DSC|DSCF)\s*\d+$/i.test(cleaned)) {
    return cleaned.toUpperCase();
  }
  
  return cleaned
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Resolves metadata for a given filename using hierarchical lookup.
 */
export function resolveMetadata(filename: string): PhotographMetadata {
  const exact = galleryMetadataRegistry[filename];
  if (exact) return exact;

  const withoutExt = filename.replace(/\.[^.]+$/, '');
  const stemWithoutExt = galleryMetadataRegistry[withoutExt];
  if (stemWithoutExt) return stemWithoutExt;

  const baseStem = getBaseStem(filename);
  const fromBaseStem = galleryMetadataRegistry[baseStem];
  if (fromBaseStem) return fromBaseStem;

  const lowerBase = baseStem.toLowerCase();
  for (const [key, value] of Object.entries(galleryMetadataRegistry)) {
    if (key.toLowerCase() === lowerBase) {
      return value;
    }
  }

  return {};
}
