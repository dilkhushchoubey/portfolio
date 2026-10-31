import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const homepageDir = path.join(rootDir, 'public', 'images', 'homepage');
const itemsFile = path.join(rootDir, 'src', 'data', 'masonryPortfolioItems.ts');

const slots = [
  { id: '1', slot: '01' },
  { id: '2', slot: '02' },
  { id: '3', slot: '03' },
  { id: '4', slot: '04' },
  { id: '5', slot: '05' },
  { id: '6', slot: '06' },
  { id: '7', slot: '07' },
  { id: '8', slot: '08' },
  { id: '9', slot: '09' },
  { id: '10', slot: '010' },
  { id: '11', slot: '011' },
  { id: '12', slot: '012' },
];

function getJpegDimensions(buffer) {
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

export function syncHomepageImages() {
  if (!fs.existsSync(homepageDir)) {
    throw new Error(`Homepage images directory not found: ${homepageDir}`);
  }

  const filesOnDisk = fs.readdirSync(homepageDir);
  const metadataMap = new Map();

  for (const { id, slot } of slots) {
    const matching = filesOnDisk.filter(
      (f) => !f.startsWith('.') && f.split('.')[0] === slot
    );

    if (matching.length === 0) {
      throw new Error(`Missing image file for slot ${slot} in ${homepageDir}`);
    }
    if (matching.length > 1) {
      throw new Error(`Multiple image files found for slot ${slot}: ${matching.join(', ')}`);
    }

    const filename = matching[0];
    const filepath = path.join(homepageDir, filename);
    const buffer = fs.readFileSync(filepath);

    const fullHash = crypto.createHash('sha256').update(buffer).digest('hex');
    const fingerprint = fullHash.slice(0, 12);

    const dims = getJpegDimensions(buffer);
    if (!dims) {
      throw new Error(`Could not parse dimensions for ${filename}`);
    }

    const { width, height } = dims;
    const ratio = width / height;
    const aspectRatio =
      Math.abs(ratio - Number(ratio.toFixed(3))) > 0.0001
        ? Number(ratio.toFixed(4))
        : Number(ratio.toFixed(3));

    let orientation = 'square';
    if (width > height) orientation = 'landscape';
    else if (height > width) orientation = 'portrait';

    metadataMap.set(id, {
      id,
      slot,
      filename,
      src: `/images/homepage/${filename}?v=${fingerprint}`,
      width,
      height,
      aspectRatio,
      orientation,
      fingerprint,
      fullHash,
      fileSize: buffer.length,
    });
  }

  // Update src/data/masonryPortfolioItems.ts
  let tsContent = fs.readFileSync(itemsFile, 'utf8');

  for (const [id, meta] of metadataMap.entries()) {
    // Match block for this ID: id: '1' ... up to closing brace
    const blockRegex = new RegExp(
      `(\\{\\s*id:\\s*['"]${id}['"][\\s\\S]*?\\})`,
      'm'
    );
    const match = tsContent.match(blockRegex);
    if (!match) {
      throw new Error(`Could not find item with id '${id}' in ${itemsFile}`);
    }

    let block = match[1];

    // Update src
    block = block.replace(/src:\s*['"][^'"]*['"]/, `src: '${meta.src}'`);
    // Update width
    block = block.replace(/width:\s*\d+/, `width: ${meta.width}`);
    // Update height
    block = block.replace(/height:\s*\d+/, `height: ${meta.height}`);
    // Update aspectRatio
    block = block.replace(/aspectRatio:\s*[0-9.]+/, `aspectRatio: ${meta.aspectRatio}`);
    // Update orientation
    block = block.replace(
      /orientation:\s*['"][^'"]*['"]/,
      `orientation: '${meta.orientation}'`
    );

    tsContent = tsContent.replace(match[1], block);
  }

  fs.writeFileSync(itemsFile, tsContent, 'utf8');
  console.log(`[sync-homepage-images] Successfully synchronized ${metadataMap.size} homepage images.`);
  return metadataMap;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  syncHomepageImages();
}

