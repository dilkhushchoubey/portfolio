import { portraitsMetadataRegistry } from './portraitsMetadata';
import { stillsMetadataRegistry } from './stillsMetadata';
import {
  RawMetadataEntry,
  resolveMetadataFromRegistry,
  formatFallbackTitle,
  getBaseStem,
  getFilenamePriority,
} from './metadataUtils';

export type PhotographMetadata = RawMetadataEntry;

/**
 * Combined registry maintained for backwards compatibility.
 * Use portraitsMetadata.ts or stillsMetadata.ts directly.
 */
export const galleryMetadataRegistry: Record<string, RawMetadataEntry> = {
  ...portraitsMetadataRegistry,
  ...stillsMetadataRegistry,
};

export { formatFallbackTitle, getBaseStem, getFilenamePriority };

/**
 * Resolves metadata across combined registries (deprecated: prefer resolvePortraitMetadata or resolveStillMetadata).
 */
export function resolveMetadata(filename: string): RawMetadataEntry {
  return resolveMetadataFromRegistry(filename, galleryMetadataRegistry);
}
