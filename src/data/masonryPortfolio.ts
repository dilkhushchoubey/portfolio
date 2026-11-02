/**
 * Canonical metadata source for homepage photography.
 * Uses only local images from public/images/homepage/.
 * Layout structure:
 * Row 1: Landscape (1) | Portrait (2) | Portrait (3)
 * Row 2: Portrait (4)  | Portrait (5) | Landscape (6)
 * Row 3: Landscape (7) | Portrait (8) | Portrait (9)
 * Row 4: Portrait (10) | Portrait (11) | Landscape (12)
 */

export type ImageOrientation = 'portrait' | 'landscape' | 'square';

export interface MasonryItem {
  id: string;
  title: string;
  category: string;
  location: string;
  year?: string;
  src: string;
  width: number;
  height: number;
  aspectRatio?: number;
  orientation: ImageOrientation;
  mobileSpan?: 1 | 2;
  slug?: string;
  description?: string;
}

/**
 * Derives natural orientation and aspect ratio from item metadata.
 */
export function getItemGeometry(item: MasonryItem): {
  orientation: ImageOrientation;
  aspectRatio: number;
} {
  if (item.orientation) {
    if (item.aspectRatio) {
      return { orientation: item.orientation, aspectRatio: item.aspectRatio };
    }
    if (item.width && item.height) {
      return { orientation: item.orientation, aspectRatio: item.width / item.height };
    }
    const defaultRatio =
      item.orientation === 'landscape' ? 1.5 : item.orientation === 'portrait' ? 0.75 : 1.0;
    return { orientation: item.orientation, aspectRatio: defaultRatio };
  }

  if (item.aspectRatio) {
    const orientation: ImageOrientation =
      item.aspectRatio > 1.15 ? 'landscape' : item.aspectRatio < 0.88 ? 'portrait' : 'square';
    return { orientation, aspectRatio: item.aspectRatio };
  }

  if (item.width && item.height) {
    const ratio = item.width / item.height;
    const orientation: ImageOrientation =
      ratio > 1.15 ? 'landscape' : ratio < 0.88 ? 'portrait' : 'square';
    return { orientation, aspectRatio: ratio };
  }

  return { orientation: 'portrait', aspectRatio: 0.75 };
}


