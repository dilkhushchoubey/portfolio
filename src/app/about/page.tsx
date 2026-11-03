import type { Metadata } from 'next';
import Image from 'next/image';
import fs from 'node:fs';
import path from 'node:path';
import { siteConfig } from '@/data/siteConfig';
import { aboutData } from '@/data/about';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About',
  description: `About ${siteConfig.name}, photographer based in Kolkata, India.`,
};

/**
 * Resolves the uploaded portrait photograph from public/images/about/portrait/.
 * Throws an explicit error with directory contents if the image cannot be found.
 */
function resolvePortraitSrc(): string {
  // 1. Verify configured path in aboutData exists on disk
  if (aboutData.portrait.src) {
    const relativeClean = aboutData.portrait.src.split('?')[0].replace(/^\//, '');
    const configuredPath = path.join(process.cwd(), 'public', relativeClean);
    if (fs.existsSync(configuredPath)) {
      return aboutData.portrait.src;
    }
  }

  // 2. Inspect public/images/about/portrait/ directory
  const portraitDir = path.join(process.cwd(), 'public', 'images', 'about', 'portrait');
  if (fs.existsSync(portraitDir)) {
    const files = fs
      .readdirSync(portraitDir)
      .filter((f) => !f.startsWith('.') && /\.(jpe?g|png|webp|avif)$/i.test(f));
    if (files.length > 0) {
      const match = files.find((f) => f.includes('DSC01862')) || files[0];
      return `/images/about/portrait/${match}`;
    }
    const allFiles = fs.readdirSync(portraitDir);
    throw new Error(
      `No photograph found in public/images/about/portrait/. Files found: [${allFiles.join(', ')}]`
    );
  }

  throw new Error(`Directory not found: ${portraitDir}`);
}

export default function AboutPage() {
  const portraitSrc = resolvePortraitSrc();

  return (
    <div className={styles.container}>
      {/* 1. Desktop Two-Column Section: Portrait (Left ~50%) | Biography (Right ~50%) */}
      <section className={styles.mainSection}>
        <div className={styles.portraitColumn}>
          <div className={styles.portraitFrame}>
            <Image
              src={portraitSrc}
              alt={aboutData.portrait.alt}
              fill
              priority
              sizes="(max-width: 680px) 100vw, 50vw"
              className={styles.portraitImage}
            />
          </div>
        </div>

        <div className={styles.biographyColumn}>
          {aboutData.biography.map((paragraph, index) => (
            <p key={index} className={styles.bioPara}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* 2. Standalone Editorial Pull Quote (Immediately below the complete two-column section) */}
      <blockquote className={styles.standaloneQuote}>
        <p className={styles.quoteText}>{aboutData.quote}</p>
      </blockquote>
    </div>
  );
}
