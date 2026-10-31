import { spawn } from 'node:child_process';
import { syncHomepageImages, watchHomepageImages } from './sync-homepage-images.mjs';

// 1. Initial sync of all 12 slots from current files on disk
try {
  syncHomepageImages();
} catch (err) {
  console.error('[dev] Initial homepage image sync failed:', err.message);
}

// 2. Start continuous watcher for public/images/homepage
const watcher = watchHomepageImages();

// 3. Start Next.js development server
const nextProcess = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
});

process.on('SIGINT', () => {
  if (watcher) watcher.close();
  nextProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  if (watcher) watcher.close();
  nextProcess.kill('SIGTERM');
  process.exit(0);
});

nextProcess.on('exit', (code) => {
  if (watcher) watcher.close();
  process.exit(code || 0);
});
