export interface RawMetadataEntry {
  location?: string;
  year?: string;
  date?: string;
  title?: string;
  notes?: string;
  alt?: string;
  column?: 'left' | 'right';
}

/**
 * Strips priority suffixes (e.g. '_1', '-1', '(1)', ' (1)', '_2', etc.) and extension from filename.
 */
export function getBaseStem(filename: string): string {
  const withoutExt = filename.replace(/\.[^.]+$/, '');
  return withoutExt
    .replace(/\s*\([1-9]\)$/, '')
    .replace(/[_-][1-9]$/, '')
    .trim();
}

/**
 * Extracts hierarchy priority from image filename:
 * 1: Suffix 1 (e.g., _1, -1, (1)) -> Priority 1 (first)
 * 2: Suffix 2 (e.g., _2, -2, (2)) -> Priority 2 (second)
 * 3: Suffix 3 (e.g., _3, -3, (3)) -> Priority 3 (third)
 * 4: No numeric suffix           -> Priority 4 (last)
 */
export function getFilenamePriority(srcOrFilename: string): number {
  const match = srcOrFilename.match(/(?:[_-]|\s*\(|\()([1-9])\)?\.[^.]+$/);
  if (!match) return 4;
  const num = parseInt(match[1], 10);
  if (num === 1) return 1;
  if (num === 2) return 2;
  if (num === 3) return 3;
  return 4;
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
 * Resolves metadata for a given filename from a specific metadata registry.
 * Supports exact filename, stem without extension, base stem (stripping suffixes),
 * and case-insensitive matching.
 */
export function resolveMetadataFromRegistry(
  filename: string,
  registry: Record<string, RawMetadataEntry>
): RawMetadataEntry {
  // 1. Exact filename match
  if (registry[filename]) return registry[filename];

  // 2. Without extension
  const withoutExt = filename.replace(/\.[^.]+$/, '');
  if (registry[withoutExt]) return registry[withoutExt];

  // 3. Base stem
  const baseStem = getBaseStem(filename);
  if (registry[baseStem]) return registry[baseStem];

  // 4. Case-insensitive lookup across filename, stem, and base stem
  const lowerFilename = filename.toLowerCase();
  const lowerWithoutExt = withoutExt.toLowerCase();
  const lowerBaseStem = baseStem.toLowerCase();

  for (const [key, value] of Object.entries(registry)) {
    const lowerKey = key.toLowerCase();
    const keyWithoutExt = lowerKey.replace(/\.[^.]+$/, '');
    const keyBaseStem = getBaseStem(key).toLowerCase();

    if (
      lowerKey === lowerFilename ||
      lowerKey === lowerWithoutExt ||
      lowerKey === lowerBaseStem ||
      keyWithoutExt === lowerWithoutExt ||
      keyBaseStem === lowerBaseStem
    ) {
      return value;
    }
  }

  return {};
}

