import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { MasonryItem } from '@/data/masonryPortfolio';
import { masonryPortfolioItems } from '@/data/masonryPortfolioItems';

function getJpegDimensions(buffer: Buffer): { width: number; height: number } | null {
  let offset = 2;
  while (offset < buffer.length) {
    while (buffer[offset] === 0xff) offset++;
    const marker = buffer[offset];
    offset++;
    if (marker === 0xd9 || marker === 0xda) break; // EOI or SOS
    const length = buffer.readUInt16BE(offset);
    if (
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf)
    ) {
      const height = buffer.readUInt16BE(offset + 3);
      const width = buffer.readUInt16BE(offset + 5);
      return { width, height };
    }
    offset += length;
  }
  return null;
}

const slotMap: Record<string, string> = {
  '1': '01',
  '2': '02',
  '3': '03',
  '4': '04',
  '5': '05',
  '6': '06',
  '7': '07',
  '8': '08',
  '9': '09',
  '10': '010',
  '11': '011',
  '12': '012',
};

export function getFreshHomepagePortfolioItems(): MasonryItem[] {
  try {
    const homepageDir = path.join(process.cwd(), 'public', 'images', 'homepage');
    if (!fs.existsSync(homepageDir)) {
      return masonryPortfolioItems;
    }

    const filesOnDisk = fs.readdirSync(homepageDir);

    return masonryPortfolioItems.map((item) => {
      const slot = slotMap[item.id];
      if (!slot) return item;

      const matching = filesOnDisk.filter(
        (f) => !f.startsWith('.') && f.split('.')[0] === slot
      );
      if (matching.length === 0) return item;

      const filename = matching[0];
      const filepath = path.join(homepageDir, filename);
      const buffer = fs.readFileSync(filepath);

      const fp = crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 12);
      const dims = getJpegDimensions(buffer);

      let width = item.width;
      let height = item.height;
      let aspectRatio = item.aspectRatio;
      let orientation = item.orientation;

      if (dims) {
        width = dims.width;
        height = dims.height;
        const ratio = width / height;
        aspectRatio =
          Math.abs(ratio - Number(ratio.toFixed(3))) > 0.0001
            ? Number(ratio.toFixed(4))
            : Number(ratio.toFixed(3));
        if (width > height) orientation = 'landscape';
        else if (height > width) orientation = 'portrait';
        else orientation = 'square';
      }

      return {
        ...item,
        src: `/images/homepage/${filename}?v=${fp}`,
        width,
        height,
        aspectRatio,
        orientation,
      };
    });
  } catch (e) {
    console.error('[homepagePortfolio] Error reading disk items, falling back to static:', e);
    return masonryPortfolioItems;
  }
}

