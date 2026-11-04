import rawMetadata from './stillsMetadata.json';
import {
  RawMetadataEntry,
  resolveMetadataFromRegistry,
  formatFallbackTitle,
  getBaseStem,
  getFilenamePriority,
} from './metadataUtils';

export type { RawMetadataEntry };

/**
 * Dedicated metadata registry for Stills photographs.
 * Sourced strictly from src/data/stillsMetadata.json.
 */
export const stillsMetadataRegistry: Record<string, RawMetadataEntry> = rawMetadata;

/**
 * Resolves metadata specifically for a still photograph.
 */
export function resolveStillMetadata(filename: string): RawMetadataEntry {
  return resolveMetadataFromRegistry(filename, stillsMetadataRegistry);
}

export { formatFallbackTitle, getBaseStem, getFilenamePriority };

