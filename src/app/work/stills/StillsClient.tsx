'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Photograph } from '@/types/photography';
import PhotographViewer from '@/components/PhotographViewer';
import styles from './StillsLayout.module.css';

interface StillsClientProps {
  photos: Photograph[];
}

/**
 * Reusable editorial photography gallery component.
 *
 * Automatically partitions photographs into two independent vertical columns on
 * desktop/tablet, with a single-column flow on mobile. Column assignment can be
 * explicitly controlled via `photo.column = 'left' | 'right'` in the data, or
 * dynamically balanced when omitted.
 */
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

  // Dynamic & future-proof two-column partitioning:
  // If items define `column`, respect explicit curation.
  // Otherwise, automatically distribute across columns to balance visual height.
  const hasExplicitColumns = photos.some((p) => p.column !== undefined);

  let leftColPhotos: Photograph[] = [];
  let rightColPhotos: Photograph[] = [];

  if (hasExplicitColumns) {
    leftColPhotos = photos.filter((p) => p.column === 'left');
    rightColPhotos = photos.filter((p) => p.column === 'right');
  } else {
    // Dynamic aspect-ratio height balancer for arbitrary collections
    let leftHeight = 0;
    let rightHeight = 0;

    photos.forEach((photo) => {
      const relHeight = photo.height / (photo.width || 1);
      if (leftHeight <= rightHeight) {
        leftColPhotos.push(photo);
        leftHeight += relHeight;
      } else {
        rightColPhotos.push(photo);
        rightHeight += relHeight;
      }
    });
  }

  const renderPlate = (
    photo: Photograph,
    priority = false,
    keyPrefix = 'plate'
  ) => (
    <div
      key={`${keyPrefix}-${photo.id}`}
      className={styles.plateItem}
      onClick={() => openPhoto(photo.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openPhoto(photo.id);
        }
      }}
      aria-label={`Open photograph: ${photo.title || photo.alt}`}
    >
      <div
        className={styles.imageFrame}
        style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          priority={priority}
          className={styles.image}
          sizes="(max-width: 767px) 100vw, (max-width: 1240px) 50vw, 610px"
        />
      </div>
      {(photo.title || photo.metadata?.location) && (
        <div className={styles.plateCaption}>
          {photo.title ? (
            <span className={styles.photoTitle}>{photo.title}</span>
          ) : (
            <span />
          )}
          {photo.metadata?.location && (
            <span className={styles.metaText}>
              {photo.metadata.location}
              {photo.metadata.date ? ` · ${photo.metadata.date}` : ''}
            </span>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Desktop / Tablet Two Independent Columns */}
      <div className={styles.desktopColumns}>
        <div className={styles.columnLeft}>
          {leftColPhotos.map((photo, i) =>
            renderPlate(photo, i === 0, 'desktop-left')
          )}
        </div>
        <div className={styles.columnRight}>
          {rightColPhotos.map((photo, i) =>
            renderPlate(photo, i === 0, 'desktop-right')
          )}
        </div>
      </div>

      {/* Mobile Single Column Flow (< 768px) */}
      <div className={styles.mobileColumns}>
        {photos.map((photo, i) =>
          renderPlate(photo, i === 0, 'mobile')
        )}
      </div>

      {/* Lightbox / Modal Photograph Viewer */}
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
