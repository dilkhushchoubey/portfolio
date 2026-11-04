import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const stillsDir = path.join(rootDir, 'public', 'images', 'stills');
const portraitsDir = path.join(rootDir, 'public', 'images', 'portraits');
const portraitsMetadataFile = path.join(rootDir, 'src', 'data', 'portraitsMetadata.json');
const stillsMetadataFile = path.join(rootDir, 'src', 'data', 'stillsMetadata.json');
const generatedDir = path.join(rootDir, 'src', 'data', 'generated');

const SUPPORTED_EXTS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.heic',
  '.JPG',
  '.JPEG',
  '.PNG',
  '.WEBP',
  '.HEIC',
]);

/**
 * Strips priority suffixes (e.g. '_1', '-1', '(1)', ' (1)', '_2', etc.) and extension from filename.
 */
function getBaseStem(filename) {
  const withoutExt = filename.replace(/\.[^.]+$/, '');
  return withoutExt
    .replace(/\s*\([1-9]\)$/, '')
    .replace(/[_-][1-9]$/, '')
    .trim();
}

/**
 * Formats a clean, readable fallback title from a filename stem.
 */
function formatFallbackTitle(filename) {
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
 * Resolves metadata for a given filename using hierarchical and case-insensitive lookup.
 */
function resolveMetadata(filename, registry) {
  if (!registry || typeof registry !== 'object') return {};

  if (registry[filename]) return registry[filename];

  const withoutExt = filename.replace(/\.[^.]+$/, '');
  if (registry[withoutExt]) return registry[withoutExt];

  const baseStem = getBaseStem(filename);
  if (registry[baseStem]) return registry[baseStem];

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

/**
 * Determines aspect ratio string representation from dimensions.
 */
function computeAspectRatio(width, height) {
  const r = width / height;
  if (Math.abs(r - 1.5) < 0.05) return '3:2';
  if (Math.abs(r - 1.333) < 0.05) return '4:3';
  if (Math.abs(r - 1.777) < 0.05) return '16:9';
  if (Math.abs(r - 0.75) < 0.05) return '3:4';
  if (Math.abs(r - 0.667) < 0.05) return '2:3';
  if (Math.abs(r - 1.0) < 0.05) return '1:1';
  return `${width}:${height}`;
}

/**
 * Extracts hierarchy priority for gallery items:
 * 1: suffix 1 (_1, -1, (1))
 * 2: suffix 2 (_2, -2, (2))
 * 3: suffix 3 (_3, -3, (3))
 * 4: no numeric suffix
 */
export function getFilenamePriority(filename) {
  const match = filename.match(/(?:[_-]|\s*\(|\()([1-9])\)?\.[^.]+$/);
  if (!match) return 4;
  const num = parseInt(match[1], 10);
  if (num === 1) return 1;
  if (num === 2) return 2;
  if (num === 3) return 3;
  return 4;
}

/**
 * Converts HEIC file to JPEG if needed, ensuring universal browser compatibility.
 */
function ensureWebCompatible(folder, filename) {
  const isHeic = /\.heic$/i.test(filename);
  if (!isHeic) {
    return `/images/${folder}/${filename}`;
  }

  const baseName = filename.replace(/\.heic$/i, '');
  const webRelDir = `images/_web/${folder}`;
  const webOutDir = path.join(rootDir, 'public', webRelDir);
  if (!fs.existsSync(webOutDir)) {
    fs.mkdirSync(webOutDir, { recursive: true });
  }

  const outFilename = `${baseName}.jpg`;
  const outPath = path.join(webOutDir, outFilename);
  const srcPath = path.join(rootDir, 'public', 'images', folder, filename);

  let needsConversion = true;
  if (fs.existsSync(outPath)) {
    const srcMtime = fs.statSync(srcPath).mtimeMs;
    const outMtime = fs.statSync(outPath).mtimeMs;
    if (outMtime >= srcMtime) {
      needsConversion = false;
    }
  }

  if (needsConversion) {
    try {
      execSync(`sips -s format jpeg "${srcPath}" --out "${outPath}"`, {
        stdio: 'ignore',
      });
    } catch {
      console.warn(`[sync-galleries] Warning: sips conversion failed for ${filename}, falling back to original.`);
      return `/images/${folder}/${filename}`;
    }
  }

  return `/${webRelDir}/${outFilename}`;
}

/**
 * Cleans up orphaned converted files in _web folder when original HEIC is deleted.
 */
function cleanOrphanedWebFiles(folder, activeFiles) {
  const webDir = path.join(rootDir, 'public', 'images', '_web', folder);
  if (!fs.existsSync(webDir)) return;

  const activeBases = new Set(
    activeFiles.map((f) => f.replace(/\.[^.]+$/, '').toLowerCase())
  );

  const existingWebFiles = fs.readdirSync(webDir);
  for (const wf of existingWebFiles) {
    if (wf.startsWith('.')) continue;
    const base = wf.replace(/\.[^.]+$/, '').toLowerCase();
    if (!activeBases.has(base)) {
      try {
        fs.unlinkSync(path.join(webDir, wf));
      } catch {
        // ignore
      }
    }
  }
}

/**
 * Scans an image directory and returns sorted photographs.
 * Applies the exact filename priority hierarchy to all galleries:
 * Priority 1 (ends in 1) -> Priority 2 (ends in 2) -> Priority 3 (ends in 3) -> Priority 4 (no suffix)
 * Within each priority group, uses natural filename ordering.
 */
async function processGalleryFolder(folderName, folderPath, registry) {
  if (!fs.existsSync(folderPath)) {
    console.warn(`[sync-galleries] Folder not found: ${folderPath}`);
    return [];
  }

  const rawEntries = fs.readdirSync(folderPath);
  const validFiles = rawEntries.filter((f) => {
    if (f.startsWith('.')) return false;
    const ext = path.extname(f);
    return SUPPORTED_EXTS.has(ext);
  });

  // Clean up any orphaned derived files
  cleanOrphanedWebFiles(folderName, validFiles);

  // Universal priority sorting for both Stills and Portraits
  validFiles.sort((a, b) => {
    const prioA = getFilenamePriority(a);
    const prioB = getFilenamePriority(b);
    if (prioA !== prioB) return prioA - prioB;
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  });

  const items = [];

  for (let i = 0; i < validFiles.length; i++) {
    const filename = validFiles[i];
    const filepath = path.join(folderPath, filename);

    let width = 3000;
    let height = 2000;

    try {
      const meta = await sharp(filepath).metadata();
      if (meta.width && meta.height) {
        width = meta.width;
        height = meta.height;
      }
    } catch {
      // Fallback to sips if sharp fails on any file
      try {
        const out = execSync(`sips -g pixelWidth -g pixelHeight "${filepath}"`, {
          encoding: 'utf8',
        });
        const wMatch = out.match(/pixelWidth:\s*(\d+)/);
        const hMatch = out.match(/pixelHeight:\s*(\d+)/);
        if (wMatch && hMatch) {
          width = parseInt(wMatch[1], 10);
          height = parseInt(hMatch[1], 10);
        }
      } catch (err) {
        console.warn(`[sync-galleries] Could not read dimensions for ${filename}:`, err.message);
      }
    }

    const webSrc = ensureWebCompatible(folderName, filename);
    const meta = resolveMetadata(filename, registry);
    const title = meta.title;
    const year = meta.year || meta.date;
    const alt =
      meta.alt ||
      (title
        ? `${title} — Photograph by Dilkhush Choubey`
        : meta.location
          ? `${meta.location} — Photograph by Dilkhush Choubey`
          : `${formatFallbackTitle(filename)} — Photograph by Dilkhush Choubey`);
    const fileStem = filename.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const cleanId = `${folderName.slice(0, -1)}-${fileStem}`;

    const photo = {
      id: cleanId,
      src: webSrc,
      originalFilename: filename,
      alt,
      aspectRatio: computeAspectRatio(width, height),
      width,
      height,
      rank: i + 1,
    };

    if (title) {
      photo.title = title;
    }

    if (meta.location || year || meta.notes) {
      photo.metadata = {
        ...(meta.location ? { location: meta.location } : {}),
        ...(year ? { year: year, date: year } : {}),
        ...(meta.notes ? { notes: meta.notes } : {}),
      };
    }

    if (meta.column) {
      photo.column = meta.column;
    }

    items.push(photo);
  }

  // Dynamic two-column aspect-ratio balancing for items without explicit column designation
  let leftHeight = 0;
  let rightHeight = 0;

  items.forEach((item) => {
    const relHeight = item.height / (item.width || 1);
    if (item.column === 'left') {
      leftHeight += relHeight;
    } else if (item.column === 'right') {
      rightHeight += relHeight;
    } else {
      if (leftHeight <= rightHeight) {
        item.column = 'left';
        leftHeight += relHeight;
      } else {
        item.column = 'right';
        rightHeight += relHeight;
      }
    }
  });

  return items;
}

/**
 * Loads JSON metadata registry file safely.
 */
function loadJsonRegistry(filePath) {
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
      console.warn(`[sync-galleries] Warning: could not parse ${filePath}:`, err.message);
    }
  }
  return {};
}

/**
 * Main synchronisation function for Portraits and Stills galleries.
 */
export async function syncGalleries() {
  if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir, { recursive: true });
  }

  const stillsRegistry = loadJsonRegistry(stillsMetadataFile);
  const portraitsRegistry = loadJsonRegistry(portraitsMetadataFile);

  // 1. Process Stills with stillsMetadata.json
  const stills = await processGalleryFolder(
    'stills',
    stillsDir,
    stillsRegistry
  );
  const stillsManifestPath = path.join(generatedDir, 'stills.manifest.json');
  fs.writeFileSync(stillsManifestPath, JSON.stringify(stills, null, 2), 'utf8');

  // 2. Process Portraits with portraitsMetadata.json
  const portraits = await processGalleryFolder(
    'portraits',
    portraitsDir,
    portraitsRegistry
  );
  const portraitsManifestPath = path.join(generatedDir, 'portraits.manifest.json');
  fs.writeFileSync(portraitsManifestPath, JSON.stringify(portraits, null, 2), 'utf8');

  console.log(
    `[sync-galleries] Synchronized ${stills.length} stills and ${portraits.length} portraits.`
  );

  return { stills, portraits };
}

/**
 * Continuous watcher for development mode.
 */
export function watchGalleries() {
  let timeout = null;

  const triggerSync = (eventType, filename) => {
    if (!filename || filename.startsWith('.')) return;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(async () => {
      try {
        console.log(`[watch-galleries] Change detected (${eventType}: ${filename}), regenerating gallery manifests...`);
        await syncGalleries();
      } catch (err) {
        console.error('[watch-galleries] Error during sync:', err.message);
      }
    }, 150);
  };

  const watchers = [];
  for (const d of [stillsDir, portraitsDir]) {
    if (fs.existsSync(d)) {
      watchers.push(fs.watch(d, triggerSync));
    }
  }

  for (const mf of [portraitsMetadataFile, stillsMetadataFile]) {
    if (fs.existsSync(mf)) {
      watchers.push(fs.watch(mf, triggerSync));
    }
  }

  console.log(`[watch-galleries] Watching stills and portraits for live folder updates...`);

  return {
    close: () => {
      watchers.forEach((w) => w.close());
    },
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const isWatch = process.argv.includes('--watch');
  syncGalleries().then(() => {
    if (isWatch) {
      watchGalleries();
    }
  });
}
