'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Photograph } from '@/types/photography';
import PhotographViewer from '@/components/PhotographViewer';
import styles from './PortraitsLayout.module.css';

interface PortraitsClientProps {
  photos: Photograph[];
}

export default function PortraitsClient({ photos }: PortraitsClientProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const activePhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  const handleClose = () => setSelectedIndex(null);

  const handlePrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < photos.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const openPhoto = (photoId: string) => {
    const idx = photos.findIndex((p) => p.id === photoId);
    if (idx !== -1) {
      setSelectedIndex(idx);
    }
  };

  // Curated layout assignments for the 4 individual portraits
  const heroLead =
    photos.find((p) => p.id.includes('nomad-of-thar') || p.id === 'portrait-10') || photos[3];
  const diptychLandscape =
    photos.find((p) => p.id.includes('colors-of-braj') || p.id === 'portrait-6') || photos[1];
  const diptychPortrait =
    photos.find((p) => p.id.includes('reflections-on-the-hooghly') || p.id === 'portrait-2') ||
    photos[0];
  const cinematicEnding =
    photos.find((p) => p.id.includes('quiet-transit') || p.id === 'portrait-8') || photos[2];

  return (
    <div className={styles.container}>
      {/* Editorial Spread 1: Hero Lead Portrait */}
      {heroLead && (
        <section className={styles.spreadHero} aria-label={heroLead.title}>
          <div
            className={styles.heroWrapper}
            onClick={() => openPhoto(heroLead.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openPhoto(heroLead.id);
              }
            }}
            aria-label={`Open portrait: ${heroLead.title}`}
          >
            <div
              className={styles.imageFrame}
              style={{ aspectRatio: `${heroLead.width} / ${heroLead.height}` }}
            >
              <Image
                src={heroLead.src}
                alt={heroLead.alt}
                width={heroLead.width}
                height={heroLead.height}
                priority
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 580px"
              />
            </div>
            <div className={styles.plateCaption}>
              <span className={styles.photoTitle}>{heroLead.title}</span>
              {heroLead.metadata?.location && (
                <span className={styles.metaText}>
                  {heroLead.metadata.location}
                  {heroLead.metadata.date ? ` · ${heroLead.metadata.date}` : ''}
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Editorial Spread 2: Asymmetrical Counterpoint Diptych */}
      <section className={styles.spreadDiptych} aria-label="Portrait Diptych">
        {diptychLandscape && (
          <div
            className={styles.diptychLeft}
            onClick={() => openPhoto(diptychLandscape.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openPhoto(diptychLandscape.id);
              }
            }}
            aria-label={`Open portrait: ${diptychLandscape.title}`}
          >
            <div
              className={styles.imageFrame}
              style={{ aspectRatio: `${diptychLandscape.width} / ${diptychLandscape.height}` }}
            >
              <Image
                src={diptychLandscape.src}
                alt={diptychLandscape.alt}
                width={diptychLandscape.width}
                height={diptychLandscape.height}
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 680px"
              />
            </div>
            <div className={styles.plateCaption}>
              <span className={styles.photoTitle}>{diptychLandscape.title}</span>
              {diptychLandscape.metadata?.location && (
                <span className={styles.metaText}>
                  {diptychLandscape.metadata.location}
                  {diptychLandscape.metadata.date ? ` · ${diptychLandscape.metadata.date}` : ''}
                </span>
              )}
            </div>
          </div>
        )}

        {diptychPortrait && (
          <div
            className={styles.diptychRight}
            onClick={() => openPhoto(diptychPortrait.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openPhoto(diptychPortrait.id);
              }
            }}
            aria-label={`Open portrait: ${diptychPortrait.title}`}
          >
            <div
              className={styles.imageFrame}
              style={{ aspectRatio: `${diptychPortrait.width} / ${diptychPortrait.height}` }}
            >
              <Image
                src={diptychPortrait.src}
                alt={diptychPortrait.alt}
                width={diptychPortrait.width}
                height={diptychPortrait.height}
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 440px"
              />
            </div>
            <div className={styles.plateCaption}>
              <span className={styles.photoTitle}>{diptychPortrait.title}</span>
              {diptychPortrait.metadata?.location && (
                <span className={styles.metaText}>
                  {diptychPortrait.metadata.location}
                  {diptychPortrait.metadata.date ? ` · ${diptychPortrait.metadata.date}` : ''}
                </span>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Editorial Spread 3: Cinematic Concluding Portrait */}
      {cinematicEnding && (
        <section className={styles.spreadCinematic} aria-label={cinematicEnding.title}>
          <div
            className={styles.cinematicWrapper}
            onClick={() => openPhoto(cinematicEnding.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openPhoto(cinematicEnding.id);
              }
            }}
            aria-label={`Open portrait: ${cinematicEnding.title}`}
          >
            <div
              className={styles.imageFrame}
              style={{ aspectRatio: `${cinematicEnding.width} / ${cinematicEnding.height}` }}
            >
              <Image
                src={cinematicEnding.src}
                alt={cinematicEnding.alt}
                width={cinematicEnding.width}
                height={cinematicEnding.height}
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 920px"
              />
            </div>
            <div className={styles.plateCaption}>
              <span className={styles.photoTitle}>{cinematicEnding.title}</span>
              {cinematicEnding.metadata?.location && (
                <span className={styles.metaText}>
                  {cinematicEnding.metadata.location}
                  {cinematicEnding.metadata.date ? ` · ${cinematicEnding.metadata.date}` : ''}
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Reused PhotographViewer Modal */}
      {activePhoto && (
        <PhotographViewer
          photo={activePhoto}
          isModal
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={selectedIndex !== null && selectedIndex > 0}
          hasNext={selectedIndex !== null && selectedIndex < photos.length - 1}
        />
      )}
    </div>
  );
}

