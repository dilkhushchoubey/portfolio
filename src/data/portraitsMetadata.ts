import rawMetadata from './portraitsMetadata.json';
import {
  RawMetadataEntry,
  resolveMetadataFromRegistry,
  formatFallbackTitle,
  getBaseStem,
  getFilenamePriority,
} from './metadataUtils';

export type { RawMetadataEntry };

/**
 * Dedicated metadata registry for Portraits photographs.
 * Sourced strictly from src/data/portraitsMetadata.json.
 */
export const portraitsMetadataRegistry: Record<string, RawMetadataEntry> = rawMetadata;

/**
 * Resolves metadata specifically for a portrait photograph.
 */
export function resolvePortraitMetadata(filename: string): RawMetadataEntry {
  return resolveMetadataFromRegistry(filename, portraitsMetadataRegistry);
}

export { formatFallbackTitle, getBaseStem, getFilenamePriority };

