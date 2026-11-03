import { spawn } from 'node:child_process';
import { syncHomepageImages, watchHomepageImages } from './sync-homepage-images.mjs';
import { syncGalleries, watchGalleries } from './sync-galleries.mjs';

// 1. Initial sync of homepage slots and gallery folders from current files on disk
try {
  syncHomepageImages();
} catch (err) {
  console.error('[dev] Initial homepage image sync failed:', err.message);
}

try {
  await syncGalleries();
} catch (err) {
  console.error('[dev] Initial galleries sync failed:', err.message);
}

// 2. Start continuous watchers
const homepageWatcher = watchHomepageImages();
const galleryWatcher = watchGalleries();

// 3. Start Next.js development server
const nextProcess = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
});

function cleanup() {
  if (homepageWatcher) homepageWatcher.close();
  if (galleryWatcher) galleryWatcher.close();
}

process.on('SIGINT', () => {
  cleanup();
  nextProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  cleanup();
  nextProcess.kill('SIGTERM');
  process.exit(0);
});

nextProcess.on('exit', (code) => {
  cleanup();
  process.exit(code || 0);
});
