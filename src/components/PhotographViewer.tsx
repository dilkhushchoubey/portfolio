'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Photograph } from '@/types/photography';
import styles from './PhotographViewer.module.css';

export interface PhotographViewerProps {
  photo: Photograph;
  priority?: boolean;
  isModal?: boolean;
  onClose?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export default function PhotographViewer({
  photo,
  priority = false,
  isModal = false,
  onClose,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}: PhotographViewerProps) {
  const meta = photo.metadata;
  const yearOrDate = meta?.year || meta?.date;
  const hasMeta = meta && (meta.location || yearOrDate || meta.time || meta.notes);
  const shouldRenderModal = isModal || Boolean(onClose);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!shouldRenderModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
      } else if (e.key === 'ArrowLeft' && hasPrev) {
        onPrev?.();
      } else if (e.key === 'ArrowRight' && hasNext) {
        onNext?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [shouldRenderModal, onClose, onPrev, onNext, hasPrev, hasNext]);

  const figurePlate = (
    <>
      <div
        className={shouldRenderModal ? styles.modalFrame : styles.frame}
        style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          priority={priority || shouldRenderModal}
          className={shouldRenderModal ? styles.modalImage : styles.image}
          sizes={
            shouldRenderModal
              ? '(max-width: 1200px) 94vw, 1360px'
              : '(max-width: 900px) 100vw, 1360px'
          }
        />
      </div>

      {shouldRenderModal ? (
        (meta?.location || yearOrDate) && (
          <figcaption className={styles.modalCaptionBar}>
            <span />
            <div className={styles.metadata}>
              {meta?.location && <span className={styles.metaItem}>{meta.location}</span>}
              {meta?.location && yearOrDate && (
                <span className={styles.separator}>·</span>
              )}
              {yearOrDate && <span className={styles.metaItem}>{yearOrDate}</span>}
            </div>
          </figcaption>
        )
      ) : (
        (photo.title || hasMeta) && (
          <figcaption className={styles.captionBar}>
            {photo.title ? <span className={styles.photoTitle}>{photo.title}</span> : <span />}

            {hasMeta && (
              <div className={styles.metadata}>
                {meta.location && <span className={styles.metaItem}>{meta.location}</span>}
                {meta.location && (yearOrDate || meta.time) && (
                  <span className={styles.separator}>·</span>
                )}
                {yearOrDate && <span className={styles.metaItem}>{yearOrDate}</span>}
                {yearOrDate && meta.time && <span className={styles.separator}>·</span>}
                {meta.time && <span className={styles.metaItem}>{meta.time}</span>}
                {meta.notes && (
                  <>
                    {(meta.location || yearOrDate || meta.time) && (
                      <span className={styles.separator}>·</span>
                    )}
                    <span className={styles.metaItem}>{meta.notes}</span>
                  </>
                )}
              </div>
            )}
          </figcaption>
        )
      )}
    </>
  );

  if (!shouldRenderModal) {
    return <figure className={styles.container}>{figurePlate}</figure>;
  }

  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-label={photo.title || meta?.location || 'Photograph Viewer'}
      onClick={onClose}
    >
      <div className={styles.modalControls}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close viewer"
        >
          <span className={styles.closeText}>Close</span>
          <span className={styles.closeIcon} aria-hidden="true">&times;</span>
        </button>
      </div>

      {hasPrev && (
        <button
          type="button"
          className={`${styles.navButton} ${styles.prevButton}`}
          onClick={(e) => {
            e.stopPropagation();
            onPrev?.();
          }}
          aria-label="Previous photograph"
        >
          <span className={styles.navArrow} aria-hidden="true">&larr;</span>
        </button>
      )}

      {hasNext && (
        <button
          type="button"
          className={`${styles.navButton} ${styles.nextButton}`}
          onClick={(e) => {
            e.stopPropagation();
            onNext?.();
          }}
          aria-label="Next photograph"
        >
          <span className={styles.navArrow} aria-hidden="true">&rarr;</span>
        </button>
      )}

      <div className={styles.modalInner} onClick={(e) => e.stopPropagation()}>
        <figure className={styles.modalFigure}>{figurePlate}</figure>
      </div>
    </div>
  );
}
