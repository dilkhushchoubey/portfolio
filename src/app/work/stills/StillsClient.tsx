'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Photograph } from '@/types/photography';
import PhotographViewer from '@/components/PhotographViewer';
import styles from './StillsLayout.module.css';

interface StillsClientProps {
  photos: Photograph[];
}

export default function StillsClient({ photos }: StillsClientProps) {
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

  // Curated photo-book sequence mapping
  const plate1 =
    photos.find((p) => p.id.includes('monochrome-study') || p.id === 'still-1') || photos[0];
  const diptych1Left =
    photos.find((p) => p.id.includes('divine-veil') || p.id === 'still-3') || photos[1];
  const diptych1Right =
    photos.find((p) => p.id.includes('artisans-touch') || p.id === 'still-4') || photos[2];
  const plate3 =
    photos.find((p) => p.id.includes('sacred-form') || p.id === 'still-5') || photos[3];
  const diptych2Left =
    photos.find((p) => p.id.includes('solitude-in-the-alley') || p.id === 'still-7') || photos[4];
  const diptych2Right =
    photos.find((p) => p.id.includes('incense-and-devotion') || p.id === 'still-9') || photos[5];
  const plate5 =
    photos.find((p) => p.id.includes('master-craftsman') || p.id === 'still-11') || photos[6];
  const plate6 =
    photos.find((p) => p.id.includes('monsoon-over-howrah') || p.id === 'still-12') || photos[7];

  return (
    <div className={styles.container}>
      {/* Spread 1: Opening Landscape Plate */}
      {plate1 && (
        <section className={styles.spreadSingleWide} aria-label={plate1.title}>
          <div
            className={styles.singleWideWrapper}
            onClick={() => openPhoto(plate1.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openPhoto(plate1.id);
              }
            }}
            aria-label={`Open still: ${plate1.title}`}
          >
            <div
              className={styles.imageFrame}
              style={{ aspectRatio: `${plate1.width} / ${plate1.height}` }}
            >
              <Image
                src={plate1.src}
                alt={plate1.alt}
                width={plate1.width}
                height={plate1.height}
                priority
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 940px"
              />
            </div>
            <div className={styles.plateCaption}>
              <span className={styles.photoTitle}>{plate1.title}</span>
              {plate1.metadata?.location && (
                <span className={styles.metaText}>
                  {plate1.metadata.location}
                  {plate1.metadata.date ? ` · ${plate1.metadata.date}` : ''}
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Spread 2: Facing Vertical Diptych */}
      <section className={styles.spreadDiptychFacing} aria-label="Sacred Form Diptych">
        {diptych1Left && (
          <div
            className={styles.diptychCol}
            onClick={() => openPhoto(diptych1Left.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openPhoto(diptych1Left.id);
              }
            }}
            aria-label={`Open still: ${diptych1Left.title}`}
          >
            <div
              className={styles.imageFrame}
              style={{ aspectRatio: `${diptych1Left.width} / ${diptych1Left.height}` }}
            >
              <Image
                src={diptych1Left.src}
                alt={diptych1Left.alt}
                width={diptych1Left.width}
                height={diptych1Left.height}
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 480px"
              />
            </div>
            <div className={styles.plateCaption}>
              <span className={styles.photoTitle}>{diptych1Left.title}</span>
              {diptych1Left.metadata?.location && (
                <span className={styles.metaText}>
                  {diptych1Left.metadata.location}
                  {diptych1Left.metadata.date ? ` · ${diptych1Left.metadata.date}` : ''}
                </span>
              )}
            </div>
          </div>
        )}

        {diptych1Right && (
          <div
            className={`${styles.diptychCol} ${styles.offsetDown}`}
            onClick={() => openPhoto(diptych1Right.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openPhoto(diptych1Right.id);
              }
            }}
            aria-label={`Open still: ${diptych1Right.title}`}
          >
            <div
              className={styles.imageFrame}
              style={{ aspectRatio: `${diptych1Right.width} / ${diptych1Right.height}` }}
            >
              <Image
                src={diptych1Right.src}
                alt={diptych1Right.alt}
                width={diptych1Right.width}
                height={diptych1Right.height}
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 480px"
              />
            </div>
            <div className={styles.plateCaption}>
              <span className={styles.photoTitle}>{diptych1Right.title}</span>
              {diptych1Right.metadata?.location && (
                <span className={styles.metaText}>
                  {diptych1Right.metadata.location}
                  {diptych1Right.metadata.date ? ` · ${diptych1Right.metadata.date}` : ''}
                </span>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Spread 3: Chiaroscuro Form Plate */}
      {plate3 && (
        <section className={styles.spreadSingleMedium} aria-label={plate3.title}>
          <div
            className={styles.singleMediumWrapper}
            onClick={() => openPhoto(plate3.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openPhoto(plate3.id);
              }
            }}
            aria-label={`Open still: ${plate3.title}`}
          >
            <div
              className={styles.imageFrame}
              style={{ aspectRatio: `${plate3.width} / ${plate3.height}` }}
            >
              <Image
                src={plate3.src}
                alt={plate3.alt}
                width={plate3.width}
                height={plate3.height}
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 840px"
              />
            </div>
            <div className={styles.plateCaption}>
              <span className={styles.photoTitle}>{plate3.title}</span>
              {plate3.metadata?.location && (
                <span className={styles.metaText}>
                  {plate3.metadata.location}
                  {plate3.metadata.date ? ` · ${plate3.metadata.date}` : ''}
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Spread 4: Varanasi Dialogue (Landscape + Portrait) */}
      <section className={styles.spreadDiptychMixed} aria-label="Varanasi Dialogue Diptych">
        {diptych2Left && (
          <div
            className={styles.diptychMixedLeft}
            onClick={() => openPhoto(diptych2Left.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openPhoto(diptych2Left.id);
              }
            }}
            aria-label={`Open still: ${diptych2Left.title}`}
          >
            <div
              className={styles.imageFrame}
              style={{ aspectRatio: `${diptych2Left.width} / ${diptych2Left.height}` }}
            >
              <Image
                src={diptych2Left.src}
                alt={diptych2Left.alt}
                width={diptych2Left.width}
                height={diptych2Left.height}
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 640px"
              />
            </div>
            <div className={styles.plateCaption}>
              <span className={styles.photoTitle}>{diptych2Left.title}</span>
              {diptych2Left.metadata?.location && (
                <span className={styles.metaText}>
                  {diptych2Left.metadata.location}
                  {diptych2Left.metadata.date ? ` · ${diptych2Left.metadata.date}` : ''}
                </span>
              )}
            </div>
          </div>
        )}

        {diptych2Right && (
          <div
            className={styles.diptychMixedRight}
            onClick={() => openPhoto(diptych2Right.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openPhoto(diptych2Right.id);
              }
            }}
            aria-label={`Open still: ${diptych2Right.title}`}
          >
            <div
              className={styles.imageFrame}
              style={{ aspectRatio: `${diptych2Right.width} / ${diptych2Right.height}` }}
            >
              <Image
                src={diptych2Right.src}
                alt={diptych2Right.alt}
                width={diptych2Right.width}
                height={diptych2Right.height}
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 420px"
              />
            </div>
            <div className={styles.plateCaption}>
              <span className={styles.photoTitle}>{diptych2Right.title}</span>
              {diptych2Right.metadata?.location && (
                <span className={styles.metaText}>
                  {diptych2Right.metadata.location}
                  {diptych2Right.metadata.date ? ` · ${diptych2Right.metadata.date}` : ''}
                </span>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Spread 5: Intimate Craft Study */}
      {plate5 && (
        <section className={styles.spreadSingleIntimate} aria-label={plate5.title}>
          <div
            className={styles.singleIntimateWrapper}
            onClick={() => openPhoto(plate5.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openPhoto(plate5.id);
              }
            }}
            aria-label={`Open still: ${plate5.title}`}
          >
            <div
              className={styles.imageFrame}
              style={{ aspectRatio: `${plate5.width} / ${plate5.height}` }}
            >
              <Image
                src={plate5.src}
                alt={plate5.alt}
                width={plate5.width}
                height={plate5.height}
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 560px"
              />
            </div>
            <div className={styles.plateCaption}>
              <span className={styles.photoTitle}>{plate5.title}</span>
              {plate5.metadata?.location && (
                <span className={styles.metaText}>
                  {plate5.metadata.location}
                  {plate5.metadata.date ? ` · ${plate5.metadata.date}` : ''}
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Spread 6: Expansive Concluding Wide Spread */}
      {plate6 && (
        <section className={styles.spreadSingleExpansive} aria-label={plate6.title}>
          <div
            className={styles.singleExpansiveWrapper}
            onClick={() => openPhoto(plate6.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openPhoto(plate6.id);
              }
            }}
            aria-label={`Open still: ${plate6.title}`}
          >
            <div
              className={styles.imageFrame}
              style={{ aspectRatio: `${plate6.width} / ${plate6.height}` }}
            >
              <Image
                src={plate6.src}
                alt={plate6.alt}
                width={plate6.width}
                height={plate6.height}
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 1040px"
              />
            </div>
            <div className={styles.plateCaption}>
              <span className={styles.photoTitle}>{plate6.title}</span>
              {plate6.metadata?.location && (
                <span className={styles.metaText}>
                  {plate6.metadata.location}
                  {plate6.metadata.date ? ` · ${plate6.metadata.date}` : ''}
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

